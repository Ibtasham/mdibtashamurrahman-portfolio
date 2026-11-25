import { useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { RESEARCH_MANUSCRIPTS } from '../../data/portfolio';
import { DESIGN_TOKENS } from '../../styles/designSystem';

interface PipelineStageSpec {
  id: string;
  index: string;
  title: string;
  statusTag: string;
  subtitle: string;
  summary: string;
  techniques: string[];
  linkedStudyId: string;
  linkedStudyLabel: string;
  x: number;
  dashed: boolean;
}

const MACRO_PIPELINE_STAGES: PipelineStageSpec[] = [
  {
    id: 'benchmark-prep',
    index: '01 · BENCHMARKS',
    title: 'Benchmark & Panel Prep',
    statusTag: 'Public Testbeds',
    subtitle: 'C-MAPSS · FEMTO · M5 Retail',
    summary:
      'Curate run-to-failure turbofan (FD001/FD003) and bearing degradation datasets alongside bottom-level M5 retail item-store demand series under strict benchmark protocols.',
    techniques: ['NASA C-MAPSS FD001/FD003', 'FEMTO / PRONOSTIA', 'M5 Stratified Panel'],
    linkedStudyId: 'rul-explainable',
    linkedStudyLabel: 'Study 01 · Explainable RUL',
    x: 16,
    dashed: false,
  },
  {
    id: 'predictive-explain',
    index: '02 · STUDY 01',
    title: 'Explainable RUL & Transfer',
    statusTag: 'Unpublished Research',
    subtitle: 'RF · XGBoost · LSTM · SHAP',
    summary:
      'Benchmark lightweight tree ensembles and sequential LSTM models across degradation stages, rank influential sensors via SHAP, test reduced sensor sets, and examine cross-dataset fault transfer.',
    techniques: ['Random Forest / XGBoost / LSTM', 'SHAP Sensor Reduction', 'Cross-Fault Pooled Training'],
    linkedStudyId: 'rul-explainable',
    linkedStudyLabel: 'Inspect RUL Study',
    x: 254,
    dashed: false,
  },
  {
    id: 'decision-uncertainty',
    index: '03 · STUDY 02',
    title: 'Decision-Aware Uncertainty',
    statusTag: 'Unpublished Research',
    subtitle: 'DAPE · ETCE · Tail-Brier · DRC',
    summary:
      'Connect RUL risk estimates directly to a cost-sensitive newsvendor-style replacement rule under operating-condition shift using closed-loop DAPE evaluation and DRC recalibration.',
    techniques: ['DAPE Renewal-Reward Loop', 'ETCE & Tail-Brier', 'Decision-Relevant Conformal'],
    linkedStudyId: 'decision-aware-prognostics',
    linkedStudyLabel: 'Inspect DAPE Study',
    x: 492,
    dashed: false,
  },
  {
    id: 'inventory-policy',
    index: '04 · STUDY 03',
    title: 'Decision-Centric Inventory',
    statusTag: 'Unpublished Research',
    subtitle: 'M5 · LightGBM · Lost-Sales Sim',
    summary:
      'Pair point, quantile, and empirical-interval demand forecasters with periodic-review lost-sales replenishment policies under validation-cost strategy selection.',
    techniques: ['Nine Point Forecasters', 'LightGBM Quantile Model', 'Base-Stock & Review Policies'],
    linkedStudyId: 'decision-centric-demand',
    linkedStudyLabel: 'Inspect Inventory Study',
    x: 730,
    dashed: true,
  },
];

const STUDY_SHORT_LABELS: Record<string, string> = {
  'rul-explainable': 'Study 01 · Explainable RUL',
  'decision-aware-prognostics': 'Study 02 · Decision-Aware Uncertainty',
  'decision-centric-demand': 'Study 03 · Decision-Centric Demand',
};

const STUDY_STEP_TITLES: Record<string, string[]> = {
  'rul-explainable': [
    'FD001 & FD003 Setup',
    'RF / XGBoost / LSTM Eval',
    'SHAP & Sensor Pruning',
    'Cross-Fault Transfer',
  ],
  'decision-aware-prognostics': [
    'Cost-Sensitive Rule',
    'DAPE Closed Loop',
    'ETCE / Tail-Brier / DRC',
    'Shift & Limitations',
  ],
  'decision-centric-demand': [
    'M5 Panel & Sampling',
    'Point & Quantile Models',
    'Lost-Sales Policy Sim',
    'Validation Selection',
  ],
};

const STUDY_STEP_SUBTITLES: Record<string, string[]> = {
  'rul-explainable': [
    'Single Condition · Fault Modes',
    'RF · XGBoost · LSTM · RMSE / MAE',
    'SHAP Rankings · Reduced Sensors',
    'Pooled Training & FD002/FD004',
  ],
  'decision-aware-prognostics': [
    'Cost-Sensitive Replacement Rule',
    'C-MAPSS & FEMTO / PRONOSTIA',
    'Risk Reliability & Quantile DRC',
    'Out-of-Support Shift & Retraining',
  ],
  'decision-centric-demand': [
    'Bottom-Level Series & Stratified',
    '9 Point + LightGBM Quantile + Int.',
    'Single-Echelon Periodic Review',
    'Aggregation Confound & Multi-Echelon',
  ],
};

interface ResearchPipelineDiagramProps {
  studyId?: string;
}

export function ResearchPipelineDiagram({ studyId }: ResearchPipelineDiagramProps) {
  const diagramUid = useId();
  const [selectedMode, setSelectedMode] = useState<string>(studyId ?? 'macro');
  const [selectedStageId, setSelectedStageId] = useState<string>(
    studyId ? 'step-0' : 'decision-uncertainty',
  );

  const activeManuscript = useMemo(
    () => RESEARCH_MANUSCRIPTS.find((m) => m.id === selectedMode) ?? null,
    [selectedMode],
  );

  const activeStages: PipelineStageSpec[] = useMemo(() => {
    if (!activeManuscript) {
      return MACRO_PIPELINE_STAGES;
    }

    const steps = activeManuscript.methodologySteps ?? [];
    const customTitles = STUDY_STEP_TITLES[activeManuscript.id] ?? [
      'Benchmark Framing',
      'Core Modelling',
      'Decision Evaluation',
      'Future Directions',
    ];
    const customSubtitles = STUDY_STEP_SUBTITLES[activeManuscript.id] ?? [];
    const xOffsets = [16, 254, 492, 730];

    return [0, 1, 2, 3].map((idx) => {
      const isLast = idx === 3;
      const stepText =
        steps[idx] ??
        (isLast
          ? activeManuscript.futureDirections?.[0] ?? activeManuscript.expectedContribution
          : activeManuscript.expectedContribution);
      return {
        id: `step-${idx}`,
        index: `0${idx + 1} · ${isLast ? 'SCOPE & NEXT' : 'METHODOLOGY'}`,
        title: customTitles[idx] ?? `Stage 0${idx + 1}`,
        statusTag: isLast ? 'Extensions & Limits' : 'Conceptual Stage',
        subtitle:
          customSubtitles[idx] ??
          activeManuscript.methods[idx % Math.max(1, activeManuscript.methods.length)] ??
          activeManuscript.domain,
        summary: stepText,
        techniques: activeManuscript.methods,
        linkedStudyId: activeManuscript.id,
        linkedStudyLabel: 'Open Full Study Page',
        x: xOffsets[idx] ?? 16 + idx * 238,
        dashed: isLast,
      };
    });
  }, [activeManuscript]);

  const activeStage =
    activeStages.find((stage) => stage.id === selectedStageId) ?? activeStages[0];

  const handleModeSwitch = (mode: string) => {
    setSelectedMode(mode);
    setSelectedStageId(mode === 'macro' ? 'decision-uncertainty' : 'step-0');
  };

  return (
    <figure className="space-y-4 rounded-[14px] border border-wood-subtle dark:border-slate-800/80 bg-wood-surface dark:bg-[#060b16] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-wood-subtle dark:border-slate-800/80 pb-3">
        <figcaption className="font-mono text-xs font-medium text-wood-ink dark:text-slate-100">
          {activeManuscript
            ? `Conceptual Methodology Illustration · ${STUDY_SHORT_LABELS[activeManuscript.id] ?? activeManuscript.domain}`
            : 'Conceptual Methodology Visualization · Predictive Modelling to Operational Decisions'}
        </figcaption>
        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
          <span className="text-cyan-700 dark:text-cyan-300">
            Conceptual Explanatory Workflow (No Unpublished Figures)
          </span>
        </div>
      </div>

      {/* Mode Switcher: Overall Research Pipeline vs Specific Study Flowchart */}
      {!studyId && (
        <div
          role="group"
          aria-label="Switch methodology diagram focus"
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            aria-pressed={selectedMode === 'macro'}
            onClick={() => handleModeSwitch('macro')}
            className={`min-h-[40px] sm:min-h-[34px] rounded-[8px] border px-3 py-1.5 font-mono text-[11px] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedMode === 'macro'
                ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-cyan-400/70 dark:bg-blue-600/20 dark:text-cyan-200'
                : 'border-wood-subtle bg-wood-inset text-wood-walnut hover:border-wood-default dark:border-slate-800 dark:bg-[#0b1222] dark:text-slate-300 dark:hover:border-slate-700'
            }`}
          >
            All 3 Connected Studies
          </button>
          {RESEARCH_MANUSCRIPTS.map((study) => {
            const active = selectedMode === study.id;
            return (
              <button
                key={study.id}
                type="button"
                aria-pressed={active}
                onClick={() => handleModeSwitch(study.id)}
                className={`min-h-[40px] sm:min-h-[34px] rounded-[8px] border px-3 py-1.5 font-mono text-[11px] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-cyan-400/70 dark:bg-blue-600/20 dark:text-cyan-200'
                    : 'border-wood-subtle bg-wood-inset text-wood-walnut hover:border-wood-default dark:border-slate-800 dark:bg-[#0b1222] dark:text-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {STUDY_SHORT_LABELS[study.id] ?? study.domain}
              </button>
            );
          })}
        </div>
      )}

      <svg
        viewBox="0 0 960 176"
        role="img"
        aria-label={
          activeManuscript
            ? `Conceptual four-stage methodology diagram for ${activeManuscript.title}`
            : 'Conceptual research architecture connecting benchmark preparation, explainable RUL prediction, decision-aware uncertainty calibration, and decision-centric demand forecasting'
        }
        className="hidden sm:block h-auto w-full"
      >
        <defs>
          <marker
            id="res-arrow-active"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--ds-svg-accent)" />
          </marker>
          <marker
            id="res-arrow-muted"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--ds-svg-subtext)" />
          </marker>
        </defs>

        <rect
          x="0"
          y="0"
          width="960"
          height="176"
          rx="10"
          fill="var(--ds-svg-canvas)"
        />

        {activeStages.map((stage, i) => {
          const isSelected = stage.id === activeStage.id;
          return (
            <g
              key={stage.id}
              onClick={() => setSelectedStageId(stage.id)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={stage.x}
                y="20"
                width="212"
                height="136"
                rx="10"
                fill={isSelected ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
                stroke={
                  isSelected
                    ? 'var(--ds-svg-accent)'
                    : stage.dashed
                      ? 'var(--ds-svg-border-muted)'
                      : '#2563eb'
                }
                strokeDasharray={stage.dashed ? '6 4' : undefined}
                strokeWidth={isSelected ? '2' : '1.4'}
              />

              <text
                x={stage.x + 14}
                y="45"
                fill={stage.dashed ? 'var(--ds-svg-subtext)' : 'var(--ds-svg-accent)'}
                fontSize="10"
                fontFamily="monospace"
              >
                {stage.index}
              </text>

              <text
                x={stage.x + 14}
                y="74"
                fill="var(--ds-svg-text)"
                fontSize="12.5"
                fontWeight="600"
                fontFamily="sans-serif"
              >
                {stage.title}
              </text>

              <text
                x={stage.x + 14}
                y="96"
                fill="var(--ds-svg-subtext)"
                fontSize="10"
                fontFamily="sans-serif"
              >
                {stage.subtitle.length > 32
                  ? `${stage.subtitle.slice(0, 31)}…`
                  : stage.subtitle}
              </text>

              <text
                x={stage.x + 14}
                y="134"
                fill={stage.dashed ? 'var(--ds-svg-subtext)' : 'var(--ds-svg-accent)'}
                fontSize="11"
                fontWeight="600"
                fontFamily="monospace"
              >
                {stage.statusTag}
              </text>

              {i < activeStages.length - 1 && (
                <line
                  x1={stage.x + 212}
                  y1="88"
                  x2={stage.x + 238}
                  y2="88"
                  stroke={
                    i < 2 ? 'var(--ds-svg-accent)' : 'var(--ds-svg-border-muted)'
                  }
                  strokeDasharray={i >= 2 ? '4 3' : undefined}
                  strokeWidth="1.5"
                  markerEnd={
                    i < 2 ? 'url(#res-arrow-active)' : 'url(#res-arrow-muted)'
                  }
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Interactive Stage Selection Tabs & Methodological Detail Panel */}
      <div className="space-y-4 border-t border-wood-subtle dark:border-slate-800/80 pt-4">
        <div
          role="tablist"
          aria-label="Select research methodology stage"
          className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:flex sm:flex-wrap gap-2"
        >
          {activeStages.map((stage, idx) => {
            const active = stage.id === activeStage.id;
            const tabId = `${diagramUid}-tab-${stage.id}`;
            const panelId = `${diagramUid}-panel`;
            return (
              <button
                key={stage.id}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={panelId}
                tabIndex={active ? 0 : -1}
                onClick={() => setSelectedStageId(stage.id)}
                onKeyDown={(e) => {
                  let nextIdx: number | null = null;
                  if (e.key === 'ArrowRight') {
                    nextIdx = (idx + 1) % activeStages.length;
                  } else if (e.key === 'ArrowLeft') {
                    nextIdx = (idx - 1 + activeStages.length) % activeStages.length;
                  } else if (e.key === 'Home') {
                    nextIdx = 0;
                  } else if (e.key === 'End') {
                    nextIdx = activeStages.length - 1;
                  }
                  if (nextIdx !== null) {
                    e.preventDefault();
                    const target = activeStages[nextIdx];
                    if (target) {
                      setSelectedStageId(target.id);
                      document.getElementById(`${diagramUid}-tab-${target.id}`)?.focus();
                    }
                  }
                }}
                className={`min-h-[40px] sm:min-h-[34px] rounded-[8px] border px-3 py-1.5 sm:py-1 font-mono text-[11px] text-left sm:text-center transition-colors sm:whitespace-nowrap sm:shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 ${
                  active
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-cyan-400/70 dark:bg-blue-600/20 dark:text-cyan-200'
                    : 'border-wood-subtle bg-wood-inset text-wood-walnut hover:border-wood-default dark:border-slate-800 dark:bg-[#0b1222] dark:text-slate-300 dark:hover:border-slate-700'
                }`}
              >
                0{idx + 1}. {stage.title}
              </button>
            );
          })}
        </div>

        <div
          id={`${diagramUid}-panel`}
          role="tabpanel"
          aria-labelledby={`${diagramUid}-tab-${activeStage.id}`}
          className="grid gap-4 rounded-[12px] border border-wood-subtle dark:border-slate-800/80 bg-wood-inset/80 dark:bg-[#0b1222] p-4 sm:grid-cols-12 sm:items-center"
        >
          <div className="space-y-1.5 sm:col-span-8">
            <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
              {activeStage.index} · {activeStage.subtitle}
            </p>
            <p className={DESIGN_TOKENS.typography.body}>{activeStage.summary}</p>
            <p className="font-mono text-[11px] text-wood-muted dark:text-slate-400">
              Approaches: {activeStage.techniques.join(' · ')}
            </p>
          </div>
          {!studyId && (
            <div className="flex sm:col-span-4 sm:justify-end">
              <Link
                to={`/research/${activeStage.linkedStudyId}`}
                className="inline-flex min-h-[40px] sm:min-h-[36px] items-center gap-1.5 rounded-[10px] border border-wood-default dark:border-slate-700/80 bg-wood-surface dark:bg-[#060b16] px-3.5 py-2 text-xs font-medium text-blue-700 dark:text-cyan-300 transition-colors hover:border-blue-500/60"
              >
                <span>{activeStage.linkedStudyLabel}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}
