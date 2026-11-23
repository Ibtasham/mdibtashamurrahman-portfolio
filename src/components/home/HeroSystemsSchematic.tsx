import { useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SystemTrack {
  id: 'optimization' | 'prognostics' | 'sustainability';
  code: string;
  label: string;
  input: string;
  engine: string;
  output: string;
  route: string;
  routeLabel: string;
}

const SYSTEM_TRACKS: SystemTrack[] = [
  {
    id: 'optimization',
    code: 'SYS-01',
    label: 'OR & Production',
    input: 'Shop-Floor Constraints & Line Takt',
    engine: 'OR-Tools MIP · GA · SA · DES',
    output: 'FactoryMind Optimization Suite',
    route: '/projects/factorymind',
    routeLabel: 'Inspect FactoryMind',
  },
  {
    id: 'prognostics',
    code: 'SYS-02',
    label: 'ML & Prognostics',
    input: 'NASA C-MAPSS · FEMTO Telemetry',
    engine: 'SHAP Attribution · Prob. RUL',
    output: 'ForgeMind AI & Prognostic Studies',
    route: '/research/decision-aware-prognostics',
    routeLabel: 'View Prognostics Study',
  },
  {
    id: 'sustainability',
    code: 'SYS-03',
    label: 'Carbon & Grid',
    input: '2025 Grid Carbon & TOU Tariffs',
    engine: 'Carbon-Aware JSS Formulation',
    output: 'Price–Carbon Trade-off Bounds',
    route: '/research/carbon-aware-jss',
    routeLabel: 'View Scheduling Study',
  },
];

export function HeroSystemsSchematic() {
  const [activeId, setActiveId] = useState<SystemTrack['id']>('optimization');
  const activeIndex = Math.max(
    0,
    SYSTEM_TRACKS.findIndex((t) => t.id === activeId),
  );
  const activeTrack = SYSTEM_TRACKS[activeIndex] ?? SYSTEM_TRACKS[0];

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIdx: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIdx = (index + 1) % SYSTEM_TRACKS.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIdx = (index - 1 + SYSTEM_TRACKS.length) % SYSTEM_TRACKS.length;
    } else if (event.key === 'Home') {
      nextIdx = 0;
    } else if (event.key === 'End') {
      nextIdx = SYSTEM_TRACKS.length - 1;
    }
    if (nextIdx !== null) {
      event.preventDefault();
      const target = SYSTEM_TRACKS[nextIdx];
      if (target) {
        setActiveId(target.id);
        document.getElementById(`hero-sys-tab-${target.id}`)?.focus();
      }
    }
  };

  return (
    <div className="rounded-[12px] border border-slate-200 dark:border-slate-800/80 bg-slate-50/90 dark:bg-[#060b16] p-3.5 space-y-3">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2">
        <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
          Systems Architecture Map
        </span>
        <span className="font-mono text-[11px] font-medium text-cyan-700 dark:text-cyan-400 tabular-nums">
          {activeTrack.code}
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Engineering system focus tracks"
        className="grid grid-cols-3 gap-1.5"
      >
        {SYSTEM_TRACKS.map((track, idx) => {
          const isActive = track.id === activeTrack.id;
          return (
            <button
              key={track.id}
              id={`hero-sys-tab-${track.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="hero-systems-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(track.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`min-h-[32px] rounded-[8px] border px-2 py-1 text-center font-mono text-[10.5px] font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer ${
                isActive
                  ? 'border-blue-600/75 dark:border-cyan-400/70 bg-blue-50 dark:bg-blue-600/18 text-blue-950 dark:text-cyan-200'
                  : 'border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0b1222] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {track.label}
            </button>
          );
        })}
      </div>

      {/* Subtle Architectural Flow SVG */}
      <div
        id="hero-systems-panel"
        role="tabpanel"
        aria-labelledby={`hero-sys-tab-${activeTrack.id}`}
        className="space-y-2.5"
      >
        <svg
          viewBox="0 0 420 82"
          role="img"
          aria-label={`Pipeline diagram for ${activeTrack.label}: ${activeTrack.input} processed by ${activeTrack.engine} into ${activeTrack.output}`}
          className="h-auto w-full select-none"
        >
          {/* Baseline guide line */}
          <line
            x1="20"
            y1="41"
            x2="400"
            y2="41"
            stroke="var(--ds-svg-border-muted)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Connector arrows */}
          <line
            x1="126"
            y1="41"
            x2="148"
            y2="41"
            stroke="var(--ds-svg-accent)"
            strokeWidth="1.5"
          />
          <polygon
            points="148,37 156,41 148,45"
            fill="var(--ds-svg-accent)"
          />
          <line
            x1="264"
            y1="41"
            x2="286"
            y2="41"
            stroke="var(--ds-svg-accent)"
            strokeWidth="1.5"
          />
          <polygon
            points="286,37 294,41 286,45"
            fill="var(--ds-svg-accent)"
          />

          {/* Node 1: Data & Problem Input */}
          <rect
            x="4"
            y="11"
            width="122"
            height="60"
            rx="8"
            fill="var(--ds-svg-node)"
            stroke="var(--ds-svg-border-muted)"
            strokeWidth="1"
          />
          <text
            x="14"
            y="31"
            fill="var(--ds-svg-accent)"
            fontSize="9"
            fontFamily="var(--font-mono)"
          >
            01 · INPUTS
          </text>
          <text
            x="14"
            y="47"
            fill="var(--ds-svg-text)"
            fontSize="10"
            fontWeight="600"
            fontFamily="var(--font-sans)"
          >
            {activeTrack.id === 'optimization'
              ? 'RMG Line & Jobs'
              : activeTrack.id === 'prognostics'
                ? 'C-MAPSS Sensors'
                : 'EU Grid & Tariffs'}
          </text>
          <text
            x="14"
            y="60"
            fill="var(--ds-svg-subtext)"
            fontSize="8.5"
            fontFamily="var(--font-mono)"
          >
            Verified Scope
          </text>

          {/* Node 2: Core Analytical Solver */}
          <rect
            x="156"
            y="8"
            width="108"
            height="66"
            rx="8"
            fill="var(--ds-svg-node-alt)"
            stroke="var(--ds-svg-accent)"
            strokeWidth="1.25"
          />
          <text
            x="166"
            y="28"
            fill="var(--ds-svg-accent)"
            fontSize="9"
            fontFamily="var(--font-mono)"
          >
            02 · MODEL
          </text>
          <text
            x="166"
            y="45"
            fill="var(--ds-svg-text)"
            fontSize="10"
            fontWeight="600"
            fontFamily="var(--font-sans)"
          >
            {activeTrack.id === 'optimization'
              ? 'MIP · GA · SA'
              : activeTrack.id === 'prognostics'
                ? 'XAI & Prob. ML'
                : 'Multi-Obj. MIP'}
          </text>
          <text
            x="166"
            y="60"
            fill="var(--ds-svg-subtext)"
            fontSize="8.5"
            fontFamily="var(--font-mono)"
          >
            Python · OR-Tools
          </text>

          {/* Node 3: Verified Artifact */}
          <rect
            x="294"
            y="11"
            width="122"
            height="60"
            rx="8"
            fill="var(--ds-svg-node)"
            stroke="var(--ds-svg-border-muted)"
            strokeWidth="1"
          />
          <text
            x="304"
            y="31"
            fill="var(--ds-svg-accent)"
            fontSize="9"
            fontFamily="var(--font-mono)"
          >
            03 · OUTPUT
          </text>
          <text
            x="304"
            y="47"
            fill="var(--ds-svg-text)"
            fontSize="10"
            fontWeight="600"
            fontFamily="var(--font-sans)"
          >
            {activeTrack.id === 'optimization'
              ? 'FactoryMind UI'
              : activeTrack.id === 'prognostics'
                ? 'Cost-Aware RUL'
                : 'Carbon Bounds'}
          </text>
          <text
            x="304"
            y="60"
            fill="var(--ds-svg-subtext)"
            fontSize="8.5"
            fontFamily="var(--font-mono)"
          >
            Decision Ready
          </text>
        </svg>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800/80 pt-2.5 text-xs">
          <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
            {activeTrack.engine}
          </p>
          <Link
            to={activeTrack.route}
            className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-blue-700 dark:text-cyan-300 transition-colors hover:text-cyan-700 dark:hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px]"
          >
            <span>{activeTrack.routeLabel}</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
