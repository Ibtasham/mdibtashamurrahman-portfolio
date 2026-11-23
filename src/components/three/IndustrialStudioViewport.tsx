import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Camera,
  ChevronDown,
  ChevronUp,
  Loader2,
  Moon,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Sun,
  Tag,
  Upload,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import type {
  ProjectedAnnotation,
  ThreeStudioEngine,
} from '../../three/ThreeStudioEngine';
import {
  findSubsystemMeta,
  getAdjacentStudioModel,
  LIGHTING_PRESETS,
  MATERIAL_FINISH_ORDER,
  MATERIAL_FINISHES,
  resolveWalkthroughStep,
  STUDIO_MODEL_ORDER,
  STUDIO_MODELS,
  type CameraPresetId,
  type LightingPresetId,
  type MaterialFinishId,
  type StudioModelId,
  type SubsystemMeta,
} from '../../three/studioConfig';
import {
  StudioEducationalPanel,
  type EducationalTab,
} from './StudioEducationalPanel';
import { StudioFallbackView } from './StudioFallbackView';

interface IndustrialStudioViewportProps {
  mode: 'fullscreen' | 'embedded';
  initialModel?: StudioModelId;
  onModelChange?: (modelId: StudioModelId) => void;
  heightClassName?: string;
}

const CAMERA_VIEWS: Array<{ id: CameraPresetId; label: string }> = [
  { id: 'isometric', label: 'Iso' },
  { id: 'front', label: 'Front' },
  { id: 'top', label: 'Top' },
  { id: 'closeup', label: 'Core' },
];

