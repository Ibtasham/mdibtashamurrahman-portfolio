import { useId } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  Crosshair,
  Factory,
  Info,
  Layers,
  X,
} from 'lucide-react';
import {
  STUDIO_MODEL_ORDER,
  type StudioModelSpec,
  type SubsystemMeta,
} from '../../three/studioConfig';

export type EducationalTab = 'inspect' | 'tour' | 'ipe';

interface StudioEducationalPanelProps {
  modelSpec: StudioModelSpec;
  customFileName: string | null;
  activeTab: EducationalTab;
  onTabChange: (tab: EducationalTab) => void;
  selectedSubsystem: SubsystemMeta | null;
  onSelectSubsystem: (subsystemId: string | null) => void;
  onFocusSubsystem?: (subsystem: SubsystemMeta) => void;
  tourStepIndex: number;
  onTourStepChange: (nextIndex: number) => void;
  onSwitchModel: (direction: 'prev' | 'next') => void;
  isLightSurface: boolean;
  onClose?: () => void;
  layout?: 'sidebar' | 'sheet';
}

export function StudioEducationalPanel({
  modelSpec,
  customFileName,
  activeTab,
  onTabChange,
  selectedSubsystem,
  onSelectSubsystem,
  onFocusSubsystem,
  tourStepIndex,
  onTourStepChange,
  onSwitchModel,
  isLightSurface,
  onClose,
  layout = 'sidebar',
}: StudioEducationalPanelProps) {
  const panelUid = useId();
  const modelIdx = STUDIO_MODEL_ORDER.indexOf(modelSpec.id);
  const totalModels = STUDIO_MODEL_ORDER.length;
  const totalSteps = modelSpec.guidedTour.length;
  const safeStepIdx =
    ((tourStepIndex % totalSteps) + totalSteps) % totalSteps;
  const activeStep = modelSpec.guidedTour[safeStepIdx];
  const stepSubsystem =
    modelSpec.subsystems.find((s) => s.id === activeStep.subsystemId) ??
    modelSpec.subsystems[0];

  const shellSurface = isLightSurface
    ? 'bg-wood-surface text-wood-ink border-wood-subtle'
    : 'bg-[#080f1f] text-slate-100 border-slate-800';
  const cardSurface = isLightSurface
    ? 'bg-wood-inset/75 border-wood-subtle text-wood-walnut'
    : 'bg-[#0d172c] border-slate-800/90 text-slate-200';
  const mutedText = isLightSurface ? 'text-wood-muted' : 'text-slate-400';
  const accentText = isLightSurface ? 'text-blue-700' : 'text-cyan-300';
  const btnSubtle = isLightSurface
    ? 'border-wood-default bg-wood-surface text-wood-walnut hover:border-blue-500 hover:text-wood-ink'
    : 'border-slate-700/90 bg-[#0d172c] text-slate-200 hover:border-cyan-400/70 hover:text-white';
  const btnActive = isLightSurface
    ? 'border-blue-600 bg-blue-600 text-white'
    : 'border-cyan-400 bg-cyan-500/20 text-cyan-200';

  const tabs: Array<{ id: EducationalTab; label: string }> = [
    { id: 'inspect', label: 'Component Info' },
    { id: 'tour', label: 'Guided Tour' },
    { id: 'ipe', label: 'IPE Context' },
  ];

  return (
    <aside
      aria-label="Engineering Educational Laboratory Guide"
      className={`flex flex-col select-text ${shellSurface} ${
        layout === 'sidebar'
          ? 'h-full w-full border-t lg:border-t-0 lg:border-l'
          : 'h-full w-full border-t'
      }`}
    >
      {/* Model Navigation & Close Header */}
      <div
        className={`flex items-center justify-between gap-2 border-b px-4 py-3 ${
          isLightSurface ? 'border-wood-subtle' : 'border-slate-800'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSwitchModel('prev')}
            aria-label="Previous engineering model"
            className={`inline-flex min-h-[38px] sm:min-h-[34px] items-center gap-1 rounded-[7px] border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${btnSubtle}`}
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Prev</span>
          </button>
          <span className={`px-1.5 font-mono text-[11px] ${mutedText}`}>
            {customFileName ? 'CAD' : `${modelIdx + 1} / ${totalModels}`}
          </span>
          <button
            type="button"
            onClick={() => onSwitchModel('next')}
            aria-label="Next engineering model"
            className={`inline-flex min-h-[38px] sm:min-h-[34px] items-center gap-1 rounded-[7px] border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${btnSubtle}`}
          >
            <span>Next</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Collapse educational guide"
            className={`inline-flex h-[38px] sm:h-[34px] items-center gap-1 rounded-[7px] border px-2.5 font-mono text-[11px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${btnSubtle}`}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Close</span>
          </button>
        )}
      </div>

      {/* Mode Tabs */}
      {!customFileName && (
        <div
          role="tablist"
          aria-label="Educational studio modes"
          className={`grid grid-cols-3 gap-1.5 border-b px-4 py-2.5 ${
            isLightSurface ? 'border-wood-subtle bg-wood-inset/60' : 'border-slate-800 bg-[#060c1a]'
          }`}
        >
          {tabs.map((tab, idx) => {
            const active = activeTab === tab.id;
            const tabId = `${panelUid}-tab-${tab.id}`;
            return (
              <button
                key={tab.id}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`${panelUid}-tabpanel`}
                tabIndex={active ? 0 : -1}
                onClick={() => onTabChange(tab.id)}
                onKeyDown={(e) => {
                  let nextIdx: number | null = null;
                  if (e.key === 'ArrowRight') {
                    nextIdx = (idx + 1) % tabs.length;
                  } else if (e.key === 'ArrowLeft') {
                    nextIdx = (idx - 1 + tabs.length) % tabs.length;
                  } else if (e.key === 'Home') {
                    nextIdx = 0;
                  } else if (e.key === 'End') {
                    nextIdx = tabs.length - 1;
                  }
                  if (nextIdx !== null) {
                    e.preventDefault();
                    const nextTab = tabs[nextIdx];
                    if (nextTab) {
                      onTabChange(nextTab.id);
                      document.getElementById(`${panelUid}-tab-${nextTab.id}`)?.focus();
                    }
                  }
                }}
                className={`min-h-[38px] sm:min-h-[34px] rounded-[7px] border px-2 py-1 text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                  active ? btnActive : btnSubtle
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Scrollable Educational Body */}
      <div
        id={!customFileName ? `${panelUid}-tabpanel` : undefined}
        role={!customFileName ? 'tabpanel' : undefined}
        aria-labelledby={!customFileName ? `${panelUid}-tab-${activeTab}` : undefined}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {customFileName ? (
          <div className="space-y-4">
            <div className={`rounded-[10px] border p-3.5 ${cardSurface}`}>
              <p className={`font-mono text-[11px] font-medium ${accentText}`}>
                Imported User Geometry
              </p>
              <h3 className="mt-1 font-display text-base font-semibold">
                {customFileName}
              </h3>
              <p className={`mt-2 text-xs leading-relaxed ${mutedText}`}>
                Auto-centered and scaled onto the rotary metrology plinth with PBR roughness/metalness surface lighting. Use camera presets, material swatches, lighting rigs, and orbit controls to inspect mesh geometry.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSwitchModel('next')}
              className={`inline-flex min-h-[38px] w-full items-center justify-center gap-2 rounded-[8px] border px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${btnActive}`}
            >
              <span>Return to Built-In Engineering Models</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : activeTab === 'inspect' ? (
          <div className="space-y-4">
            {/* Quick Subsystem Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className={`font-mono text-[11px] font-medium ${mutedText}`}>
                  Subsystems ({modelSpec.subsystems.length})
                </p>
                {selectedSubsystem && (
                  <button
                    type="button"
                    onClick={() => onSelectSubsystem(null)}
                    className={`font-mono text-[11px] underline cursor-pointer ${accentText}`}
                  >
                    Clear Selection
                  </button>
                )}
              </div>
              <div className="grid gap-1.5">
                {modelSpec.subsystems.map((sub, i) => {
                  const active = selectedSubsystem?.id === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onSelectSubsystem(sub.id)}
                      className={`flex items-center justify-between gap-2 rounded-[8px] border px-3 py-2 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                        active ? btnActive : btnSubtle
                      }`}
                    >
                      <span className="min-w-0 truncate text-xs font-medium">
                        <span className="mr-2 font-mono opacity-65">
                          0{i + 1}
                        </span>
                        {sub.name}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] opacity-75">
                        {sub.stageTag.split('·')[0].trim()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedSubsystem ? (
              <div
                aria-live="polite"
                className={`space-y-3.5 rounded-[12px] border p-4 ${cardSurface}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`font-mono text-[11px] font-medium ${accentText}`}>
                      {selectedSubsystem.stageTag}
                    </p>
                    <h3 className="mt-0.5 font-display text-base font-semibold leading-snug">
                      {selectedSubsystem.name}
                    </h3>
                  </div>
                  {onFocusSubsystem && (
                    <button
                      type="button"
                      onClick={() => onFocusSubsystem(selectedSubsystem)}
                      title="Frame camera onto this component"
                      className={`inline-flex h-8 shrink-0 items-center gap-1 rounded-[7px] border px-2 font-mono text-[10px] cursor-pointer ${btnSubtle}`}
                    >
                      <Crosshair className="h-3 w-3" aria-hidden="true" />
                      <span>Focus</span>
                    </button>
                  )}
                </div>

                <dl className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <dt className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>
                      Engineering Purpose
                    </dt>
                    <dd className="mt-1">{selectedSubsystem.engineeringPurpose}</dd>
                  </div>

                  <div>
                    <dt className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>
                      Working Principle
                    </dt>
                    <dd className="mt-1">{selectedSubsystem.workingPrinciple}</dd>
                  </div>

                  <div>
                    <dt className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>
                      Industrial Application
                    </dt>
                    <dd className="mt-1">{selectedSubsystem.industrialApplication}</dd>
                  </div>

                  <div>
                    <dt className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>
                      Relevant IPE Concepts
                    </dt>
                    <dd className="mt-1.5 flex flex-wrap gap-1.5">
                      {selectedSubsystem.ipeConcepts.map((concept) => (
                        <span
                          key={concept}
                          className={`rounded-[6px] border px-2 py-0.5 font-mono text-[10px] ${
                            isLightSurface
                              ? 'border-wood-default bg-wood-surface text-wood-walnut'
                              : 'border-slate-700 bg-[#080f1f] text-slate-200'
                          }`}
                        >
                          {concept}
                        </span>
                      ))}
                    </dd>
                  </div>

                  <div>
                    <dt className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>
                      Related Research &amp; Projects
                    </dt>
                    <dd className="mt-1.5 space-y-1.5">
                      {selectedSubsystem.relatedRecords.map((rec) => (
                        <Link
                          key={rec.to + rec.label}
                          to={rec.to}
                          className={`flex items-center justify-between gap-2 rounded-[7px] border px-2.5 py-2 text-xs font-medium transition-colors ${btnSubtle}`}
                        >
                          <span className="min-w-0 truncate">
                            <span className={`mr-1.5 font-mono text-[10px] ${accentText}`}>
                              {rec.kind}
                            </span>
                            {rec.label}
                          </span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        </Link>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className={`rounded-[12px] border p-4 space-y-2.5 ${cardSurface}`}>
                <div className="flex items-center gap-2">
                  <Compass className={`h-4 w-4 ${accentText}`} aria-hidden="true" />
                  <h3 className="font-display text-sm font-semibold">
                    Select a Component to Inspect
                  </h3>
                </div>
                <p className={`text-xs leading-relaxed ${mutedText}`}>
                  Click directly on any 3D part, click a numbered callout pin, or choose a subsystem above to study its engineering purpose, working principle, industrial application, and SUST IPE context.
                </p>
                <button
                  type="button"
                  onClick={() => onTabChange('tour')}
                  className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-[7px] border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${btnActive}`}
                >
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Launch Guided Walkthrough</span>
                </button>
              </div>
            )}
          </div>
        ) : activeTab === 'tour' ? (
          <div className="space-y-4">
            <div className={`rounded-[12px] border p-4 space-y-3 ${cardSurface}`}>
              <div className="flex items-center justify-between gap-2">
                <span className={`font-mono text-[11px] font-semibold ${accentText}`}>
                  Guided Walkthrough · Step {safeStepIdx + 1} / {totalSteps}
                </span>
                <span className={`font-mono text-[10px] ${mutedText}`}>
                  {stepSubsystem.shortLabel}
                </span>
              </div>

              <h3 className="font-display text-base font-semibold leading-snug">
                {activeStep.title}
              </h3>

              <p className="text-xs leading-relaxed">
                {activeStep.takeaway}
              </p>

              {/* Stepper Dots / Jump Controls */}
              <div
                role="group"
                aria-label="Walkthrough steps"
                className="flex flex-wrap gap-1.5 pt-1"
              >
                {modelSpec.guidedTour.map((step, i) => {
                  const isCurrent = i === safeStepIdx;
                  return (
                    <button
                      key={step.stepNumber}
                      type="button"
                      onClick={() => onTourStepChange(i)}
                      aria-current={isCurrent ? 'step' : undefined}
                      className={`h-8 min-w-[34px] rounded-[6px] border px-2 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                        isCurrent ? btnActive : btnSubtle
                      }`}
                    >
                      0{step.stepNumber}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-current/10 pt-3">
                <button
                  type="button"
                  onClick={() => onTourStepChange(safeStepIdx - 1)}
                  className={`inline-flex min-h-[36px] items-center gap-1 rounded-[7px] border px-3 py-1.5 text-xs font-medium cursor-pointer ${btnSubtle}`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={() => onTourStepChange(safeStepIdx + 1)}
                  className={`inline-flex min-h-[36px] items-center gap-1 rounded-[7px] border px-3 py-1.5 text-xs font-medium cursor-pointer ${btnActive}`}
                >
                  <span>Next Step</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Active Step Subsystem Reference Summary */}
            <div className={`rounded-[12px] border p-4 space-y-2.5 ${cardSurface}`}>
              <p className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>
                Focused Component · {stepSubsystem.name}
              </p>
              <p className="text-xs leading-relaxed">
                <strong className="font-semibold">Purpose: </strong>
                {stepSubsystem.engineeringPurpose}
              </p>
              <p className="text-xs leading-relaxed">
                <strong className="font-semibold">Principle: </strong>
                {stepSubsystem.workingPrinciple}
              </p>
              <button
                type="button"
                onClick={() => {
                  onSelectSubsystem(stepSubsystem.id);
                  onTabChange('inspect');
                }}
                className={`inline-flex items-center gap-1 font-mono text-[11px] font-medium underline cursor-pointer ${accentText}`}
              >
                <span>Open full component specification sheet</span>
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`rounded-[12px] border p-4 space-y-3 ${cardSurface}`}>
              <div className="flex items-center gap-2">
                <Factory className={`h-4 w-4 ${accentText}`} aria-hidden="true" />
                <h3 className="font-display text-sm font-semibold">
                  Industrial &amp; Production Engineering Lens
                </h3>
              </div>
              <p className="text-xs leading-relaxed">
                {modelSpec.ipeRelevance}
              </p>

              <div className="space-y-1.5 pt-1">
                <p className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>
                  Connected IPE Knowledge Areas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {modelSpec.ipeDomains.map((domain) => (
                    <span
                      key={domain}
                      className={`rounded-[6px] border px-2 py-0.5 font-mono text-[10px] ${
                        isLightSurface
                          ? 'border-wood-default bg-wood-surface text-wood-walnut'
                          : 'border-slate-700 bg-[#080f1f] text-slate-200'
                      }`}
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={`rounded-[12px] border p-4 space-y-2 ${cardSurface}`}>
              <div className="flex items-center gap-2">
                <Layers className={`h-4 w-4 ${accentText}`} aria-hidden="true" />
                <p className="font-display text-xs font-semibold">
                  Linked Portfolio Work
                </p>
              </div>
              <p className={`font-mono text-[11px] ${mutedText}`}>
                {modelSpec.projectRef}
              </p>
              <Link
                to={modelSpec.projectRoute}
                className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-[8px] border px-3 py-1.5 text-xs font-medium transition-colors ${btnActive}`}
              >
                <span>Explore Full Documentation</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}

        {/* Transparent Conceptual Model Notice (Always visible in guide) */}
        <div
          className={`rounded-[10px] border p-3 text-[11px] leading-relaxed ${
            isLightSurface
              ? 'border-amber-400/70 bg-amber-100/75 text-amber-950'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-200/90'
          }`}
        >
          <p className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider">
            <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Conceptual Procedural Model</span>
          </p>
          <p className="mt-1 opacity-90">{modelSpec.conceptualNotice}</p>
        </div>
      </div>
    </aside>
  );
}
