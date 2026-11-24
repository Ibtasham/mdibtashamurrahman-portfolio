import { useEffect, useId, useMemo, useState } from 'react';
import { useMotionPreference } from '../../hooks/useMotionPreference';
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
  const { shouldReduceMotion } = useMotionPreference();
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
      title: '1. Inventory, EOQ/EPQ & Advisor',
      sub: 'OLS ROP · Discounts · ABC',
      layerId: 'fm-opt',
      detail: 'Computes Wilson EOQ, finite-rate EPQ, quantity-discount breaks, OLS-detrended ROP, and working-capital Portfolio Advisor allocation.',
    },
    {
      y: 72,
      title: '2. 12-Model Forecast & Smart Alerts',
      sub: 'Rolling CV · Croston · SBA',
      layerId: 'fm-opt',
      detail: 'Cross-validates 12 forecasting models with horizon-widened 95% intervals and predictive stockout triggers across Workbench views.',
    },
    {
      y: 126,
      title: '3. Multi-Level MRP & 5-Solver Balance',
      sub: 'L4L/POQ · RPW · Branch & Bound',
      layerId: 'fm-opt',
      detail: 'Runs low-level-coded 5-BOM MRP explosions and compares RPW, LCR, Kilbridge & Wester, COMSOAL, and Exact Branch & Bound balancing.',
    },
    {
      y: 180,
      title: '4. SPC & Binary-Heap Line DES',
      sub: 'Shewhart/EWMA · Buffers · M/M/c',
      layerId: 'fm-analytics',
      detail: 'Tracks Western Electric Rules 1–3, EWMA/CUSUM shifts, blocking/starvation DES queues, MTBF/MTTR failures, and Little’s Law L = λW.',
    },
    {
      y: 234,
      title: '5. 3D Digital Twin & Decision Lab',
      sub: 'Three.js · Approval Gates · jsPDF',
      layerId: 'fm-analytics',
      detail: 'Syncs ROP/DES telemetry onto a Three.js factory/BOM twin and pairs a deterministic NL Assistant (field approval diffs) with optional Gemini narration.',
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
            FactoryMind · Pure TypeScript Engine &amp; React 19 Workbench Topology
          </figcaption>
          <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
            ● Verified Status: Live Workbench &amp; 12 Test Suites
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
                  {layer.stage} · {layer.title.split(',')[0]?.split(' ')[0]}
                </button>
              );
            })}
          </div>
        )}

        <svg
          viewBox="0 0 920 300"
          role="img"
          aria-label="Interactive FactoryMind system architecture diagram showing seeded 17-SKU Catalog and CSV import feeding five pure TypeScript engine groups into React 19 Workbench views"
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
              y="76"
              width="196"
              height="148"
              rx="10"
              fill={isInputActive ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
              stroke={isInputActive ? 'var(--ds-svg-accent)' : '#10b981'}
              strokeOpacity={isInputActive ? '1' : '0.65'}
              strokeWidth={isInputActive ? '2' : '1.5'}
            />
            <text x="40" y="104" fill="var(--ds-svg-accent)" fontSize="10.5" fontFamily="monospace">
              LAYER 01 · STORE
            </text>
            <text x="40" y="128" fill="var(--ds-svg-text)" fontSize="14" fontWeight="600" fontFamily="sans-serif">
              Plant Catalog &amp; Ledger
            </text>
            <text x="40" y="152" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • 17 demo SKUs &amp; 5 BOMs
            </text>
            <text x="40" y="172" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • 34 ledger &amp; 3 stations
            </text>
            <text x="40" y="192" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Hardened CSV/JSON upload
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
                className={engineHighlighted && !shouldReduceMotion ? 'animate-svg-flow' : undefined}
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
                  fontSize="12"
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
                className={engineHighlighted && !shouldReduceMotion ? 'animate-svg-flow' : undefined}
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
              y="70"
              width="198"
              height="160"
              rx="10"
              fill={isUiActive ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
              stroke="var(--ds-svg-accent)"
              strokeOpacity={isUiActive ? '1' : '0.65'}
              strokeWidth={isUiActive ? '2' : '1.5'}
            />
            <text x="716" y="98" fill="var(--ds-svg-accent)" fontSize="10.5" fontFamily="monospace">
              LAYER 04 · WORKBENCH
            </text>
            <text x="716" y="122" fill="var(--ds-svg-text)" fontSize="14" fontWeight="600" fontFamily="sans-serif">
              React 19 + 3D Studio
            </text>
            <text x="716" y="148" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • 20+ solver &amp; sim routes
            </text>
            <text x="716" y="168" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • Scenario Studio &amp; Cmd+K
            </text>
            <text x="716" y="188" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
              • jsPDF / CSV / MD reports
            </text>
            <text x="716" y="208" fill="var(--ds-svg-accent)" fontSize="10.5" fontFamily="monospace">
              + Optional /api Gemini explain
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

  const isTikaSel = (id: string) => activeLayer?.id === id;

  return (
    <figure className="space-y-4 rounded-[14px] border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#060b16] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <figcaption className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200">
          TikaTrack · Offline-First Bilingual Clinical PWA &amp; Optional Cloud Architecture
        </figcaption>
        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
          <span className="text-emerald-700 dark:text-emerald-300">● Offline Static PWA</span>
          <span className="text-slate-600 dark:text-slate-400">Dashed = Optional Cloud / Gemini Server</span>
        </div>
      </div>

      {layers.length > 0 && (
        <div
          role="tablist"
          aria-label="Inspect TikaTrack architecture layers"
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
                    ? 'border-teal-700/80 dark:border-emerald-400/70 bg-emerald-50 dark:bg-emerald-500/15 text-teal-900 dark:text-emerald-200'
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
        aria-label="Interactive TikaTrack 4-layer architecture separating Offline Browser Vault, WHO Growth and Cold-Chain Labs, Signed ECDSA QR and BM25 RAG from Optional Cloud Sync"
        className="w-full h-auto"
      >
        <defs>
          <marker
            id="tt-diag-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
          </marker>
          <marker
            id="tt-diag-dash"
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

        <text x="28" y="34" fill="#10b981" fontSize="11" fontFamily="monospace">
          CLIENT OFFLINE-FIRST CORE (GITHUB PAGES)
        </text>
        <text x="706" y="34" fill="var(--ds-svg-subtext)" fontSize="11" fontFamily="monospace">
          OPTIONAL CLOUD / AI EXT.
        </text>

        {/* Layer 1: Local Vault & Scheduler */}
        <g onClick={() => setSelectedLayerId('tt-schedule')} style={{ cursor: 'pointer' }}>
          <rect
            x="24"
            y="52"
            width="196"
            height="172"
            rx="10"
            fill={isTikaSel('tt-schedule') ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
            stroke={isTikaSel('tt-schedule') ? '#10b981' : '#0d9488'}
            strokeWidth={isTikaSel('tt-schedule') ? '2' : '1.5'}
          />
          <text x="40" y="79" fill="#10b981" fontSize="10.5" fontFamily="monospace">
            LAYER 01 · OFFLINE
          </text>
          <text x="40" y="103" fill="var(--ds-svg-text)" fontSize="14" fontWeight="600" fontFamily="sans-serif">
            Lifespan Scheduler
          </text>
          <text x="40" y="130" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
            • 90 vaccines · 196 doses
          </text>
          <text x="40" y="150" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
            • PBKDF2 localStorage vault
          </text>
          <text x="40" y="170" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
            • English &amp; বাংলা EN/BN UI
          </text>
          <text x="40" y="196" fill="#0d9488" fontSize="10" fontFamily="monospace">
            16 DGHS / Adult Stages
          </text>
        </g>

        <line
          x1="220"
          y1="138"
          x2="248"
          y2="138"
          stroke="#10b981"
          strokeWidth="1.75"
          className={shouldReduceMotion ? undefined : 'animate-svg-flow'}
          markerEnd="url(#tt-diag-arrow)"
        />

        {/* Layer 2: WHO Growth, Centres & Cold-Chain */}
        <g onClick={() => setSelectedLayerId('tt-analytics')} style={{ cursor: 'pointer' }}>
          <rect
            x="252"
            y="52"
            width="202"
            height="172"
            rx="10"
            fill={isTikaSel('tt-analytics') ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
            stroke={isTikaSel('tt-analytics') ? '#10b981' : '#0d9488'}
            strokeWidth={isTikaSel('tt-analytics') ? '2' : '1.5'}
          />
          <text x="268" y="79" fill="#10b981" fontSize="10.5" fontFamily="monospace">
            LAYER 02 · OFFLINE
          </text>
          <text x="268" y="103" fill="var(--ds-svg-text)" fontSize="14" fontWeight="600" fontFamily="sans-serif">
            Growth, Map &amp; 3D Lab
          </text>
          <text x="268" y="130" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
            • WHO 0–60m &amp; BMI charts
          </text>
          <text x="268" y="150" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
            • 175 centres · 64 districts
          </text>
          <text x="268" y="170" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
            • Three.js +2–8°C Cold-Chain
          </text>
          <text x="268" y="196" fill="#0d9488" fontSize="10" fontFamily="monospace">
            Recharts + Google Maps
          </text>
        </g>

        <line
          x1="454"
          y1="138"
          x2="482"
          y2="138"
          stroke="#10b981"
          strokeWidth="1.75"
          className={shouldReduceMotion ? undefined : 'animate-svg-flow'}
          markerEnd="url(#tt-diag-arrow)"
        />

        {/* Layer 3: Crypto QR & Offline BM25 RAG */}
        <g onClick={() => setSelectedLayerId('tt-passport')} style={{ cursor: 'pointer' }}>
          <rect
            x="486"
            y="52"
            width="196"
            height="172"
            rx="10"
            fill={isTikaSel('tt-passport') ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
            stroke={isTikaSel('tt-passport') ? '#10b981' : '#0d9488'}
            strokeWidth={isTikaSel('tt-passport') ? '2' : '1.5'}
          />
          <text x="502" y="79" fill="#10b981" fontSize="10.5" fontFamily="monospace">
            LAYER 03 · OFFLINE
          </text>
          <text x="502" y="103" fill="var(--ds-svg-text)" fontSize="14" fontWeight="600" fontFamily="sans-serif">
            Signed QR &amp; TikaBot
          </text>
          <text x="502" y="130" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
            • ECDSA P-256 &amp; HMAC QR
          </text>
          <text x="502" y="150" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
            • Live jsQR &amp; .ics export
          </text>
          <text x="502" y="170" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
            • Offline BM25 cited RAG
          </text>
          <text x="502" y="196" fill="#0d9488" fontSize="10" fontFamily="monospace">
            46 Automated Test Suites
          </text>
        </g>

        <line
          x1="682"
          y1="138"
          x2="710"
          y2="138"
          stroke="#64748b"
          strokeDasharray="5 4"
          strokeWidth="1.5"
          markerEnd="url(#tt-diag-dash)"
        />

        {/* Layer 4: SW & Optional Cloud Sync */}
        <g onClick={() => setSelectedLayerId('tt-sync')} style={{ cursor: 'pointer' }}>
          <rect
            x="714"
            y="52"
            width="182"
            height="172"
            rx="10"
            fill={isTikaSel('tt-sync') ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
            stroke={isTikaSel('tt-sync') ? '#10b981' : '#64748b'}
            strokeDasharray={isTikaSel('tt-sync') ? undefined : '6 4'}
            strokeWidth={isTikaSel('tt-sync') ? '2' : '1.5'}
          />
          <text x="730" y="79" fill="var(--ds-svg-subtext)" fontSize="10.5" fontFamily="monospace">
            LAYER 04 · OPTIONAL
          </text>
          <text x="730" y="103" fill="var(--ds-svg-text)" fontSize="14" fontWeight="600" fontFamily="sans-serif">
            SW &amp; Cloud Bridge
          </text>
          <text x="730" y="130" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
            • Hashed PWA SW cache
          </text>
          <text x="730" y="150" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
            • Firebase / Drizzle SQL
          </text>
          <text x="730" y="170" fill="var(--ds-svg-subtext)" fontSize="11.5" fontFamily="sans-serif">
            • VAPID Push &amp; /ws Voice
          </text>
          <text x="730" y="196" fill="var(--ds-svg-subtext)" fontSize="10" fontFamily="monospace">
            Requires server env keys
          </text>
        </g>
      </svg>

      {renderInspector()}
    </figure>
  );
}