export function IndustrialStudioViewport({
  mode,
  initialModel = 'forgemind-turbofan',
  onModelChange,
  heightClassName,
}: IndustrialStudioViewportProps) {
  const { theme, toggleTheme } = useTheme();
  const { prefersReducedMotion } = useMotionPreference();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const engineRef = useRef<ThreeStudioEngine | null>(null);

  const [activeModel, setActiveModel] = useState<StudioModelId>(initialModel);
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [customLoadError, setCustomLoadError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [activeFinish, setActiveFinish] = useState<MaterialFinishId>('titanium');
  const [activeLighting, setActiveLighting] = useState<LightingPresetId>(() =>
    theme === 'light' ? 'daylight' : 'dark-lab',
  );
  const [explodeAmount, setExplodeAmount] = useState(0);
  const [paused, setPaused] = useState<boolean>(prefersReducedMotion);
  const [turntableSpin, setTurntableSpin] = useState(false);
  const [selectedSubsystemId, setSelectedSubsystemId] = useState<string | null>(
    null,
  );
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(
    () => mode === 'fullscreen',
  );
  const [educationalTab, setEducationalTab] = useState<EducationalTab>('inspect');
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(
    () => mode === 'fullscreen',
  );
  const [annotations, setAnnotations] = useState<ProjectedAnnotation[]>([]);
  const [engineReady, setEngineReady] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return true;
    }
    return Boolean(mode === 'embedded' && heightClassName);
  });
  const [webglError, setWebglError] = useState('');

  const callbacksRef = useRef({
    onSelectSubsystem: (id: string | null) => {
      setSelectedSubsystemId(id);
      if (id) {
        setEducationalTab('inspect');
        setInspectorOpen(true);
      }
    },
    onWebglError: (msg: string) => setWebglError(msg),
    onAnnotationsUpdate: (items: ProjectedAnnotation[]) => setAnnotations(items),
  });

  useEffect(() => {
    setActiveModel(initialModel);
    setCustomFileName(null);
    setCustomLoadError('');
    setSelectedSubsystemId(null);
    setTourStepIndex(0);
  }, [initialModel]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setPaused(true);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    setActiveLighting((prev) => {
      if (prev === 'thermal') return prev;
      return theme === 'light' ? 'daylight' : 'dark-lab';
    });
  }, [theme]);

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    let cancelled = false;
    let instance: ThreeStudioEngine | null = null;

    const initEngine = async () => {
      try {
        const { ThreeStudioEngine: EngineClass } = await import(
          '../../three/ThreeStudioEngine'
        );
        if (cancelled) return;
        instance = new EngineClass({
          container: mount,
          initialModel,
          initialFinish: 'titanium',
          initialLighting: theme === 'light' ? 'daylight' : 'dark-lab',
          initialTheme: theme,
          initialExplode: 0,
          initialPaused: prefersReducedMotion,
          callbacks: {
            onSelectSubsystem: (id) =>
              callbacksRef.current.onSelectSubsystem(id),
            onWebglError: (msg) => callbacksRef.current.onWebglError(msg),
            onAnnotationsUpdate: (items) =>
              callbacksRef.current.onAnnotationsUpdate(items),
          },
        });
        if (cancelled) {
          instance.dispose();
          return;
        }
        engineRef.current = instance;
        instance.setAnnotationsEnabled(showAnnotations);
        setEngineReady(true);
      } catch (err) {
        if (!cancelled) {
          setWebglError(
            err instanceof Error
              ? err.message
              : 'WebGL 3D rendering is unavailable in this browser.',
          );
        }
      }
    };

    void initEngine();

    return () => {
      cancelled = true;
      instance?.dispose();
      engineRef.current = null;
      setEngineReady(false);
    };
    // Intentionally mounted once per viewport lifecycle to preserve single WebGL renderer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (engineReady && !customFileName) {
      engineRef.current?.setModel(activeModel);
    }
  }, [activeModel, customFileName, engineReady]);

  useEffect(() => {
    engineRef.current?.setFinish(activeFinish);
  }, [activeFinish, engineReady]);

  useEffect(() => {
    engineRef.current?.setLightingAndTheme(activeLighting, theme);
  }, [activeLighting, theme, engineReady]);

  useEffect(() => {
    engineRef.current?.setExplode(explodeAmount);
  }, [explodeAmount, engineReady]);

  useEffect(() => {
    engineRef.current?.setPaused(paused);
  }, [paused, engineReady]);

  useEffect(() => {
    engineRef.current?.setTurntableSpin(turntableSpin);
  }, [turntableSpin, engineReady]);

  useEffect(() => {
    engineRef.current?.setAnnotationsEnabled(showAnnotations && !customFileName);
  }, [showAnnotations, customFileName, engineReady]);

  useEffect(() => {
    const target = wrapperRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          engineRef.current?.setInViewport(entry.isIntersecting);
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [engineReady]);

  useEffect(() => {
    if (mode !== 'fullscreen') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'h' || e.key === 'H') {
        setDockCollapsed((prev) => !prev);
      } else if (e.key === ' ') {
        e.preventDefault();
        setPaused((prev) => !prev);
      } else if (e.key === 'l' || e.key === 'L') {
        setShowAnnotations((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode]);

  const handleLoadCadFile = async (file: File | undefined | null) => {
    if (!file || !engineRef.current) return;
    setCustomLoadError('');
    setCustomLoading(true);
    try {
      const loadedName = await engineRef.current.loadCustomModelFile(file);
      setCustomFileName(loadedName);
      setSelectedSubsystemId(null);
      setAnnotations([]);
    } catch (err) {
      setCustomLoadError(
        err instanceof Error
          ? err.message
          : 'Unable to parse 3D file. Export as binary .GLB, .GLTF, or .STL.',
      );
    } finally {
      setCustomLoading(false);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    void handleLoadCadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleLoadCadFile(file);
    }
  };

  const handleSelectSubsystem = (id: string | null, focusCamera = true) => {
    const next = id === null ? null : selectedSubsystemId === id ? null : id;
    setSelectedSubsystemId(next);
    engineRef.current?.setSelectedSubsystem(next);
    if (next) {
      const meta = findSubsystemMeta(activeModel, next);
      if (meta && focusCamera) {
        engineRef.current?.focusCameraPose(meta.cameraFocus);
      }
      setInspectorOpen(true);
    }
  };

  const handleFocusSubsystem = (subsystem: SubsystemMeta) => {
    engineRef.current?.focusCameraPose(subsystem.cameraFocus);
  };

  const handleTourStepChange = (requestedIndex: number) => {
    const resolved = resolveWalkthroughStep(activeModel, requestedIndex);
    setTourStepIndex(resolved.stepIndex);
    setEducationalTab('tour');
    setInspectorOpen(true);
    setSelectedSubsystemId(resolved.subsystem.id);
    engineRef.current?.setSelectedSubsystem(resolved.subsystem.id);
    engineRef.current?.focusCameraPose(resolved.subsystem.cameraFocus);
    if (typeof resolved.step.recommendedExplode === 'number') {
      setExplodeAmount(resolved.step.recommendedExplode);
    }
  };

  const handleEducationalTabChange = (nextTab: EducationalTab) => {
    setEducationalTab(nextTab);
    if (nextTab === 'tour') {
      handleTourStepChange(tourStepIndex);
    }
  };

  const selectBuiltInModel = (id: StudioModelId) => {
    setCustomFileName(null);
    setCustomLoadError('');
    setActiveModel(id);
    setSelectedSubsystemId(null);
    setTourStepIndex(0);
    setExplodeAmount(0);
    engineRef.current?.setModel(id);
    onModelChange?.(id);
  };

  const handleSwitchModel = (direction: 'prev' | 'next') => {
    const targetId = customFileName
      ? activeModel
      : getAdjacentStudioModel(activeModel, direction);
    selectBuiltInModel(targetId);
  };

  const handleSnapshot = () => {
    const dataUrl = engineRef.current?.capturePngDataUrl();
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    const slug = (customFileName ?? activeModel).replace(/[^a-z0-9-_]+/gi, '-');
    link.download = `${slug}-studio.png`;
    link.click();
  };

  const modelSpec = STUDIO_MODELS[activeModel];
  const activeSubsystem = customFileName
    ? null
    : findSubsystemMeta(activeModel, selectedSubsystemId);
  const explodePercent = Math.round(explodeAmount * 100);

  const isLightSurface =
    activeLighting === 'daylight' ||
    (theme === 'light' && activeLighting !== 'dark-lab');

  const overlaySurface = isLightSurface
    ? 'bg-white/95 text-slate-900 border-slate-300 shadow-[0_14px_32px_-12px_rgba(15,23,42,0.2)]'
    : 'bg-[#091122]/96 text-slate-100 border-slate-700/80 shadow-[0_18px_40px_-12px_rgba(2,6,23,0.9)]';

  const subtleChip = isLightSurface
    ? 'border-slate-300 bg-slate-100 text-slate-700 hover:border-blue-500 hover:text-slate-950'
    : 'border-slate-700/90 bg-[#0e172c] text-slate-300 hover:border-cyan-400/70 hover:text-white';

  const activeChip = isLightSurface
    ? 'border-blue-600 bg-blue-600 text-white'
    : 'border-cyan-400 bg-cyan-500/20 text-cyan-200';

  const wrapperClassName =
    mode === 'fullscreen'
      ? 'relative flex h-[100dvh] w-screen flex-col lg:flex-row overflow-hidden select-none bg-slate-100 dark:bg-[#050914]'
      : `relative flex flex-col md:flex-row ${
          heightClassName ?? 'min-h-[520px] md:h-[560px]'
        } w-full overflow-hidden rounded-[16px] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#050914]`;

  if (webglError) {
    return (
      <div
        ref={wrapperRef}
        data-studio-viewport="true"
        data-studio-fallback="true"
        data-model={activeModel}
        className={
          mode === 'fullscreen'
            ? 'h-[100dvh] w-screen overflow-hidden bg-[#070d1b]'
            : `w-full overflow-hidden rounded-[16px] border border-slate-800 bg-[#070d1b] ${
                heightClassName ?? 'min-h-[520px]'
              }`
        }
      >
        <StudioFallbackView
          reason={webglError}
          modelSpec={modelSpec}
          selectedSubsystem={activeSubsystem}
          onSelectSubsystem={(id) => setSelectedSubsystemId(id)}
          onSelectModel={selectBuiltInModel}
          onSwitchModel={handleSwitchModel}
          tourStepIndex={tourStepIndex}
          onTourStepChange={(idx) => {
            const resolved = resolveWalkthroughStep(activeModel, idx);
            setTourStepIndex(resolved.stepIndex);
            setSelectedSubsystemId(resolved.subsystem.id);
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      data-studio-viewport="true"
      data-model={customFileName ? `custom:${customFileName}` : activeModel}
      data-explode={explodePercent}
      data-paused={paused ? 'true' : 'false'}
      onDragOver={(e) => {
        e.preventDefault();
        if (!dragActive) setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={wrapperClassName}
    >
      {/* Interactive 3D Viewport Stage */}
      <div className="relative min-h-[300px] flex-1 min-w-0">
        {/* Dedicated Empty WebGL Mount Container */}
        <div
          ref={canvasMountRef}
          className="absolute inset-0 h-full w-full"
          aria-label={`${
            customFileName ?? modelSpec.title
          } interactive 3D viewport`}
        />

        {/* Hidden File Input for User CAD Models (.glb / .gltf / .stl) */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf,.stl"
          onChange={handleFileInputChange}
          className="sr-only"
          aria-label="Upload custom 3D GLB, GLTF, or STL model"
        />

        {/* Lazy-loaded Engine Spinner before First Frame */}
        {!engineReady && (
          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 bg-[#050914] text-slate-200">
            <Loader2 className="h-6 w-6 animate-spin motion-reduce:animate-none text-cyan-400" aria-hidden="true" />
            <p className="font-mono text-xs text-slate-300">
              Loading 3D Engineering Laboratory · {modelSpec.shortTitle}
            </p>
          </div>
        )}

        {/* Drag-and-drop highlight border */}
        {dragActive && (
          <div className="pointer-events-none absolute inset-3 z-20 flex items-center justify-center rounded-[14px] border-2 border-dashed border-cyan-400 bg-[#050914]/90 text-center">
            <p className="font-mono text-sm font-semibold text-cyan-200">
              Drop .GLB, .GLTF, or .STL file to inspect on the studio plinth
            </p>
          </div>
        )}

        {/* CAD Loading Overlay (No backdrop-blur over WebGL) */}
        {customLoading && (
          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-[#050914]/88">
            <Loader2 className="h-6 w-6 animate-spin motion-reduce:animate-none text-cyan-400" aria-hidden="true" />
            <p className="font-mono text-xs text-slate-200">
              Normalizing geometry onto rotary plinth...
            </p>
          </div>
        )}

        {/* Projected 3D Technical Annotations Overlay */}
        {showAnnotations && !customFileName && annotations.length > 0 && (
          <div
            aria-label="3D subsystem technical callouts"
            className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
          >
            {annotations.map((ann) => {
              if (!ann.visible) return null;
              const idx = modelSpec.subsystems.findIndex((s) => s.id === ann.id);
              const meta = modelSpec.subsystems[idx];
              if (!meta) return null;
              const isSelected = selectedSubsystemId === ann.id;
              return (
                <button
                  key={ann.id}
                  type="button"
                  onClick={() => handleSelectSubsystem(ann.id, true)}
                  aria-pressed={isSelected}
                  style={{
                    transform: `translate3d(${ann.x}px, ${ann.y}px, 0) translate(-50%, -50%)`,
                  }}
                  className={`pointer-events-auto absolute top-0 left-0 inline-flex items-center gap-1.5 rounded-[7px] border px-2 py-1 font-mono text-[10px] font-medium transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isSelected
                      ? isLightSurface
                        ? 'border-blue-700 bg-blue-600 text-white shadow-md'
                        : 'border-cyan-300 bg-[#0284c7] text-white font-semibold shadow-md'
                      : isLightSurface
                        ? 'border-slate-300 bg-white/95 text-slate-900 hover:border-blue-600'
                        : 'border-slate-700 bg-[#081022]/96 text-slate-100 hover:border-cyan-400'
                  }`}
                >
                  <span
                    className={`inline-flex h-4 w-4 items-center justify-center rounded-[4px] text-[9px] font-semibold ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : isLightSurface
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span>{meta.shortLabel}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Minimal Top Header Bar (Zero Center Occlusion) */}
        <div className="pointer-events-none absolute top-2.5 left-2.5 right-2.5 z-10 flex flex-col gap-2 sm:top-4 sm:left-4 sm:right-4 sm:flex-row sm:items-start sm:justify-between">
          <div
            className={`pointer-events-auto min-w-0 max-w-full sm:max-w-[330px] xl:max-w-md rounded-[12px] border px-3 py-2 sm:px-3.5 sm:py-2.5 ${overlaySurface}`}
          >
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {mode === 'fullscreen' && (
                <Link
                  to="/"
                  className="inline-flex min-h-[28px] sm:min-h-0 items-center gap-1 rounded-[6px] border border-current/20 px-2 py-0.5 font-mono text-[11px] font-medium transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                  <span>Portfolio</span>
                </Link>
              )}
              <span
                className={`truncate font-mono text-[10px] sm:text-[11px] font-medium ${
                  isLightSurface ? 'text-blue-700' : 'text-cyan-400'
                }`}
              >
                {customFileName ? 'Custom CAD Mesh' : modelSpec.projectRef}
              </span>
            </div>
            {mode === 'fullscreen' ? (
              <h1
                className={`mt-0.5 line-clamp-1 font-display text-xs font-semibold tracking-tight sm:mt-1 sm:text-sm xl:text-base ${
                  isLightSurface ? '!text-slate-950' : '!text-slate-50'
                }`}
              >
                {customFileName ?? modelSpec.title}
              </h1>
            ) : (
              <h2
                className={`mt-0.5 line-clamp-1 font-display text-xs font-semibold tracking-tight sm:mt-1 sm:text-sm xl:text-base ${
                  isLightSurface ? '!text-slate-950' : '!text-slate-50'
                }`}
              >
                {customFileName ?? modelSpec.title}
              </h2>
            )}
            {customLoadError ? (
              <p className="mt-1 text-[11px] font-medium text-amber-500">
                {customLoadError}
              </p>
            ) : (
              <p className="mt-0.5 text-[10px] sm:text-[11px] opacity-75 line-clamp-1">
                {activeSubsystem
                  ? `${activeSubsystem.name} · ${activeSubsystem.stageTag}`
                  : prefersReducedMotion && paused
                    ? 'Reduced motion active · Press Play or drag to inspect'
                    : 'Conceptual procedural model · Click a part or pin'}
              </p>
            )}
          </div>

          <div className="pointer-events-auto flex shrink-0 flex-wrap sm:flex-nowrap items-center gap-1.5">
            {/* Prev / Next Model Quick Switcher */}
            <div
              className={`hidden md:inline-flex items-center rounded-[10px] border p-0.5 ${overlaySurface}`}
            >
              <button
                type="button"
                onClick={() => handleSwitchModel('prev')}
                aria-label="Previous 3D model"
                title="Previous model"
                className="inline-flex h-[32px] w-[30px] items-center justify-center rounded-[7px] hover:opacity-75 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <span className="px-1 font-mono text-[10px] opacity-80">
                {STUDIO_MODEL_ORDER.indexOf(activeModel) + 1}/{STUDIO_MODEL_ORDER.length}
              </span>
              <button
                type="button"
                onClick={() => handleSwitchModel('next')}
                aria-label="Next 3D model"
                title="Next model"
                className="inline-flex h-[32px] w-[30px] items-center justify-center rounded-[7px] hover:opacity-75 cursor-pointer"
              >
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            {!customFileName && (
              <button
                type="button"
                onClick={() => setShowAnnotations((prev) => !prev)}
                aria-pressed={showAnnotations}
                title="Toggle 3D callout labels (L)"
                aria-label="Toggle 3D technical labels"
                className={`inline-flex h-[38px] sm:h-[36px] items-center gap-1.5 rounded-[10px] border px-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                  showAnnotations ? activeChip : overlaySurface
                }`}
              >
                <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden xl:inline">Labels</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setInspectorOpen((prev) => !prev)}
              aria-pressed={inspectorOpen}
              aria-label={
                inspectorOpen
                  ? 'Hide educational engineering guide'
                  : 'Open educational engineering guide'
              }
              className={`inline-flex h-[38px] sm:h-[36px] items-center gap-1.5 rounded-[10px] border px-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                inspectorOpen ? activeChip : overlaySurface
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">
                {inspectorOpen ? 'Hide Guide' : 'Edu Guide'}
              </span>
              <span className="sm:hidden">Guide</span>
            </button>

            <button
              type="button"
              onClick={handleSnapshot}
              title="Download PNG snapshot of current 3D view"
              aria-label="Download PNG snapshot"
              className={`inline-flex h-[38px] w-[38px] sm:h-[36px] sm:w-[36px] xl:w-auto xl:px-2.5 items-center justify-center gap-1.5 rounded-[10px] border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${overlaySurface}`}
            >
              <Camera className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden xl:inline">Snapshot</span>
            </button>

            {mode === 'fullscreen' && (
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                title={`Theme: ${theme === 'dark' ? 'Dark' : 'Light'}`}
                className={`inline-flex h-[38px] w-[38px] sm:h-[36px] sm:w-[36px] items-center justify-center rounded-[10px] border transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${overlaySurface}`}
              >
                {theme === 'dark' ? (
                  <Sun className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Moon className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            )}

            {mode === 'embedded' ? (
              <Link
                to={`/studio?model=${activeModel}`}
                className={`inline-flex h-[38px] sm:h-[36px] items-center gap-1 rounded-[10px] border px-2.5 sm:px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${overlaySurface}`}
              >
                <span>Fullscreen</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ) : (
              <Link
                to={modelSpec.projectRoute}
                className={`hidden md:inline-flex h-[36px] items-center gap-1.5 rounded-[10px] border px-2.5 xl:px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${overlaySurface}`}
              >
                <span>Case Study</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        {/* Collapsible Bottom Control Dock */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2.5 z-10 flex flex-col items-center px-2.5 sm:bottom-3.5 sm:px-3">
          <button
            type="button"
            onClick={() => setDockCollapsed((prev) => !prev)}
            aria-expanded={!dockCollapsed}
            aria-controls="studio-bottom-dock"
            className={`pointer-events-auto mb-1.5 inline-flex min-h-[38px] sm:min-h-[32px] items-center gap-1.5 rounded-t-[10px] rounded-b-[6px] border px-3 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${overlaySurface}`}
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Show Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Hide Controls</span>
              </>
            )}
          </button>

          {!dockCollapsed && (
            <div
              id="studio-bottom-dock"
              className={`pointer-events-auto max-h-[42vh] sm:max-h-[38vh] overflow-y-auto w-full max-w-[940px] rounded-[14px] border p-2.5 sm:p-3 transition-transform duration-200 ${overlaySurface}`}
            >
              <div className="flex flex-col gap-2">
                {/* Row 1: Model Switchers + Upload + Explode + Kinematics */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div
                    role="group"
                    aria-label="3D engineering models"
                    className="flex flex-wrap items-center gap-1"
                  >
                    {STUDIO_MODEL_ORDER.map((id) => {
                      const spec = STUDIO_MODELS[id];
                      const active = !customFileName && activeModel === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => selectBuiltInModel(id)}
                          className={`min-h-[36px] sm:min-h-[32px] rounded-[7px] border px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                            active ? activeChip : subtleChip
                          }`}
                        >
                          {spec.shortTitle}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Load your own .GLB, .GLTF, or .STL 3D file onto the plinth"
                      className={`inline-flex min-h-[36px] sm:min-h-[32px] items-center gap-1 rounded-[7px] border px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                        customFileName ? activeChip : subtleChip
                      }`}
                    >
                      <Upload className="h-3 w-3" aria-hidden="true" />
                      <span>Load .GLB/.STL</span>
                    </button>
                  </div>

                  <div className="flex shrink-0 min-w-[155px] max-w-[215px] items-center gap-2">
                    <label
                      htmlFor={`explode-slider-${mode}`}
                      className="font-mono text-[11px] whitespace-nowrap shrink-0"
                    >
                      Explode {explodePercent}%
                    </label>
                    <input
                      id={`explode-slider-${mode}`}
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={explodePercent}
                      onChange={(e) => setExplodeAmount(Number(e.target.value) / 100)}
                      aria-label="Exploded view separation percentage"
                      className="h-2 w-full cursor-pointer accent-blue-600 dark:accent-cyan-400"
                    />
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setTurntableSpin((s) => !s)}
                      aria-pressed={turntableSpin}
                      aria-label={
                        turntableSpin ? 'Stop turntable spin' : 'Spin turntable stage'
                      }
                      title="Spin rotary stage"
                      className={`inline-flex h-9 sm:h-8 items-center gap-1 rounded-[7px] border px-2.5 sm:px-2 text-[11px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                        turntableSpin ? activeChip : subtleChip
                      }`}
                    >
                      <RotateCw className="h-3 w-3" aria-hidden="true" />
                      <span className="hidden sm:inline">Turn</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaused((p) => !p)}
                      aria-pressed={paused}
                      aria-label={paused ? 'Resume kinematics' : 'Pause kinematics'}
                      className={`inline-flex h-9 sm:h-8 items-center gap-1 rounded-[7px] border px-2.5 text-[11px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${subtleChip}`}
                    >
                      {paused ? (
                        <>
                          <Play className="h-3 w-3" aria-hidden="true" />
                          <span>Play</span>
                        </>
                      ) : (
                        <>
                          <Pause className="h-3 w-3" aria-hidden="true" />
                          <span>Pause</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setExplodeAmount(0);
                        setTurntableSpin(false);
                        handleSelectSubsystem(null);
                        engineRef.current?.setCameraPreset('isometric');
                      }}
                      aria-label="Reset camera and exploded view"
                      title="Reset view"
                      className={`inline-flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-[7px] border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${subtleChip}`}
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Row 2: Camera Presets + Zoom +/- + PBR Material Finish + Lighting Rig */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-current/12 pt-2">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="font-mono text-[10px] opacity-65 mr-0.5">
                      Cam:
                    </span>
                    {CAMERA_VIEWS.map((view) => (
                      <button
                        key={view.id}
                        type="button"
                        onClick={() => engineRef.current?.setCameraPreset(view.id)}
                        className={`min-h-[36px] sm:min-h-[32px] rounded-[6px] border px-2.5 sm:px-2 py-0.5 font-mono text-[10px] sm:text-[11px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${subtleChip}`}
                      >
                        {view.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => engineRef.current?.zoomByFactor(0.82)}
                      aria-label="Zoom in"
                      title="Zoom in"
                      className={`inline-flex h-[36px] w-[36px] sm:h-[32px] sm:w-[32px] items-center justify-center rounded-[6px] border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${subtleChip}`}
                    >
                      <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => engineRef.current?.zoomByFactor(1.22)}
                      aria-label="Zoom out"
                      title="Zoom out"
                      className={`inline-flex h-[36px] w-[36px] sm:h-[32px] sm:w-[32px] items-center justify-center rounded-[6px] border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${subtleChip}`}
                    >
                      <ZoomOut className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1">
                    <span className="font-mono text-[10px] opacity-65 mr-0.5">
                      Finish:
                    </span>
                    {MATERIAL_FINISH_ORDER.map((finishId) => {
                      const spec = MATERIAL_FINISHES[finishId];
                      const active = activeFinish === finishId;
                      return (
                        <button
                          key={finishId}
                          type="button"
                          aria-pressed={active}
                          aria-label={`Apply ${spec.label} finish`}
                          title={spec.label}
                          onClick={() => setActiveFinish(finishId)}
                          className={`inline-flex h-[36px] sm:h-[32px] items-center gap-1.5 rounded-[6px] border px-2.5 sm:px-2 text-[11px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                            active ? activeChip : subtleChip
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="h-2.5 w-2.5 rounded-full border border-white/40"
                            style={{ backgroundColor: spec.swatchHex }}
                          />
                          <span className="hidden md:inline">{spec.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-1">
                    <span className="font-mono text-[10px] opacity-65 mr-0.5">
                      Rig:
                    </span>
                    {LIGHTING_PRESETS.map((preset) => {
                      const active = activeLighting === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setActiveLighting(preset.id)}
                          className={`min-h-[36px] sm:min-h-[32px] rounded-[6px] border px-2.5 sm:px-2 py-0.5 font-mono text-[10px] sm:text-[11px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                            active ? activeChip : subtleChip
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Non-Occluding Side / Sheet Educational Engineering Workbench */}
      {inspectorOpen && (
        <div
          className={
            mode === 'fullscreen'
              ? 'h-[39vh] w-full shrink-0 lg:h-full lg:w-[390px] xl:w-[410px]'
              : 'h-[250px] w-full shrink-0 md:h-full md:w-[340px] lg:w-[360px]'
          }
        >
          <StudioEducationalPanel
            modelSpec={modelSpec}
            customFileName={customFileName}
            activeTab={educationalTab}
            onTabChange={handleEducationalTabChange}
            selectedSubsystem={activeSubsystem}
            onSelectSubsystem={(id) => handleSelectSubsystem(id, true)}
            onFocusSubsystem={handleFocusSubsystem}
            tourStepIndex={tourStepIndex}
            onTourStepChange={handleTourStepChange}
            onSwitchModel={handleSwitchModel}
            isLightSurface={isLightSurface}
            onClose={() => setInspectorOpen(false)}
            layout={mode === 'fullscreen' ? 'sidebar' : 'sheet'}
          />
        </div>
      )}
    </div>
  );
}
