import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Box, Cpu } from 'lucide-react';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import {
  STUDIO_MODEL_ORDER,
  STUDIO_MODELS,
  type StudioModelId,
} from '../../three/studioConfig';
import { SectionHeading } from '../ui/SectionHeading';

const LazyIndustrialStudioViewport = lazy(() =>
  import('../three/IndustrialStudioViewport').then((m) => ({
    default: m.IndustrialStudioViewport,
  })),
);

interface StudioPreviewSectionProps {
  integrated?: boolean;
}

export function StudioPreviewSection({
  integrated = false,
}: StudioPreviewSectionProps) {
  const [selectedModel, setSelectedModel] =
    useState<StudioModelId>('forgemind-turbofan');
  const [viewportMounted, setViewportMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportMounted) return;
    const node = triggerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setViewportMounted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setViewportMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '280px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [viewportMounted]);

  const activeSpec = STUDIO_MODELS[selectedModel];

  const innerContent = (
    <>
      {integrated ? (
        <div className="flex flex-col gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1 max-w-2xl">
            <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
              Interactive 3D Engineering Studio
            </p>
            <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
              Spatial Engineering Assemblies &amp; Kinematics
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Inspect five procedural 3D assemblies linked to my engineering systems and research manuscripts—or load your own .GLB, .GLTF, or .STL CAD files.
            </p>
          </div>
          <Link
            to={`/studio?model=${selectedModel}`}
            className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1.5 self-start py-1.5 sm:py-0 font-mono text-xs font-medium text-blue-700 dark:text-cyan-300 transition-colors hover:text-cyan-700 dark:hover:text-cyan-200 shrink-0 sm:self-auto"
          >
            <span>Open Fullscreen Studio</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <SectionHeading
          index="04"
          eyebrow="Interactive 3D Systems Studio"
          title="Spatial Engineering Assemblies & Kinematics"
          description="Inspect five interactive procedural 3D assemblies tailored to my engineering systems and research manuscripts—or load your own .GLB, .GLTF, or .STL CAD files directly on the rotary inspection plinth."
          actionLabel="Open Fullscreen Studio"
          actionTo={`/studio?model=${selectedModel}`}
        />
      )}

        <div ref={triggerRef}>
          {viewportMounted ? (
            <Suspense
              fallback={
                <div className="flex h-[470px] sm:h-[540px] w-full flex-col items-center justify-center gap-3 rounded-[16px] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#050914] p-6 text-center">
                  <Cpu className="h-7 w-7 animate-pulse motion-reduce:animate-none text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
                  <p className="font-mono text-xs text-slate-600 dark:text-slate-300">
                    Initializing 3D Engineering Viewport · {activeSpec.title}
                  </p>
                </div>
              }
            >
              <LazyIndustrialStudioViewport
                mode="embedded"
                initialModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            </Suspense>
          ) : (
            <div className="flex h-[470px] sm:h-[540px] w-full flex-col items-center justify-center gap-4 rounded-[16px] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#050914] bg-blueprint-grid p-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] border border-cyan-600/35 bg-white dark:bg-[#0c1426] text-cyan-700 dark:text-cyan-400">
                <Box className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                  WebGL Engineering Workbench
                </p>
                <p className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {activeSpec.title}
                </p>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Scroll here or launch below to load the interactive Three.js PBR rotary studio.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewportMounted(true)}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-[10px] bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
              >
                <Cpu className="h-4 w-4" aria-hidden="true" />
                <span>Launch Interactive 3D Viewport</span>
              </button>
            </div>
          )}
        </div>

        {/* 5-Model Quick Selector Strip */}
        <div
          aria-label="Available 3D portfolio assemblies"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {STUDIO_MODEL_ORDER.map((id) => {
            const spec = STUDIO_MODELS[id];
            const active = selectedModel === id;
            return (
              <div
                key={id}
                className={`flex flex-col justify-between rounded-[12px] border p-3.5 transition-colors ${
                  active
                    ? 'border-blue-600/80 dark:border-cyan-400/70 bg-blue-50/70 dark:bg-cyan-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b1222] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedModel(id);
                    setViewportMounted(true);
                  }}
                  aria-pressed={active}
                  className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-[6px] cursor-pointer"
                >
                  <p className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400">
                    {spec.shortTitle}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                    {spec.title.split('·')[1]?.trim() ?? spec.title}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-slate-600 dark:text-slate-400 truncate">
                    {spec.projectRef}
                  </p>
                </button>

                <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800/80 pt-2 font-mono text-[10px]">
                  <span className="text-slate-600 dark:text-slate-400">
                    {spec.subsystems.length} stages
                  </span>
                  <Link
                    to={`/studio?model=${id}`}
                    className="inline-flex min-h-[36px] sm:min-h-0 items-center gap-0.5 py-1 sm:py-0 text-blue-700 dark:text-cyan-300 hover:underline"
                  >
                    <span>Fullscreen</span>
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <p className="inline-flex items-center gap-2 font-mono text-[11px]">
            <Box className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
            <span>
              Supports custom .GLB, .GLTF &amp; .STL upload · Click any 3D stage or stage button to inspect engineering notes
            </span>
          </p>
          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
            Shortcuts in fullscreen: H (Hide HUD) · Space (Pause kinematics)
          </span>
        </div>
    </>
  );

  if (integrated) {
    return (
      <div
        id="studio-3d"
        className="space-y-6 border-t border-slate-200 dark:border-slate-800/80 pt-10"
      >
        {innerContent}
      </div>
    );
  }

  return (
    <section
      id="studio-3d"
      className={`border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#080e1c] ${DESIGN_TOKENS.spacing.sectionY}`}
    >
      <div className={`${DESIGN_TOKENS.spacing.container} space-y-8`}>
        {innerContent}
      </div>
    </section>
  );
}
