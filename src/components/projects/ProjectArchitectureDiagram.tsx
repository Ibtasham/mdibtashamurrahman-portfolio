import { useEffect, useId, useMemo, useState } from 'react';
import type { ProjectArchitectureLayer } from '../../types/portfolio';

interface ProjectArchitectureDiagramProps {
  projectId: string;
  layers?: ProjectArchitectureLayer[];
}

function getStateDisplay(state: ProjectArchitectureLayer['state']) {
  switch (state) {
    case 'Implemented':
      return {
        glyph: '●',
        textClass: 'text-emerald-700 dark:text-emerald-300',
      };
    case 'Experimental':
      return {
        glyph: '◐',
        textClass: 'text-cyan-700 dark:text-cyan-300',
      };
    case 'Proposed':
    case 'Planned':
      return {
        glyph: '○',
        textClass: 'text-blue-700 dark:text-blue-300',
      };
    default:
      return {
        glyph: '◌',
        textClass: 'text-slate-600 dark:text-slate-400',
      };
  }
}

export function ProjectArchitectureDiagram({
  projectId,
  layers = [],
}: ProjectArchitectureDiagramProps) {
  const diagramUid = useId();
  const [selectedLayerId, setSelectedLayerId] = useState<string>(
    layers[0]?.id ?? '',
  );
  const [selectedEngineIdx, setSelectedEngineIdx] = useState<number>(0);

  useEffect(() => {
    setSelectedLayerId(layers[0]?.id ?? '');
    setSelectedEngineIdx(0);
  }, [projectId, layers]);

  const activeLayer = useMemo(
    () => layers.find((l) => l.id === selectedLayerId) ?? layers[0] ?? null,
    [layers, selectedLayerId],
  );

  const factoryMindEngines = [
    {
      y: 18,
      title: '1. Production Scheduling',
      sub: 'OR-Tools MIP · GA · SA',
      layerId: 'fm-opt',
      detail: 'Evaluates exact Mixed-Integer Programming bounds alongside Genetic Algorithm & Simulated Annealing shop-floor schedules.',
    },
    {
      y: 72,
      title: '2. Supply Chain Opt.',
      sub: 'Network Flow & Inventory',
      layerId: 'fm-opt',
      detail: 'Models procurement allocations, multi-stage flow bottlenecks, and lead-time replenishment sensitivity.',
    },
    {
      y: 126,
      title: '3. Statistical Process Control',
      sub: 'Control Charts & Drift',
      layerId: 'fm-analytics',
      detail: 'Tracks process capability and Shewhart control limits to surface batch drift early.',
    },
    {
      y: 180,
      title: '4. ML Predictive Maintenance',
      sub: 'Scikit-Learn Risk Scoring',
      layerId: 'fm-analytics',
      detail: 'Applies engineered condition telemetry features to score failure risk probability.',
    },
    {
      y: 234,
      title: '5. Discrete-Event Sim.',
      sub: 'Queueing & Throughput',
      layerId: 'fm-opt',
      detail: 'Simulates workstation arrivals, buffers, and utilization under what-if line parameters.',
    },
  ];

  const handleLayerTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number,
  ) => {
    if (layers.length === 0) return;
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIdx = (idx + 1) % layers.length;
    } else if (e.key === 'ArrowLeft') {
      nextIdx = (idx - 1 + layers.length) % layers.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = layers.length - 1;
    }
    if (nextIdx !== null) {
      e.preventDefault();
      const target = layers[nextIdx];
      if (target) {
        setSelectedLayerId(target.id);
        document.getElementById(`${diagramUid}-tab-${target.id}`)?.focus();
      }
    }
  };

  const renderInspector = () => {
    if (!activeLayer) return null;
    const stateMeta = getStateDisplay(activeLayer.state);

    return (
      <div
        id={`${diagramUid}-panel`}
        role="tabpanel"
        aria-labelledby={`${diagramUid}-tab-${activeLayer.id}`}
        className="rounded-[10px] border border-slate-200 dark:border-slate-800/80 bg-slate-50/90 dark:bg-[#050914] p-4 space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2.5">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="font-semibold text-cyan-700 dark:text-cyan-400">
              {activeLayer.stage}
            </span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="font-sans font-semibold text-slate-900 dark:text-slate-100">
              {activeLayer.title}
            </span>
          </div>
          <span className={`font-mono text-[11px] font-medium ${stateMeta.textClass}`}>
            {stateMeta.glyph} {activeLayer.state}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {activeLayer.detail}
        </p>

        <div className="grid gap-3 pt-1 sm:grid-cols-3 text-xs">
          {activeLayer.inputs && (
            <div>
              <p className="font-mono text-[10.5px] text-slate-500 mb-0.5">Inputs</p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeLayer.inputs}
              </p>
            </div>
          )}
          {activeLayer.outputs && (
            <div>
              <p className="font-mono text-[10.5px] text-slate-500 mb-0.5">Outputs</p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeLayer.outputs}
              </p>
            </div>
          )}
          <div>
            <p className="font-mono text-[10.5px] text-slate-500 mb-0.5">
              Technologies &amp; Verification
            </p>
            {activeLayer.technologies && (
              <p className="font-mono text-[11px] text-slate-800 dark:text-slate-200">
                {activeLayer.technologies.join(' · ')}
              </p>
            )}
            {activeLayer.verificationNote && (
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                {activeLayer.verificationNote}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (projectId === 'factorymind') {
    const activeEngine = factoryMindEngines[selectedEngineIdx] ?? factoryMindEngines[0];
    const isInputActive = activeLayer?.id === 'fm-input';
    const isUiActive = activeLayer?.id === 'fm-ui';

    return (
      <figure className="space-y-4 rounded-[14px] border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#060b16] p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
          <figcaption className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200">
            FactoryMind · Interactive 5-Engine Streamlit Pipeline
          </figcaption>
          <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
            ● Verified Status: Implemented Suite
          </span>
        </div>

        {/* Accessible Layer Tabs */}
        {layers.length > 0 && (
          <div
            role="tablist"
            aria-label="Inspect FactoryMind architecture layers"
            className="flex flex-wrap gap-1.5"
          >
            {layers.map((layer, idx) => {
              const selected = activeLayer?.id === layer.id;
              return (
                <button
                  key={layer.id}
                  id={`${diagramUid}-tab-${layer.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${diagramUid}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setSelectedLayerId(layer.id)}
                  onKeyDown={(e) => handleLayerTabKeyDown(e, idx)}
                  className={`min-h-[32px] rounded-[8px] border px-2.5 py-1 font-mono text-[11px] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 ${
                    selected
                      ? 'border-blue-600/80 dark:border-cyan-400/70 bg-blue-50 dark:bg-blue-600/20 text-blue-900 dark:text-cyan-200'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b1222] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {layer.stage} · {layer.title.split(' ')[0]}
                </button>
              );
            })}
          </div>
        )}

        <svg
          viewBox="0 0 920 300"
          role="img"
          aria-label="Interactive FactoryMind system architecture diagram showing Operational Inputs feeding five engines into the Streamlit Dashboard"
          className="w-full h-auto"
        >
          <defs>
            <marker
              id="fm-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--ds-svg-accent)" />
            </marker>
          </defs>

          <rect x="0" y="0" width="920" height="300" rx="10" fill="var(--ds-svg-canvas)" />

          {/* Left Stage: Inputs */}
          <g
            onClick={() => setSelectedLayerId('fm-input')}
            style={{ cursor: 'pointer' }}
          >
            <rect
              x="24"
              y="84"
              width="196"
              height="132"
              rx="10"
              fill={isInputActive ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
              stroke={isInputActive ? 'var(--ds-svg-accent)' : '#2563eb'}
              strokeOpacity={isInputActive ? '1' : '0.55'}
              strokeWidth={isInputActive ? '2' : '1.5'}
            />
            <text x="40" y="112" fill="var(--ds-svg-accent)" fontSize="11" fontFamily="monospace">
              INPUT LAYER
            </text>
            <text x="40" y="136" fill="var(--ds-svg-text)" fontSize="14" fontWeight="600" fontFamily="sans-serif">
              RMG &amp; Plant Inputs
            </text>
            <text x="40" y="160" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Jobs, routing &amp; machines
            </text>
            <text x="40" y="179" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Quality &amp; demand series
            </text>
            <text x="40" y="198" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Condition telemetry
            </text>
          </g>

          {factoryMindEngines.map((node, idx) => {
            const yMid = node.y + 22;
            const engineHighlighted =
              idx === selectedEngineIdx || activeLayer?.id === node.layerId;
            return (
              <path
                key={`in-${node.title}`}
                d={`M 220 150 C 265 150, 265 ${yMid}, 306 ${yMid}`}
                fill="none"
                stroke="var(--ds-svg-accent)"
                strokeOpacity={engineHighlighted ? '0.95' : '0.35'}
                strokeWidth={engineHighlighted ? '2' : '1.25'}
                markerEnd="url(#fm-arrow)"
              />
            );
          })}

          {factoryMindEngines.map((node, idx) => {
            const isSelected =
              idx === selectedEngineIdx &&
              (activeLayer?.id === 'fm-opt' || activeLayer?.id === 'fm-analytics');
            return (
              <g
                key={node.title}
                onClick={() => {
                  setSelectedEngineIdx(idx);
                  setSelectedLayerId(node.layerId);
                }}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x="312"
                  y={node.y}
                  width="290"
                  height="44"
                  rx="8"
                  fill={isSelected ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
                  stroke={isSelected ? 'var(--ds-svg-accent)' : 'var(--ds-svg-border-muted)'}
                  strokeWidth={isSelected ? '2' : '1.25'}
                />
                <text
                  x="328"
                  y={node.y + 19}
                  fill="var(--ds-svg-text)"
                  fontSize="12.5"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  {node.title}
                </text>
                <text
                  x="328"
                  y={node.y + 35}
                  fill="var(--ds-svg-accent)"
                  fontSize="10.5"
                  fontFamily="monospace"
                >
                  {node.sub}
                </text>
              </g>
            );
          })}

          {factoryMindEngines.map((node, idx) => {
            const yMid = node.y + 22;
            const engineHighlighted =
              idx === selectedEngineIdx || isUiActive;
            return (
              <path
                key={`out-${node.title}`}
                d={`M 602 ${yMid} C 648 ${yMid}, 648 150, 692 150`}
                fill="none"
                stroke="var(--ds-svg-accent)"
                strokeOpacity={engineHighlighted ? '0.95' : '0.35'}
                strokeWidth={engineHighlighted ? '2' : '1.25'}
                markerEnd="url(#fm-arrow)"
              />
            );
          })}

          <g
            onClick={() => setSelectedLayerId('fm-ui')}
            style={{ cursor: 'pointer' }}
          >
            <rect
              x="698"
              y="78"
              width="198"
              height="144"
              rx="10"
              fill={isUiActive ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
              stroke="var(--ds-svg-accent)"
              strokeOpacity={isUiActive ? '1' : '0.65'}
              strokeWidth={isUiActive ? '2' : '1.5'}
            />
            <text x="716" y="106" fill="var(--ds-svg-accent)" fontSize="11" fontFamily="monospace">
              PRESENTATION
            </text>
            <text x="716" y="130" fill="var(--ds-svg-text)" fontSize="14" fontWeight="600" fontFamily="sans-serif">
              Streamlit Dashboard
            </text>
            <text x="716" y="156" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Solver &amp; heuristic view
            </text>
            <text x="716" y="176" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • SPC &amp; risk inspection
            </text>
            <text x="716" y="196" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Line-balancing scenarios
            </text>
          </g>
        </svg>

        {activeEngine && (
          <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
            Selected Engine Focus: <span className="text-slate-900 dark:text-slate-100 font-semibold">{activeEngine.title}</span> — {activeEngine.detail}
          </p>
        )}

        {renderInspector()}
      </figure>
    );
  }

  if (projectId === 'forgemind-ai') {
    const isSel = (id: string) => activeLayer?.id === id;

    return (
      <figure className="space-y-4 rounded-[14px] border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#060b16] p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
          <figcaption className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200">
            ForgeMind AI · Implemented Baselines vs. Experimental &amp; Proposed Tracks
          </figcaption>
          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
            <span className="text-cyan-700 dark:text-cyan-300">Solid = Implemented</span>
            <span className="text-slate-600 dark:text-slate-400">Dashed = Experimental / Proposed</span>
          </div>
        </div>

        {layers.length > 0 && (
          <div
            role="tablist"
            aria-label="Inspect ForgeMind AI architecture stages"
            className="flex flex-wrap gap-1.5"
          >
            {layers.map((layer, idx) => {
              const selected = activeLayer?.id === layer.id;
              return (
                <button
                  key={layer.id}
                  id={`${diagramUid}-tab-${layer.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${diagramUid}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setSelectedLayerId(layer.id)}
                  onKeyDown={(e) => handleLayerTabKeyDown(e, idx)}
                  className={`min-h-[32px] rounded-[8px] border px-2.5 py-1 font-mono text-[11px] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 ${
                    selected
                      ? 'border-blue-600/80 dark:border-cyan-400/70 bg-blue-50 dark:bg-blue-600/20 text-blue-900 dark:text-cyan-200'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b1222] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {layer.stage} · {layer.state}
                </button>
              );
            })}
          </div>
        )}

        <svg
          viewBox="0 0 920 260"
          role="img"
          aria-label="Interactive ForgeMind AI two-tier research architecture separating Implemented C-MAPSS RUL modeling from Experimental and Proposed Maintenance Policy evaluation"
          className="w-full h-auto"
        >
          <defs>
            <marker
              id="fg-arrow-solid"
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
              id="fg-arrow-dash"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
            </marker>
          </defs>

          <rect x="0" y="0" width="920" height="260" rx="10" fill="var(--ds-svg-canvas)" />

          <text x="28" y="34" fill="var(--ds-svg-accent)" fontSize="11" fontFamily="monospace">
            IMPLEMENTED FOUNDATION
          </text>
          <text x="488" y="34" fill="var(--ds-svg-subtext)" fontSize="11" fontFamily="monospace">
            EXPERIMENTAL &amp; PROPOSED TRACKS
          </text>

          <g onClick={() => setSelectedLayerId('fg-ingest')} style={{ cursor: 'pointer' }}>
            <rect
              x="24"
              y="52"
              width="190"
              height="170"
              rx="10"
              fill={isSel('fg-ingest') ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
              stroke={isSel('fg-ingest') ? 'var(--ds-svg-accent)' : '#2563eb'}
              strokeWidth={isSel('fg-ingest') ? '2' : '1.5'}
            />
            <text x="40" y="80" fill="var(--ds-svg-accent)" fontSize="10.5" fontFamily="monospace">
              STAGE 01 · IMPLEMENTED
            </text>
            <text x="40" y="104" fill="var(--ds-svg-text)" fontSize="14" fontWeight="600" fontFamily="sans-serif">
              NASA C-MAPSS
            </text>
            <text x="40" y="130" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • FD001 engine cycles
            </text>
            <text x="40" y="150" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Sensor normalization
            </text>
            <text x="40" y="170" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Windowed RUL targets
            </text>
          </g>

          <line
            x1="214"
            y1="137"
            x2="246"
            y2="137"
            stroke="var(--ds-svg-accent)"
            strokeWidth="1.5"
            markerEnd="url(#fg-arrow-solid)"
          />

          <g onClick={() => setSelectedLayerId('fg-models')} style={{ cursor: 'pointer' }}>
            <rect
              x="252"
              y="52"
              width="202"
              height="170"
              rx="10"
              fill={isSel('fg-models') ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
              stroke="var(--ds-svg-accent)"
              strokeOpacity={isSel('fg-models') ? '1' : '0.65'}
              strokeWidth={isSel('fg-models') ? '2' : '1.5'}
            />
            <text x="268" y="80" fill="var(--ds-svg-accent)" fontSize="10.5" fontFamily="monospace">
              STAGE 02 · IMPLEMENTED
            </text>
            <text x="268" y="104" fill="var(--ds-svg-text)" fontSize="14" fontWeight="600" fontFamily="sans-serif">
              RUL + Explainability
            </text>
            <text x="268" y="130" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • RF, XGBoost &amp; LSTM
            </text>
            <text x="268" y="150" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • SHAP sensor reduction
            </text>
            <text x="268" y="170" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Interval calibration logs
            </text>
          </g>

          <line
            x1="454"
            y1="137"
            x2="486"
            y2="137"
            stroke="#64748b"
            strokeDasharray="5 4"
            strokeWidth="1.5"
            markerEnd="url(#fg-arrow-dash)"
          />

          <g onClick={() => setSelectedLayerId('fg-uncert')} style={{ cursor: 'pointer' }}>
            <rect
              x="492"
              y="52"
              width="192"
              height="170"
              rx="10"
              fill={isSel('fg-uncert') ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
              stroke={isSel('fg-uncert') ? 'var(--ds-svg-accent)' : '#64748b'}
              strokeDasharray={isSel('fg-uncert') ? undefined : '6 4'}
              strokeWidth={isSel('fg-uncert') ? '2' : '1.5'}
            />
            <text x="508" y="80" fill="var(--ds-svg-subtext)" fontSize="10.5" fontFamily="monospace">
              STAGE 03 · EXPERIMENTAL
            </text>
            <text x="508" y="104" fill="var(--ds-svg-text)" fontSize="14" fontWeight="600" fontFamily="sans-serif">
              Domain-Shift Stress
            </text>
            <text x="508" y="130" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Operating-condition shifts
            </text>
            <text x="508" y="150" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Multi-regime C-MAPSS
            </text>
            <text x="508" y="170" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Coverage degradation test
            </text>
          </g>

          <line
            x1="684"
            y1="137"
            x2="710"
            y2="137"
            stroke="#64748b"
            strokeDasharray="5 4"
            strokeWidth="1.5"
            markerEnd="url(#fg-arrow-dash)"
          />

          <g onClick={() => setSelectedLayerId('fg-policy')} style={{ cursor: 'pointer' }}>
            <rect
              x="716"
              y="52"
              width="180"
              height="170"
              rx="10"
              fill={isSel('fg-policy') ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
              stroke={isSel('fg-policy') ? 'var(--ds-svg-accent)' : '#64748b'}
              strokeDasharray={isSel('fg-policy') ? undefined : '6 4'}
              strokeWidth={isSel('fg-policy') ? '2' : '1.5'}
            />
            <text x="732" y="80" fill="var(--ds-svg-subtext)" fontSize="10.5" fontFamily="monospace">
              STAGE 04 · PROPOSED
            </text>
            <text x="732" y="104" fill="var(--ds-svg-text)" fontSize="14" fontWeight="600" fontFamily="sans-serif">
              Cost Evaluation
            </text>
            <text x="732" y="130" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Preventive vs. reactive
            </text>
            <text x="732" y="150" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Uncertainty thresholds
            </text>
            <text x="732" y="170" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Realized policy cost
            </text>
          </g>
        </svg>

        {renderInspector()}
      </figure>
    );
  }

  return (
    <figure className="space-y-4 rounded-[14px] border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#060b16] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <figcaption className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200">
          TikaTrack · Interactive Verification Slot (Source &amp; Documentation Pending)
        </figcaption>
        <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
          ◌ Status: Developing Concept · Awaiting Source Code
        </span>
      </div>

      {layers.length > 0 && (
        <div
          role="tablist"
          aria-label="Inspect TikaTrack pending documentation stages"
          className="flex flex-wrap gap-1.5"
        >
          {layers.map((layer, idx) => {
            const selected = activeLayer?.id === layer.id;
            return (
              <button
                key={layer.id}
                id={`${diagramUid}-tab-${layer.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${diagramUid}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setSelectedLayerId(layer.id)}
                onKeyDown={(e) => handleLayerTabKeyDown(e, idx)}
                className={`min-h-[32px] rounded-[8px] border px-2.5 py-1 font-mono text-[11px] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 ${
                  selected
                    ? 'border-blue-600/80 dark:border-cyan-400/70 bg-blue-50 dark:bg-blue-600/20 text-blue-900 dark:text-cyan-200'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b1222] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {layer.stage} · Awaiting Source
              </button>
            );
          })}
        </div>
      )}

      <svg
        viewBox="0 0 920 200"
        role="img"
        aria-label="Interactive TikaTrack modular case study pipeline awaiting supplied source code, documentation, and product screenshots"
        className="w-full h-auto"
      >
        <rect x="0" y="0" width="920" height="200" rx="10" fill="var(--ds-svg-canvas)" />
        {[
          { x: 24, layerId: 'tt-source', stage: 'STAGE 01', title: 'Supply Source Code', note: 'Attach codebase / README' },
          { x: 326, layerId: 'tt-domain', stage: 'STAGE 02', title: 'Audit Real Features', note: 'Extract verified modules' },
          { x: 628, layerId: 'tt-docs', stage: 'STAGE 03', title: 'Attach Screenshots', note: 'Bind UI captures in data' },
        ].map((step, i) => {
          const isSelected = activeLayer?.id === step.layerId;
          return (
            <g
              key={step.stage}
              onClick={() => setSelectedLayerId(step.layerId)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={step.x}
                y="36"
                width="268"
                height="128"
                rx="10"
                fill={isSelected ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
                stroke={isSelected ? 'var(--ds-svg-accent)' : '#64748b'}
                strokeDasharray={isSelected ? undefined : '6 4'}
                strokeWidth={isSelected ? '2' : '1.5'}
              />
              <text x={step.x + 20} y="68" fill="var(--ds-svg-accent)" fontSize="11" fontFamily="monospace">
                {step.stage} · PENDING
              </text>
              <text
                x={step.x + 20}
                y="98"
                fill="var(--ds-svg-text)"
                fontSize="15"
                fontWeight="600"
                fontFamily="sans-serif"
              >
                {step.title}
              </text>
              <text x={step.x + 20} y="128" fill="var(--ds-svg-subtext)" fontSize="12" fontFamily="sans-serif">
                {step.note}
              </text>
              {i < 2 && (
                <line
                  x1={step.x + 268}
                  y1="100"
                  x2={step.x + 302}
                  y2="100"
                  stroke="#64748b"
                  strokeDasharray="4 3"
                  strokeWidth="1.5"
                />
              )}
            </g>
          );
        })}
      </svg>

      {renderInspector()}
    </figure>
  );
}
