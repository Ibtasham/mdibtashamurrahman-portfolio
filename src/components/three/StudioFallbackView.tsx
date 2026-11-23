import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Info,
  Layers,
} from 'lucide-react';
import {
  resolveWalkthroughStep,
  STUDIO_MODEL_ORDER,
  STUDIO_MODELS,
  type StudioModelId,
  type StudioModelSpec,
  type SubsystemMeta,
} from '../../three/studioConfig';

interface StudioFallbackViewProps {
  reason: string;
  modelSpec: StudioModelSpec;
  selectedSubsystem: SubsystemMeta | null;
  onSelectSubsystem: (id: string) => void;
  onSelectModel: (id: StudioModelId) => void;
  onSwitchModel: (direction: 'prev' | 'next') => void;
  tourStepIndex: number;
  onTourStepChange: (index: number) => void;
}

export function StudioFallbackView({
  reason,
  modelSpec,
  selectedSubsystem,
  onSelectSubsystem,
  onSelectModel,
  onSwitchModel,
  tourStepIndex,
  onTourStepChange,
}: StudioFallbackViewProps) {
  const activeSub = selectedSubsystem ?? modelSpec.subsystems[0];
  const walkthrough = resolveWalkthroughStep(modelSpec.id, tourStepIndex);

  return (
    <div
      role="region"
      aria-label="2D Interactive Engineering Schematic Fallback"
      className="flex h-full w-full flex-col overflow-y-auto bg-[#070d1b] p-4 sm:p-6 text-slate-100"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        {/* Notice Banner */}
        <div className="flex flex-col gap-3 rounded-[12px] border border-cyan-500/35 bg-[#0c162b] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Cpu className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" aria-hidden="true" />
            <div>
              <p className="font-mono text-[11px] font-medium text-cyan-300">
                2D Interactive Engineering Schematic Mode
              </p>
              <h2 className="mt-0.5 font-display text-base sm:text-lg font-semibold text-white">
                {modelSpec.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                {reason} All subsystem documentation, guided walkthrough steps, and IPE explanations remain interactive below.
              </p>
            </div>
          </div>
          <Link
            to={modelSpec.projectRoute}
            className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 self-start rounded-[9px] border border-cyan-400/50 bg-cyan-500/15 px-3 py-2 text-xs font-medium text-cyan-200 hover:bg-cyan-500/25 sm:self-center"
          >
            <span>Open Project Docs</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Model Selector & Prev/Next */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-slate-800 bg-[#0b1325] px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {STUDIO_MODEL_ORDER.map((id) => {
              const spec = STUDIO_MODELS[id];
              const active = spec.id === modelSpec.id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelectModel(id)}
                  className={`min-h-[38px] sm:min-h-[32px] rounded-[7px] border px-2.5 py-1 text-xs font-medium cursor-pointer ${
                    active
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                      : 'border-slate-700 bg-[#091020] text-slate-300 hover:border-cyan-400/60'
                  }`}
                >
                  {spec.shortTitle}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSwitchModel('prev')}
              className="inline-flex min-h-[38px] sm:min-h-[32px] items-center gap-1 rounded-[7px] border border-slate-700 bg-[#091020] px-2.5 py-1 font-mono text-[11px] text-slate-200 cursor-pointer hover:border-cyan-400/60"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Prev</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchModel('next')}
              className="inline-flex min-h-[38px] sm:min-h-[32px] items-center gap-1 rounded-[7px] border border-slate-700 bg-[#091020] px-2.5 py-1 font-mono text-[11px] text-slate-200 cursor-pointer hover:border-cyan-400/60"
            >
              <span>Next</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Two-Column Schematic Inspector */}
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-5">
            <p className="font-mono text-[11px] font-medium text-cyan-300">
              Subsystem Block Schematic ({modelSpec.subsystems.length} Stages)
            </p>
            <div className="grid gap-2">
              {modelSpec.subsystems.map((sub, idx) => {
                const active = activeSub.id === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onSelectSubsystem(sub.id)}
                    className={`rounded-[10px] border p-3 text-left transition-colors cursor-pointer ${
                      active
                        ? 'border-cyan-400 bg-cyan-500/15 text-white'
                        : 'border-slate-800 bg-[#0b1325] text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-cyan-300">
                        0{idx + 1} · {sub.stageTag}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-semibold">{sub.name}</p>
                    <p className="mt-1 text-[11px] leading-snug text-slate-400">
                      {sub.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 lg:col-span-7">
            <div className="rounded-[12px] border border-slate-800 bg-[#0b1325] p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div>
                  <p className="font-mono text-[11px] text-cyan-300">
                    {activeSub.stageTag}
                  </p>
                  <h3 className="font-display text-base font-semibold text-white">
                    {activeSub.name}
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  Tour Step {walkthrough.stepIndex + 1}/{walkthrough.totalSteps}
                </span>
              </div>

              <dl className="grid gap-3 text-xs leading-relaxed sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Engineering Purpose
                  </dt>
                  <dd className="mt-1 text-slate-200">{activeSub.engineeringPurpose}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Working Principle
                  </dt>
                  <dd className="mt-1 text-slate-200">{activeSub.workingPrinciple}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Industrial Application
                  </dt>
                  <dd className="mt-1 text-slate-200">{activeSub.industrialApplication}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Relevant IPE Concepts
                  </dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1.5">
                    {activeSub.ipeConcepts.map((c) => (
                      <span
                        key={c}
                        className="rounded-[6px] border border-slate-700 bg-[#070d1b] px-2 py-0.5 font-mono text-[10px] text-slate-200"
                      >
                        {c}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => onTourStepChange(walkthrough.stepIndex - 1)}
                  className="inline-flex min-h-[38px] sm:min-h-[34px] items-center gap-1 rounded-[7px] border border-slate-700 bg-[#070d1b] px-2.5 py-1 text-xs font-medium text-slate-200 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Prev Walkthrough Step</span>
                </button>
                <button
                  type="button"
                  onClick={() => onTourStepChange(walkthrough.stepIndex + 1)}
                  className="inline-flex min-h-[38px] sm:min-h-[34px] items-center gap-1 rounded-[7px] border border-cyan-400 bg-cyan-500/20 px-2.5 py-1 text-xs font-medium text-cyan-200 cursor-pointer"
                >
                  <span>Next Walkthrough Step</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="rounded-[12px] border border-slate-800 bg-[#0b1325] p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Layers className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <span>How This Assembly Connects to Industrial &amp; Production Engineering</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                {modelSpec.ipeRelevance}
              </p>
              <p className="flex items-start gap-1.5 pt-1 text-[11px] text-amber-200/85">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{modelSpec.conceptualNotice}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
