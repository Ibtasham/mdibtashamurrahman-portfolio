import type { InnovationStageFilter } from '../../utils/portfolioFilters';

interface InnovationPipelineDiagramProps {
  activeStage: InnovationStageFilter;
  onSelectStage: (stage: InnovationStageFilter) => void;
  counts: Record<InnovationStageFilter, number>;
}

const PIPELINE_NODES: {
  stage: Exclude<InnovationStageFilter, 'all'>;
  index: string;
  title: string;
  subtitle: string;
  x: number;
  activeStroke: string;
  dashed: boolean;
}[] = [
  {
    stage: 'idea',
    index: 'STAGE 01',
    title: 'Idea & Concept',
    subtitle: 'Problem framing & pitches',
    x: 20,
    activeStroke: 'var(--ds-svg-accent)',
    dashed: false,
  },
  {
    stage: 'prototype',
    index: 'STAGE 02',
    title: 'Working Prototype',
    subtitle: 'Open-source & ML builds',
    x: 248,
    activeStroke: '#2563eb',
    dashed: false,
  },
  {
    stage: 'validated',
    index: 'STAGE 03',
    title: 'Validated Solution',
    subtitle: 'External pilot & testing',
    x: 476,
    activeStroke: 'var(--ds-svg-border-muted)',
    dashed: true,
  },
  {
    stage: 'launched',
    index: 'STAGE 04',
    title: 'Launched Product',
    subtitle: 'Live market deployment',
    x: 704,
    activeStroke: 'var(--ds-svg-border-muted)',
    dashed: true,
  },
];

export function InnovationPipelineDiagram({
  activeStage,
  onSelectStage,
  counts,
}: InnovationPipelineDiagramProps) {
  return (
    <figure className="space-y-4 rounded-[14px] border border-wood-subtle dark:border-slate-800/80 bg-wood-inset/80 dark:bg-[#060b16] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-wood-subtle dark:border-slate-800/80 pb-3">
        <figcaption className="font-mono text-xs font-medium text-wood-ink dark:text-slate-200">
          Venture Maturity Pipeline · Ideas vs. Prototypes vs. Validation &amp; Launch
        </figcaption>
        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
          <span className="text-cyan-700 dark:text-cyan-300">
            Solid = Active Evidence
          </span>
          <span className="text-wood-muted dark:text-slate-400">
            Dashed = Zero Claimed Yet
          </span>
        </div>
      </div>

      {/* Interactive SVG schematic (desktop & tablet crisp scaling) */}
      <svg
        viewBox="0 0 920 184"
        role="img"
        aria-label="Innovation progression diagram comparing Idea and Concept, Working Prototype, Validated Solution, and Launched Product stages"
        className="hidden sm:block w-full h-auto"
      >
        <defs>
          <marker
            id="inn-arrow-active"
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
            id="inn-arrow-muted"
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
          width="920"
          height="184"
          rx="10"
          fill="var(--ds-svg-canvas)"
        />

        {PIPELINE_NODES.map((node, i) => {
          const selected = activeStage === node.stage;
          const count = counts[node.stage];
          const strokeColor = selected
            ? 'var(--ds-svg-accent)'
            : node.dashed
              ? 'var(--ds-svg-border-muted)'
              : node.activeStroke;

          return (
            <g
              key={node.stage}
              onClick={() =>
                onSelectStage(activeStage === node.stage ? 'all' : node.stage)
              }
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={node.x}
                y="24"
                width="196"
                height="136"
                rx="10"
                fill={selected ? 'var(--ds-svg-node-alt)' : 'var(--ds-svg-node)'}
                stroke={strokeColor}
                strokeDasharray={node.dashed ? '6 4' : undefined}
                strokeWidth={selected ? '2' : '1.4'}
              />

              <text
                x={node.x + 16}
                y="50"
                fill={node.dashed ? 'var(--ds-svg-subtext)' : 'var(--ds-svg-accent)'}
                fontSize="10.5"
                fontFamily="monospace"
              >
                {node.index}
              </text>

              <text
                x={node.x + 16}
                y="78"
                fill="var(--ds-svg-text)"
                fontSize="14.5"
                fontWeight="600"
                fontFamily="sans-serif"
              >
                {node.title}
              </text>

              <text
                x={node.x + 16}
                y="100"
                fill="var(--ds-svg-subtext)"
                fontSize="11.5"
                fontFamily="sans-serif"
              >
                {node.subtitle}
              </text>

              <text
                x={node.x + 16}
                y="138"
                fill={count > 0 ? 'var(--ds-svg-accent)' : 'var(--ds-svg-subtext)'}
                fontSize="13"
                fontWeight="600"
                fontFamily="monospace"
              >
                {count} {count === 1 ? 'Entry' : 'Entries'}
              </text>

              {i < PIPELINE_NODES.length - 1 && (
                <line
                  x1={node.x + 196}
                  y1="92"
                  x2={node.x + 224}
                  y2="92"
                  stroke={
                    i === 0 ? 'var(--ds-svg-accent)' : 'var(--ds-svg-border-muted)'
                  }
                  strokeDasharray={i >= 1 ? '4 3' : undefined}
                  strokeWidth="1.5"
                  markerEnd={
                    i === 0 ? 'url(#inn-arrow-active)' : 'url(#inn-arrow-muted)'
                  }
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Accessible interactive stage selector strip synced with diagram */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 pt-1">
        <span className="font-mono text-[11px] text-wood-muted dark:text-slate-400">
          Select a maturity stage to filter entries below:
        </span>
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:flex sm:flex-wrap gap-2">
          {PIPELINE_NODES.map((node) => {
            const isSelected = activeStage === node.stage;
            return (
              <button
                key={node.stage}
                type="button"
                onClick={() =>
                  onSelectStage(isSelected ? 'all' : node.stage)
                }
                aria-pressed={isSelected}
                className={`min-h-[40px] sm:min-h-[34px] rounded-[8px] border px-3 py-1.5 sm:py-1 font-mono text-[11px] text-left sm:text-center transition-colors duration-150 sm:whitespace-nowrap sm:shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-cyan-400/70 dark:bg-blue-600/20 dark:text-cyan-200'
                    : 'border-wood-subtle bg-wood-surface text-wood-walnut hover:border-wood-default hover:text-wood-ink dark:border-slate-800 dark:bg-[#0b1222] dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white'
                }`}
              >
                {node.title} ({counts[node.stage]})
              </button>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
