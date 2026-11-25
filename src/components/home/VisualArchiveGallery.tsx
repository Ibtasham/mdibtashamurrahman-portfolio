import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowUpRight,
  Award,
  Calendar,
  Expand,
  FileBadge2,
  FolderKanban,
  Images,
  LayoutGrid,
  RotateCcw,
  Search,
  Sparkles,
} from 'lucide-react';
import { VISUAL_ARCHIVE } from '../../data/portfolio';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import type { VisualArchiveItem } from '../../types/portfolio';
import {
  countVisualArchiveByCategory,
  countVisualArchiveByKind,
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

function slugifyGroup(label: string): string {
  return `archive-group-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

export function VisualArchiveGallery() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = useMemo<VisualArchiveCategoryFilter>(() => {
    const raw = searchParams.get('category');
    return raw && CATEGORY_TABS.includes(raw as VisualArchiveCategoryFilter)
      ? (raw as VisualArchiveCategoryFilter)
      : 'All';
  }, [searchParams]);

  const initialKind = useMemo<VisualArchiveKindFilter>(() => {
    const raw = searchParams.get('kind');
    return raw && KIND_TABS.includes(raw as VisualArchiveKindFilter)
      ? (raw as VisualArchiveKindFilter)
      : 'All';
  }, [searchParams]);

  const initialView = useMemo<'grid' | 'events'>(() => {
    return searchParams.get('view') === 'events' ? 'events' : 'grid';
  }, [searchParams]);

  const [selectedCategory, setSelectedCategory] =
    useState<VisualArchiveCategoryFilter>(initialCategory);
  const [selectedKind, setSelectedKind] =
    useState<VisualArchiveKindFilter>(initialKind);
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [viewMode, setViewMode] = useState<'grid' | 'events'>(initialView);
  const [activeItem, setActiveItem] = useState<VisualArchiveItem | null>(null);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSelectedKind(initialKind);
  }, [initialKind]);

  useEffect(() => {
    setViewMode(initialView);
  }, [initialView]);

  const syncParams = (
    nextCategory: VisualArchiveCategoryFilter,
    nextKind: VisualArchiveKindFilter,
    nextQuery: string,
    nextView: 'grid' | 'events',
  ) => {
    const params = new URLSearchParams();
    if (nextCategory !== 'All') params.set('category', nextCategory);
    if (nextKind !== 'All') params.set('kind', nextKind);
    if (nextQuery.trim()) params.set('q', nextQuery.trim());
    if (nextView !== 'grid') params.set('view', nextView);
    setSearchParams(params, { replace: true });
  };

  const handleCategoryChange = (cat: VisualArchiveCategoryFilter) => {
    setSelectedCategory(cat);
    syncParams(cat, selectedKind, query, viewMode);
  };

  const handleKindChange = (kind: VisualArchiveKindFilter) => {
    setSelectedKind(kind);
    syncParams(selectedCategory, kind, query, viewMode);
  };

  const handleQueryChange = (nextQ: string) => {
    setQuery(nextQ);
    syncParams(selectedCategory, selectedKind, nextQ, viewMode);
  };

  const handleViewChange = (nextView: 'grid' | 'events') => {
    setViewMode(nextView);
    syncParams(selectedCategory, selectedKind, query, nextView);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedKind('All');
    setQuery('');
    setViewMode('grid');
    setSearchParams({}, { replace: true });
  };

  const categoryCounts = useMemo(
    () => countVisualArchiveByCategory(VISUAL_ARCHIVE),
    [],
  );

  const kindCounts = useMemo(
    () => countVisualArchiveByKind(VISUAL_ARCHIVE),
    [],
  );

  const allEventGroupsCount = useMemo(
    () => groupVisualArchiveByEvent(VISUAL_ARCHIVE).length,
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

  const isFiltered =
    selectedCategory !== 'All' || selectedKind !== 'All' || query.trim().length > 0;

  return (
    <section
      aria-label="Visual Achievement Archive Gallery"
      className="border-b border-wood-subtle dark:border-slate-800/80 bg-wood-canvas dark:bg-[#050914] py-10 sm:py-14"
    >
      <div className={`${DESIGN_TOKENS.spacing.container} space-y-8`}>
        {/* Interactive Archival Summary Strip */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <button
            type="button"
            onClick={resetFilters}
            className={`group rounded-[14px] border p-4 text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
              !isFiltered && viewMode === 'grid'
                ? 'border-blue-600/70 bg-blue-50/80 dark:border-blue-500/60 dark:bg-blue-600/15'
                : 'border-wood-subtle dark:border-slate-800 bg-wood-surface dark:bg-[#0b1222] hover:border-blue-500/50'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-wood-muted dark:text-slate-400">
                Total Archive
              </span>
              <Images className="h-4 w-4 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
            </div>
            <p className="mt-1.5 font-display text-2xl font-semibold text-wood-ink dark:text-slate-50 tabular-nums">
              {VISUAL_ARCHIVE.length}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-blue-700 dark:text-cyan-300">
              Verified photos, certificates &amp; media
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              const next = selectedKind === 'Certificate' ? 'All' : 'Certificate';
              handleKindChange(next);
            }}
            className={`group rounded-[14px] border p-4 text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
              selectedKind === 'Certificate'
                ? 'border-blue-600/70 bg-blue-50/80 dark:border-blue-500/60 dark:bg-blue-600/15'
                : 'border-wood-subtle dark:border-slate-800 bg-wood-surface dark:bg-[#0b1222] hover:border-blue-500/50'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-wood-muted dark:text-slate-400">
                Certificates
              </span>
              <Award className="h-4 w-4 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
            </div>
            <p className="mt-1.5 font-display text-2xl font-semibold text-wood-ink dark:text-slate-50 tabular-nums">
              {kindCounts.Certificate}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-blue-700 dark:text-cyan-300">
              {selectedKind === 'Certificate' ? 'Active filter · Click to clear' : 'Click to filter certificates'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              const next = selectedKind === 'Official Poster' ? 'Appointment Letter' : selectedKind === 'Appointment Letter' ? 'All' : 'Official Poster';
              handleKindChange(next);
            }}
            className={`group rounded-[14px] border p-4 text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
              selectedKind === 'Official Poster' || selectedKind === 'Appointment Letter'
                ? 'border-blue-600/70 bg-blue-50/80 dark:border-blue-500/60 dark:bg-blue-600/15'
                : 'border-wood-subtle dark:border-slate-800 bg-wood-surface dark:bg-[#0b1222] hover:border-blue-500/50'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-wood-muted dark:text-slate-400">
                Posters &amp; Letters
              </span>
              <FileBadge2 className="h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
            </div>
            <p className="mt-1.5 font-display text-2xl font-semibold text-wood-ink dark:text-slate-50 tabular-nums">
              {kindCounts['Official Poster'] + kindCounts['Appointment Letter']}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-wood-muted dark:text-slate-400">
              {kindCounts['Official Poster']} posters · {kindCounts['Appointment Letter']} letters
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleViewChange(viewMode === 'events' ? 'grid' : 'events')}
            className={`group rounded-[14px] border p-4 text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
              viewMode === 'events'
                ? 'border-blue-600/70 bg-blue-50/80 dark:border-blue-500/60 dark:bg-blue-600/15'
                : 'border-wood-subtle dark:border-slate-800 bg-wood-surface dark:bg-[#0b1222] hover:border-blue-500/50'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-wood-muted dark:text-slate-400">
                Event Groupings
              </span>
              <FolderKanban className="h-4 w-4 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
            </div>
            <p className="mt-1.5 font-display text-2xl font-semibold text-wood-ink dark:text-slate-50 tabular-nums">
              {allEventGroupsCount}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-wood-muted dark:text-slate-400">
              {viewMode === 'events' ? 'Viewing grouped story' : 'Switch to grouped story'}
            </p>
          </button>
        </div>

        {/* Controls Toolbar */}
        <div className="space-y-4 rounded-[14px] border border-wood-subtle dark:border-slate-800/80 bg-wood-surface dark:bg-[#0b1222] p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Gallery Grid vs Event Groupings Switcher + Live Counter */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                role="group"
                aria-label="Archive display layout"
                className="flex items-center rounded-[10px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] p-1"
              >
                <button
                  type="button"
                  onClick={() => handleViewChange('grid')}
                  aria-pressed={viewMode === 'grid'}
                  className={`inline-flex min-h-[38px] sm:min-h-0 items-center gap-1.5 rounded-[7px] px-3 py-2 sm:py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#2563eb] text-white'
                      : 'text-wood-muted hover:text-wood-ink dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Gallery Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleViewChange('events')}
                  aria-pressed={viewMode === 'events'}
                  className={`inline-flex min-h-[38px] sm:min-h-0 items-center gap-1.5 rounded-[7px] px-3 py-2 sm:py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    viewMode === 'events'
                      ? 'bg-[#2563eb] text-white'
                      : 'text-wood-muted hover:text-wood-ink dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <FolderKanban className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Event Groupings</span>
                </button>
              </div>

              <span className={DESIGN_TOKENS.typography.monoMicro}>
                Showing {filteredItems.length} of {VISUAL_ARCHIVE.length} Assets
              </span>

              {isFiltered && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-blue-700 dark:text-cyan-300 hover:underline cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-wood-muted dark:text-slate-500"
                aria-hidden="true"
              />
              <label htmlFor="archive-search" className="sr-only">
                Search photographs, certificates, events, dates, or filenames
              </label>
              <input
                id="archive-search"
                type="search"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search event, certificate, date, or caption..."
                className="h-9 w-full rounded-[10px] border border-wood-default dark:border-slate-800 bg-wood-input dark:bg-[#060b16] pr-3 pl-9 text-xs text-wood-ink dark:text-slate-100 placeholder:text-wood-muted/70 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400"
              />
            </div>
          </div>

          {/* Media Type Quick-Filter Chips */}
          <div className="space-y-1.5 border-t border-wood-subtle/80 dark:border-slate-800/70 pt-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-wood-muted dark:text-slate-500">
              Media Type
            </p>
            <div
              role="group"
              aria-label="Filter archive by media type"
              className="flex flex-wrap gap-1.5"
            >
              {KIND_TABS.map((kind) => {
                const active = selectedKind === kind;
                return (
                  <button
                    key={kind}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleKindChange(kind)}
                    className={`min-h-[34px] shrink-0 rounded-[8px] border px-2.5 py-1 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap cursor-pointer ${
                      active
                        ? 'border-cyan-600 bg-cyan-50 text-cyan-800 dark:border-cyan-500/80 dark:bg-cyan-500/15 dark:text-cyan-200'
                        : 'border-wood-subtle bg-wood-inset text-wood-muted hover:border-wood-default hover:text-wood-ink dark:border-slate-800 dark:bg-[#060b16] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {kind === 'All' ? 'All Media' : kind} ({kindCounts[kind]})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="space-y-1.5 border-t border-wood-subtle/80 dark:border-slate-800/70 pt-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-wood-muted dark:text-slate-500">
              Domain Category
            </p>
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
                    onClick={() => handleCategoryChange(cat)}
                    className={`min-h-[38px] sm:min-h-[34px] shrink-0 rounded-[10px] border px-3 py-1.5 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap cursor-pointer ${
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
          </div>
        </div>

        {/* Manual Confirmation Transparency Banner */}
        {pendingConfirmationCount > 0 && (
          <div className="flex items-start gap-2.5 rounded-[12px] border border-wood-subtle dark:border-slate-800 bg-wood-surface dark:bg-[#0b1222] px-4 py-3 text-xs text-wood-muted dark:text-slate-400">
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400"
              aria-hidden="true"
            />
            <p className="leading-relaxed">
              <strong className="font-semibold text-wood-ink dark:text-slate-200">
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
            {/* Quick-Jump Index for Event Groups */}
            {eventGroups.length > 1 && (
              <div className="rounded-[12px] border border-wood-subtle dark:border-slate-800 bg-wood-surface dark:bg-[#0b1222] p-4 space-y-2.5">
                <p className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Jump to Event Collection ({eventGroups.length} Groups)</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {eventGroups.map((group) => {
                    const targetId = slugifyGroup(group.eventGroup);
                    return (
                      <button
                        key={group.eventGroup}
                        type="button"
                        onClick={() => {
                          document
                            .getElementById(targetId)
                            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="rounded-[7px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] px-2.5 py-1 text-left font-mono text-[11px] text-wood-walnut dark:text-slate-300 transition-colors hover:border-blue-500/60 hover:text-blue-700 dark:hover:text-cyan-300 cursor-pointer"
                      >
                        {group.eventGroup} ({group.items.length})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {eventGroups.map((group) => {
              const groupId = slugifyGroup(group.eventGroup);
              const uniqueDates = Array.from(new Set(group.items.map((i) => i.date)));
              const uniqueCategories = Array.from(
                new Set(group.items.map((i) => i.category)),
              );
              return (
                <div
                  key={group.eventGroup}
                  id={groupId}
                  className="scroll-mt-24 space-y-4"
                >
                  <div className="flex flex-wrap items-end justify-between gap-3 border-b border-wood-subtle dark:border-slate-800/80 pb-3">
                    <div className="space-y-1">
                      <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                        {uniqueCategories.join(' · ')}
                      </p>
                      <h2 className="font-display text-base font-semibold text-wood-ink dark:text-slate-100 sm:text-lg">
                        {group.eventGroup}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-wood-muted dark:text-slate-500 tabular-nums">
                      <span>{uniqueDates.slice(0, 2).join(' · ')}</span>
                      <span>·</span>
                      <span className="font-semibold text-blue-700 dark:text-cyan-300">
                        {group.items.length} {group.items.length === 1 ? 'Asset' : 'Assets'}
                      </span>
                    </div>
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
              );
            })}
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
      variant={item.kind === 'Certificate' ? 'accent' : 'interactive'}
      as="article"
      className="group flex min-w-0 flex-col justify-between overflow-hidden p-0"
    >
      <div>
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open lightbox for ${item.associatedRecord}`}
          className="relative block w-full border-b border-wood-subtle dark:border-slate-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
        >
          <ArchiveMediaFrame
            src={item.src}
            alt={item.alt}
            kind={item.kind}
            mediaType={item.mediaType}
            rotateDeg={item.rotateDeg}
            focalPosition={item.focalPosition}
            mode="thumbnail"
          />

          {item.mediaType !== 'video' && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-[6px] border border-wood-default/80 dark:border-slate-700/80 bg-wood-surface/92 dark:bg-[#050914]/88 px-2 py-0.5 font-mono text-[10px] font-medium text-wood-ink dark:text-slate-200 backdrop-blur-sm"
            >
              {item.kind === 'Certificate' && (
                <Award className="h-2.5 w-2.5 text-cyan-700 dark:text-cyan-400" />
              )}
              <span>{item.kind}</span>
            </span>
          )}

          <span
            aria-hidden="true"
            className="absolute right-2.5 bottom-2.5 inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-wood-default/80 dark:border-slate-700/80 bg-wood-surface/92 dark:bg-[#050914]/92 text-wood-ink dark:text-slate-200 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          >
            <Expand className="h-3.5 w-3.5" />
          </span>
        </button>

        <div className="p-5 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
            <span className="text-cyan-700 dark:text-cyan-400 truncate max-w-[60%]">
              {item.eventGroup}
            </span>
            <span className="inline-flex items-center gap-1 text-wood-muted dark:text-slate-500 tabular-nums shrink-0">
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

          <p className={`${DESIGN_TOKENS.typography.bodyMuted} line-clamp-3`}>
            {item.caption}
          </p>

          {item.needsConfirmation && (
            <p className="flex items-start gap-1.5 rounded-[8px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] p-2.5 text-[11px] leading-relaxed text-wood-muted dark:text-slate-400">
              <AlertCircle
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-700 dark:text-blue-400"
                aria-hidden="true"
              />
              <span>Confirmation note: {item.needsConfirmation}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-wood-subtle dark:border-slate-800/70 px-5 py-2.5 sm:py-3">
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1.5 py-1.5 sm:py-0 text-xs font-medium text-wood-walnut dark:text-slate-200 transition-colors hover:text-cyan-700 dark:hover:text-cyan-300 cursor-pointer"
        >
          <Expand className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{item.mediaType === 'video' ? 'Play Video & Details' : 'Zoom & Details'}</span>
        </button>

        <div className="flex items-center gap-3">
          {item.certificateId && (
            <Link
              to="/skills#certificates-gallery"
              className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1 py-1.5 sm:py-0 font-mono text-[11px] font-medium text-cyan-700 dark:text-cyan-300 transition-colors hover:text-cyan-800 dark:hover:text-cyan-200"
            >
              <Award className="h-3 w-3" aria-hidden="true" />
              <span>Credential</span>
            </Link>
          )}

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
      </div>
    </SurfaceCard>
  );
}
