import { useState } from 'react';
import {
  Activity,
  Cpu,
  Eye,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import { resolveLiveDemoScreenshot } from '../../utils/projectMedia';

interface FeaturedProjectVisualProps {
  projectId: 'factorymind' | 'tikatrack' | 'forgemind-ai';
  title: string;
  previewAlt: string;
}

type FactoryFocusId = 'des' | 'forecast' | 'mrp';
type ForgeFocusId = 'conformal' | 'surrogates' | 'policy';
type TikaFocusId = 'schedule' | 'passport' | 'coldchain';

const FACTORY_MODES: Array<{
  id: FactoryFocusId;
  label: string;
  metric: string;
  detail: string;
}> = [
  {
    id: 'des',
    label: 'DES Line & OEE',
    metric: 'L = λW · 3 Stations · Finite Buffers',
    detail:
      'Binary min-heap priority queue models blocking/starvation & MTBF/MTTR failures across workstations.',
  },
  {
    id: 'forecast',
    label: '12-Model CV & EOQ',
    metric: '17 SKUs · $82,828 Demo Stock · 95% CI',
    detail:
      'Rolling-origin forecast CV (Croston, SBA, Holt-Winters) drives OLS-detrended ROP & Smart Alerts.',
  },
  {
    id: 'mrp',
    label: 'MRP & 5 Solvers',
    metric: '5 BOMs · RPW / LCR / Branch & Bound',
    detail:
      'Low-level BOM explosion paired with 5 assembly line-balancing solvers & Three.js 3D Plant Twin.',
  },
];

const TIKATRACK_MODES: Array<{
  id: TikaFocusId;
  label: string;
  metric: string;
  detail: string;
}> = [
  {
    id: 'schedule',
    label: 'EPI & WHO Growth',
    metric: '90 Vaccines · 196 Doses · 16 Life Stages',
    detail:
      'Bilingual English/বাংলা VaccinationEvent ledger pinned onto WHO 0–60 mo growth & 5–19 yr BMI curves.',
  },
  {
    id: 'passport',
    label: 'ECDSA QR & RAG',
    metric: 'TIKAPASS3 P-256 · Offline BM25 TikaBot',
    detail:
      'Web Crypto ECDSA & HMAC offline QR passports verified via jsQR alongside cited BM25 symptom triage.',
  },
  {
    id: 'coldchain',
    label: '64 Districts & 3D PQS',
    metric: '175 Verified Centres · +2°C–+8°C 3D Lab',
    detail:
      'Interactive 8-division Bangladesh locator map and Three.js WHO PQS cold-chain VVM excursion explorer.',
  },
];

const FORGEMIND_MODES: Array<{
  id: ForgeFocusId;
  label: string;
  metric: string;
  detail: string;
}> = [
  {
    id: 'conformal',
    label: 'Conformal [L, U]',
    metric: '48 Units/Subset · 45/20/15/20% Disjoint Splits',
    detail:
      'Calibrates finite-sample split conformal residual quantiles q̂ globally & across RUL horizon bins [0–30, 31–60, 61–90, 91+].',
  },
  {
    id: 'surrogates',
    label: '4 TS Surrogates',
    metric: 'Ridge · Quantile RF · HistGBDT (28) · Seq ELM (w=30)',
    detail:
      'Runs 12-iteration fit-only k-means regime scaling (OS1–OS3) and scores surrogates on MAE, RMSE, PHM08 & policy A/B delta.',
  },
  {
    id: 'policy',
    label: '5 Policies & 3D',
    metric: 'Cp vs. Cf Episode Replay · 350x Bootstrap · D3 3D Surface',
    detail:
      'Compares Run-to-Failure, Fixed, Threshold, Risk-Aware Lower-Bound, and Oracle schedules across rotatable D3 cost basins.',
  },
];

export function FeaturedProjectVisual({
  projectId,
  title,
  previewAlt,
}: FeaturedProjectVisualProps) {
  const [viewMode, setViewMode] = useState<'schematic' | 'screenshot'>('schematic');
  const [factoryFocus, setFactoryFocus] = useState<FactoryFocusId>('des');
  const [forgeFocus, setForgeFocus] = useState<ForgeFocusId>('conformal');
  const [tikaFocus, setTikaFocus] = useState<TikaFocusId>('schedule');
  const [imgFailed, setImgFailed] = useState(false);
  const { shouldReduceMotion } = useMotionPreference();

  const liveScreenshot = resolveLiveDemoScreenshot(projectId);

  if (projectId === 'factorymind') {
    const activeMode =
      FACTORY_MODES.find((m) => m.id === factoryFocus) ?? FACTORY_MODES[0];

    return (
      <div className="group/vis relative overflow-hidden rounded-[14px] border border-emerald-500/30 bg-[#060d12] text-slate-100 shadow-lg">
        {/* Subtle blueprint texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(16,185,129,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.14) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Top Header */}
        <div className="relative flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 bg-[#04090d]/90 px-4 py-2.5">
          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-300">
            <Cpu className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            <span>Operations Engine · TS + Three.js</span>
          </div>

          <div
            role="group"
            aria-label="FactoryMind preview mode"
            className="inline-flex rounded-[8px] border border-emerald-500/25 bg-[#0a141c] p-0.5"
          >
            <button
              type="button"
              aria-pressed={viewMode === 'schematic'}
              onClick={() => setViewMode('schematic')}
              className={`inline-flex items-center gap-1 rounded-[6px] px-2.5 py-1 font-mono text-[10.5px] transition-colors cursor-pointer ${
                viewMode === 'schematic'
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="h-3 w-3" aria-hidden="true" />
              <span>Schematic</span>
            </button>
            <button
              type="button"
              aria-pressed={viewMode === 'screenshot'}
              onClick={() => setViewMode('screenshot')}
              className={`inline-flex items-center gap-1 rounded-[6px] px-2.5 py-1 font-mono text-[10.5px] transition-colors cursor-pointer ${
                viewMode === 'screenshot'
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="h-3 w-3" aria-hidden="true" />
              <span>Live UI</span>
            </button>
          </div>
        </div>

        {/* Visual Canvas */}
        {viewMode === 'screenshot' && liveScreenshot && !imgFailed ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#04080c]">
            <img
              src={liveScreenshot}
              alt={previewAlt}
              width={1280}
              height={800}
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover/vis:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover/vis:scale-100"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#04090d] via-[#04090d]/80 to-transparent px-4 py-2.5 font-mono text-[10.5px]">
              <span className="text-emerald-300">● Verified Live App Capture</span>
              <span className="text-slate-300">ibtasham.github.io/FactoryMind</span>
            </div>
          </div>
        ) : (
          <div className="relative p-3 sm:p-4 space-y-3">
            {/* Industrial Command Telemetry SVG */}
            <svg
              viewBox="0 0 640 272"
              role="img"
              aria-label={`Interactive technical diagram for ${title}: 17-SKU catalog flowing into MRP, 12-model forecast, 5 line-balancing solvers, SPC charts, binary-heap DES, and Three.js 3D twin`}
              className="w-full h-auto rounded-[10px] border border-emerald-500/20 bg-[#040a0e]"
            >
              <defs>
                <linearGradient id="fm-glow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.06" />
                </linearGradient>
                <marker
                  id="fm-arrow-em"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                </marker>
              </defs>

              {/* Soft ambient gradient behind center engine */}
              <ellipse cx="320" cy="136" rx="220" ry="96" fill="url(#fm-glow)" />

              {/* Animated connection conduits */}
              <path
                d="M 164 136 C 192 136, 195 62, 224 62"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.6"
                strokeOpacity={factoryFocus === 'forecast' ? '1' : '0.45'}
                className={shouldReduceMotion ? '' : 'animate-svg-flow'}
                markerEnd="url(#fm-arrow-em)"
              />
              <path
                d="M 164 136 L 224 136"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.8"
                strokeOpacity={factoryFocus === 'mrp' ? '1' : '0.5'}
                className={shouldReduceMotion ? '' : 'animate-svg-flow'}
                markerEnd="url(#fm-arrow-em)"
              />
              <path
                d="M 164 136 C 192 136, 195 210, 224 210"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1.8"
                strokeOpacity={factoryFocus === 'des' ? '1' : '0.5'}
                className={shouldReduceMotion ? '' : 'animate-svg-flow'}
                markerEnd="url(#fm-arrow-em)"
              />

              {/* Output conduits to 3D Twin & Decision Lab */}
              <path
                d="M 418 62 C 446 62, 446 136, 474 136"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeOpacity="0.65"
                className={shouldReduceMotion ? '' : 'animate-svg-flow-slow'}
                markerEnd="url(#fm-arrow-em)"
              />
              <path
                d="M 418 136 L 474 136"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeOpacity="0.7"
                className={shouldReduceMotion ? '' : 'animate-svg-flow-slow'}
                markerEnd="url(#fm-arrow-em)"
              />
              <path
                d="M 418 210 C 446 210, 446 136, 474 136"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1.5"
                strokeOpacity="0.8"
                className={shouldReduceMotion ? '' : 'animate-svg-flow'}
                markerEnd="url(#fm-arrow-em)"
              />

              {/* Left Node: Plant Store */}
              <rect
                x="14"
                y="62"
                width="144"
                height="148"
                rx="10"
                fill="#09151d"
                stroke="#10b981"
                strokeOpacity="0.45"
                strokeWidth="1.4"
              />
              <text x="26" y="88" fill="#34d399" fontSize="9.5" fontFamily="monospace">
                Seeded Catalog
              </text>
              <text x="26" y="110" fill="#f8fafc" fontSize="13.5" fontWeight="700" fontFamily="sans-serif">
                17 Plant SKUs
              </text>
              <text x="26" y="132" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                • 5 Multi-Level BOMs
              </text>
              <text x="26" y="150" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                • 34 Ledger Moves
              </text>
              <text x="26" y="168" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                • $82,828 Demo Stock
              </text>
              <text x="26" y="190" fill="#22d3ee" fontSize="9.5" fontFamily="monospace">
                + CSV/JSON Import
              </text>

              {/* Center Interactive Engine Stack */}
              <g
                onClick={() => setFactoryFocus('forecast')}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x="218"
                  y="32"
                  width="206"
                  height="58"
                  rx="8"
                  fill={factoryFocus === 'forecast' ? '#0f2724' : '#09151d'}
                  stroke={factoryFocus === 'forecast' ? '#34d399' : '#1e3a3a'}
                  strokeWidth={factoryFocus === 'forecast' ? '2' : '1.2'}
                />
                <text x="232" y="54" fill="#f8fafc" fontSize="12" fontWeight="600" fontFamily="sans-serif">
                  EOQ / EPQ &amp; 12-Model CV
                </text>
                <text x="232" y="73" fill="#6ee7b7" fontSize="9.5" fontFamily="monospace">
                  OLS ROP · Croston · Holt-Winters
                </text>
              </g>

              <g
                onClick={() => setFactoryFocus('mrp')}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x="218"
                  y="107"
                  width="206"
                  height="58"
                  rx="8"
                  fill={factoryFocus === 'mrp' ? '#0f2724' : '#09151d'}
                  stroke={factoryFocus === 'mrp' ? '#34d399' : '#1e3a3a'}
                  strokeWidth={factoryFocus === 'mrp' ? '2' : '1.2'}
                />
                <text x="232" y="129" fill="#f8fafc" fontSize="12" fontWeight="600" fontFamily="sans-serif">
                  MRP &amp; 5-Solver Balance
                </text>
                <text x="232" y="148" fill="#6ee7b7" fontSize="9.5" fontFamily="monospace">
                  L4L/POQ · RPW · Branch &amp; Bound
                </text>
              </g>

              <g
                onClick={() => setFactoryFocus('des')}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x="218"
                  y="182"
                  width="206"
                  height="58"
                  rx="8"
                  fill={factoryFocus === 'des' ? '#0d222e' : '#09151d'}
                  stroke={factoryFocus === 'des' ? '#22d3ee' : '#1e3a3a'}
                  strokeWidth={factoryFocus === 'des' ? '2' : '1.2'}
                />
                <text x="232" y="204" fill="#f8fafc" fontSize="12" fontWeight="600" fontFamily="sans-serif">
                  DES Workstations &amp; SPC
                </text>
                <text x="232" y="223" fill="#67e8f9" fontSize="9.5" fontFamily="monospace">
                  Heap DES · EWMA/CUSUM · M/M/c
                </text>
              </g>

              {/* Right Node: 3D Twin & Decision Lab */}
              <rect
                x="480"
                y="46"
                width="146"
                height="180"
                rx="10"
                fill="#09151d"
                stroke="#22d3ee"
                strokeOpacity="0.5"
                strokeWidth="1.4"
              />
              <text x="492" y="72" fill="#22d3ee" fontSize="9.5" fontFamily="monospace">
                Output Workbench
              </text>
              <text x="492" y="94" fill="#f8fafc" fontSize="13" fontWeight="700" fontFamily="sans-serif">
                3D Twin &amp; Lab
              </text>

              {/* Mini 3D isometric wireframe cube emblem */}
              <g transform="translate(553, 126)">
                <polygon
                  points="0,-18 18,-8 0,2 -18,-8"
                  fill="#10b981"
                  fillOpacity="0.24"
                  stroke="#34d399"
                  strokeWidth="1.2"
                />
                <polygon
                  points="-18,-8 0,2 0,20 -18,10"
                  fill="#06b6d4"
                  fillOpacity="0.18"
                  stroke="#22d3ee"
                  strokeWidth="1.2"
                />
                <polygon
                  points="18,-8 0,2 0,20 18,10"
                  fill="#0f172a"
                  fillOpacity="0.7"
                  stroke="#34d399"
                  strokeWidth="1.2"
                />
              </g>

              <text x="492" y="172" fill="#cbd5e1" fontSize="9.5" fontFamily="monospace">
                ✓ Approval Gates
              </text>
              <text x="492" y="190" fill="#cbd5e1" fontSize="9.5" fontFamily="monospace">
                ✓ jsPDF &amp; CSV Export
              </text>
              <text x="492" y="208" fill="#34d399" fontSize="9.5" fontFamily="monospace">
                ✓ 12 tsx Test Suites
              </text>
            </svg>

            {/* Interactive Subsystem Switcher */}
            <div className="space-y-2">
              <div
                role="group"
                aria-label="Inspect FactoryMind visual subsystem"
                className="flex flex-wrap gap-1.5"
              >
                {FACTORY_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    aria-pressed={factoryFocus === mode.id}
                    onClick={() => setFactoryFocus(mode.id)}
                    className={`rounded-[8px] border px-2.5 py-1 font-mono text-[10.5px] transition-colors cursor-pointer ${
                      factoryFocus === mode.id
                        ? 'border-emerald-400/70 bg-emerald-500/15 text-emerald-200'
                        : 'border-emerald-500/20 bg-[#09151d] text-slate-300 hover:border-emerald-500/45'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              <div className="rounded-[8px] border border-emerald-500/20 bg-[#040a0e] px-3 py-2 text-xs">
                <p className="font-mono text-[10.5px] text-emerald-300">{activeMode.metric}</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-300">
                  {activeMode.detail}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (projectId === 'forgemind-ai') {
    const activeForgeMode =
      FORGEMIND_MODES.find((m) => m.id === forgeFocus) ?? FORGEMIND_MODES[0];

    return (
      <div className="group/vis relative overflow-hidden rounded-[14px] border border-cyan-500/35 bg-[#050b16] text-slate-100 shadow-lg">
        {/* Blueprint micro-grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(34,211,238,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.14) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Top Bar */}
        <div className="relative flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 bg-[#040812]/90 px-4 py-2.5">
          <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-300">
            <Activity className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
            <span>Prognostics Workbench · D3 3D + Conformal</span>
          </div>

          <div
            role="group"
            aria-label="ForgeMind AI preview mode"
            className="inline-flex rounded-[8px] border border-cyan-500/25 bg-[#091326] p-0.5"
          >
            <button
              type="button"
              aria-pressed={viewMode === 'schematic'}
              onClick={() => setViewMode('schematic')}
              className={`inline-flex items-center gap-1 rounded-[6px] px-2.5 py-1 font-mono text-[10.5px] transition-colors cursor-pointer ${
                viewMode === 'schematic'
                  ? 'bg-cyan-400 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="h-3 w-3" aria-hidden="true" />
              <span>Pipeline</span>
            </button>
            <button
              type="button"
              aria-pressed={viewMode === 'screenshot'}
              onClick={() => setViewMode('screenshot')}
              className={`inline-flex items-center gap-1 rounded-[6px] px-2.5 py-1 font-mono text-[10.5px] transition-colors cursor-pointer ${
                viewMode === 'screenshot'
                  ? 'bg-cyan-400 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="h-3 w-3" aria-hidden="true" />
              <span>Live UI</span>
            </button>
          </div>
        </div>

        {viewMode === 'screenshot' && liveScreenshot && !imgFailed ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#040812]">
            <img
              src={liveScreenshot}
              alt={previewAlt}
              width={1280}
              height={800}
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover/vis:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover/vis:scale-100"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#040812] via-[#040812]/80 to-transparent px-4 py-2.5 font-mono text-[10.5px]">
              <span className="text-cyan-300">● Verified Vercel Deployment</span>
              <span className="text-slate-300">FD002 · Histogram GBDT</span>
            </div>
          </div>
        ) : (
          <div className="relative p-3 sm:p-4 space-y-3">
            {/* Conformal Prognostics & Policy SVG Schematic */}
            <svg
              viewBox="0 0 640 272"
              role="img"
              aria-label={`Interactive prognostics diagram for ${title}: synthetic FD001-FD004 turbofan telemetry through 4 TS surrogates, RUL-binned conformal bands, and 5-policy D3 3D cost optimization`}
              className="w-full h-auto rounded-[10px] border border-cyan-500/20 bg-[#040914]"
            >
              <defs>
                <linearGradient id="fg-glow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.08" />
                </linearGradient>
                <marker
                  id="fg-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#22d3ee" />
                </marker>
              </defs>

              <ellipse cx="320" cy="136" rx="225" ry="98" fill="url(#fg-glow)" />

              {/* Flow Conduits */}
              <path
                d="M 164 136 C 192 136, 195 62, 224 62"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1.6"
                strokeOpacity={forgeFocus === 'surrogates' ? '1' : '0.45'}
                className={shouldReduceMotion ? '' : 'animate-svg-flow'}
                markerEnd="url(#fg-arrow)"
              />
              <path
                d="M 164 136 L 224 136"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.8"
                strokeOpacity={forgeFocus === 'conformal' ? '1' : '0.55'}
                className={shouldReduceMotion ? '' : 'animate-svg-flow'}
                markerEnd="url(#fg-arrow)"
              />
              <path
                d="M 164 136 C 192 136, 195 210, 224 210"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.8"
                strokeOpacity={forgeFocus === 'policy' ? '1' : '0.5'}
                className={shouldReduceMotion ? '' : 'animate-svg-flow'}
                markerEnd="url(#fg-arrow)"
              />

              <path
                d="M 418 62 C 446 62, 446 136, 474 136"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1.5"
                strokeOpacity="0.68"
                className={shouldReduceMotion ? '' : 'animate-svg-flow-slow'}
                markerEnd="url(#fg-arrow)"
              />
              <path
                d="M 418 136 L 474 136"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.6"
                strokeOpacity="0.75"
                className={shouldReduceMotion ? '' : 'animate-svg-flow'}
                markerEnd="url(#fg-arrow)"
              />
              <path
                d="M 418 210 C 446 210, 446 136, 474 136"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.6"
                strokeOpacity="0.82"
                className={shouldReduceMotion ? '' : 'animate-svg-flow'}
                markerEnd="url(#fg-arrow)"
              />

              {/* Left Node: Synthetic Fleet Cohort */}
              <rect
                x="14"
                y="56"
                width="144"
                height="160"
                rx="10"
                fill="#091528"
                stroke="#22d3ee"
                strokeOpacity="0.45"
                strokeWidth="1.4"
              />
              <text x="26" y="82" fill="#22d3ee" fontSize="9.5" fontFamily="monospace">
                Synthetic Cohorts
              </text>
              <text x="26" y="104" fill="#f8fafc" fontSize="13.5" fontWeight="700" fontFamily="sans-serif">
                FD001 – FD004
              </text>
              <text x="26" y="126" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                • 48 Units / Subset
              </text>
              <text x="26" y="144" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                • 21 Sensors (s1–s21)
              </text>
              <text x="26" y="162" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                • OS1–OS3 k-Means
              </text>
              <text x="26" y="182" fill="#fbbf24" fontSize="9.5" fontFamily="monospace">
                45 / 20 / 15 / 20%
              </text>
              <text x="26" y="200" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                Zero Unit Leakage
              </text>

              {/* Center Interactive Engine Stack */}
              <g onClick={() => setForgeFocus('surrogates')} style={{ cursor: 'pointer' }}>
                <rect
                  x="218"
                  y="32"
                  width="206"
                  height="58"
                  rx="8"
                  fill={forgeFocus === 'surrogates' ? '#0e253b' : '#081326'}
                  stroke={forgeFocus === 'surrogates' ? '#22d3ee' : '#1e3a5f'}
                  strokeWidth={forgeFocus === 'surrogates' ? '2' : '1.2'}
                />
                <text x="232" y="54" fill="#f8fafc" fontSize="12" fontWeight="600" fontFamily="sans-serif">
                  4 TS RUL Surrogates
                </text>
                <text x="232" y="73" fill="#67e8f9" fontSize="9.5" fontFamily="monospace">
                  Ridge · RF · HistGBDT · Seq ELM
                </text>
              </g>

              <g onClick={() => setForgeFocus('conformal')} style={{ cursor: 'pointer' }}>
                <rect
                  x="218"
                  y="107"
                  width="206"
                  height="58"
                  rx="8"
                  fill={forgeFocus === 'conformal' ? '#0e253b' : '#081326'}
                  stroke={forgeFocus === 'conformal' ? '#38bdf8' : '#1e3a5f'}
                  strokeWidth={forgeFocus === 'conformal' ? '2' : '1.2'}
                />
                <text x="232" y="129" fill="#f8fafc" fontSize="12" fontWeight="600" fontFamily="sans-serif">
                  Split Conformal [L, U]
                </text>
                <text x="232" y="148" fill="#7dd3fc" fontSize="9.5" fontFamily="monospace">
                  RUL-Binned q̂ · (1 - α) Coverage
                </text>
              </g>

              <g onClick={() => setForgeFocus('policy')} style={{ cursor: 'pointer' }}>
                <rect
                  x="218"
                  y="182"
                  width="206"
                  height="58"
                  rx="8"
                  fill={forgeFocus === 'policy' ? '#261e0c' : '#081326'}
                  stroke={forgeFocus === 'policy' ? '#f59e0b' : '#1e3a5f'}
                  strokeWidth={forgeFocus === 'policy' ? '2' : '1.2'}
                />
                <text x="232" y="204" fill="#f8fafc" fontSize="12" fontWeight="600" fontFamily="sans-serif">
                  5-Policy Episode Replay
                </text>
                <text x="232" y="223" fill="#fcd34d" fontSize="9.5" fontFamily="monospace">
                  ŷ - q̂_bin &lt;= τ · Cp vs. Cf
                </text>
              </g>

              {/* Right Node: D3 Surface & Audit Outputs */}
              <rect
                x="480"
                y="46"
                width="146"
                height="180"
                rx="10"
                fill="#091528"
                stroke="#f59e0b"
                strokeOpacity="0.52"
                strokeWidth="1.4"
              />
              <text x="492" y="72" fill="#fbbf24" fontSize="9.5" fontFamily="monospace">
                Decision Workbench
              </text>
              <text x="492" y="94" fill="#f8fafc" fontSize="13" fontWeight="700" fontFamily="sans-serif">
                10 Live Modules
              </text>

              {/* Mini conformal degradation curve + 3D cost curve motif */}
              <path
                d="M 494 148 Q 532 138 558 118 T 612 108"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1.8"
              />
              <path
                d="M 494 156 Q 532 150 558 134 T 612 128"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.4"
                strokeDasharray="3 3"
              />
              <circle cx="558" cy="118" r="3.5" fill="#22d3ee" />
              <circle cx="558" cy="134" r="3.5" fill="#f59e0b" />

              <text x="492" y="174" fill="#cbd5e1" fontSize="9.5" fontFamily="monospace">
                ✓ D3 3D Cost Surface
              </text>
              <text x="492" y="192" fill="#cbd5e1" fontSize="9.5" fontFamily="monospace">
                ✓ 3-Page jsPDF Report
              </text>
              <text x="492" y="210" fill="#22d3ee" fontSize="9.5" fontFamily="monospace">
                ✓ 32 tsx Engine Tests
              </text>
            </svg>

            {/* Interactive Subsystem Switcher */}
            <div className="space-y-2">
              <div
                role="group"
                aria-label="Inspect ForgeMind AI visual subsystem"
                className="flex flex-wrap gap-1.5"
              >
                {FORGEMIND_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    aria-pressed={forgeFocus === mode.id}
                    onClick={() => setForgeFocus(mode.id)}
                    className={`rounded-[8px] border px-2.5 py-1 font-mono text-[10.5px] transition-colors cursor-pointer ${
                      forgeFocus === mode.id
                        ? 'border-cyan-400/75 bg-cyan-500/15 text-cyan-200'
                        : 'border-cyan-500/20 bg-[#081326] text-slate-300 hover:border-cyan-400/45'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              <div className="rounded-[8px] border border-cyan-500/20 bg-[#040914] px-3 py-2 text-xs">
                <p className="font-mono text-[10.5px] text-amber-300">{activeForgeMode.metric}</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-300">
                  {activeForgeMode.detail}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Distinct TikaTrack Visual Identity — Clinical Bilingual Public-Health PWA & Cryptographic Verification
  const activeTikaMode =
    TIKATRACK_MODES.find((m) => m.id === tikaFocus) ?? TIKATRACK_MODES[0];

  return (
    <div className="group/vis relative overflow-hidden rounded-[14px] border border-teal-600/25 dark:border-emerald-400/25 bg-gradient-to-br from-[#e6ede0] via-[#f4ebe0] to-[#e1ece7] dark:from-[#041413] dark:via-[#071c1b] dark:to-[#051218] text-wood-ink dark:text-slate-100 shadow-lg">
      {/* Top Bar */}
      <div className="relative flex flex-wrap items-center justify-between gap-2 border-b border-teal-600/15 dark:border-emerald-400/20 bg-[#f4ebe0]/85 dark:bg-[#041010]/85 px-4 py-2.5 backdrop-blur-sm">
        <div className="flex items-center gap-2 font-mono text-[11px] text-teal-800 dark:text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-700 dark:text-emerald-400" aria-hidden="true" />
          <span>Clinical Immunization PWA · EN / বাংলা</span>
        </div>

        <div
          role="group"
          aria-label="TikaTrack preview mode"
          className="inline-flex rounded-[8px] border border-teal-600/20 dark:border-emerald-400/25 bg-[#dfece2]/90 dark:bg-[#061817] p-0.5"
        >
          <button
            type="button"
            aria-pressed={viewMode === 'schematic'}
            onClick={() => setViewMode('schematic')}
            className={`inline-flex items-center gap-1 rounded-[6px] px-2.5 py-1 font-mono text-[10.5px] transition-colors cursor-pointer ${
              viewMode === 'schematic'
                ? 'bg-teal-700 text-white dark:bg-emerald-400 dark:text-slate-950 font-semibold'
                : 'text-wood-walnut dark:text-slate-300 hover:text-wood-ink dark:hover:text-white'
            }`}
          >
            <Activity className="h-3 w-3" aria-hidden="true" />
            <span>Clinical Flow</span>
          </button>
          <button
            type="button"
            aria-pressed={viewMode === 'screenshot'}
            onClick={() => setViewMode('screenshot')}
            className={`inline-flex items-center gap-1 rounded-[6px] px-2.5 py-1 font-mono text-[10.5px] transition-colors cursor-pointer ${
              viewMode === 'screenshot'
                ? 'bg-teal-700 text-white dark:bg-emerald-400 dark:text-slate-950 font-semibold'
                : 'text-wood-walnut dark:text-slate-300 hover:text-wood-ink dark:hover:text-white'
            }`}
          >
            <Eye className="h-3 w-3" aria-hidden="true" />
            <span>Live UI</span>
          </button>
        </div>
      </div>

      {/* Visual Canvas */}
      {viewMode === 'screenshot' && liveScreenshot && !imgFailed ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f4ebe0] dark:bg-[#041010]">
          <img
            src={liveScreenshot}
            alt={previewAlt}
            width={1280}
            height={800}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover/vis:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover/vis:scale-100"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950/90 via-slate-950/65 to-transparent px-4 py-2.5 font-mono text-[10.5px]">
            <span className="text-emerald-300">● Verified Live PWA Capture</span>
            <span className="text-slate-200">ibtasham.github.io/TikaTrack</span>
          </div>
        </div>
      ) : (
        <div className="relative p-3 sm:p-4 space-y-3">
          {/* Clinical Bilingual Architecture & Cryptographic SVG */}
          <svg
            viewBox="0 0 640 272"
            role="img"
            aria-label={`Interactive clinical system visual for ${title}: 90 vaccines across 16 life stages, WHO growth curves, 175 verified Bangladesh centres, and ECDSA P-256 QR passport`}
            className="w-full h-auto rounded-[10px] border border-teal-600/20 dark:border-emerald-400/20 bg-[#f8f1e7] dark:bg-[#051313]"
          >
            <defs>
              <linearGradient id="tt-band" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.06" />
              </linearGradient>
              <marker
                id="tt-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#0d9488" />
              </marker>
            </defs>

            <rect x="0" y="0" width="640" height="44" fill="url(#tt-band)" />
            <text x="18" y="26" fill="var(--ds-svg-text)" fontSize="11" fontFamily="monospace" fontWeight="600">
              Offline Local Vault (localStorage + PBKDF2-SHA256) · Zero Signup Barrier
            </text>

            {/* Pulse wave / WHO Growth curve connector */}
            <path
              d="M 196 150 L 244 150"
              fill="none"
              stroke="#0d9488"
              strokeWidth="1.8"
              className={shouldReduceMotion ? '' : 'animate-svg-flow'}
              markerEnd="url(#tt-arrow)"
            />
            <path
              d="M 416 150 L 460 150"
              fill="none"
              stroke="#0d9488"
              strokeWidth="1.8"
              className={shouldReduceMotion ? '' : 'animate-svg-flow'}
              markerEnd="url(#tt-arrow)"
            />

            {/* Card 1: Bilingual Lifespan Schedule */}
            <g onClick={() => setTikaFocus('schedule')} style={{ cursor: 'pointer' }}>
              <rect
                x="14"
                y="60"
                width="184"
                height="188"
                rx="12"
                fill="var(--ds-svg-node)"
                stroke={tikaFocus === 'schedule' ? '#0d9488' : 'var(--ds-svg-border-muted)'}
                strokeWidth={tikaFocus === 'schedule' ? '2.2' : '1.3'}
              />
              <text x="28" y="86" fill="#0d9488" fontSize="9.5" fontFamily="monospace" fontWeight="600">
                01 · Lifespan Ledger
              </text>
              <text x="28" y="108" fill="var(--ds-svg-text)" fontSize="13.5" fontWeight="700" fontFamily="sans-serif">
                90 Vaccines Tracked
              </text>
              <text x="28" y="126" fill="var(--ds-svg-subtext)" fontSize="10.5" fontFamily="sans-serif">
                196 Doses · 16 Life Stages
              </text>
              {/* Smooth WHO Growth Percentile Curve Illustration */}
              <path
                d="M 28 202 C 62 194, 100 170, 178 146"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.2"
                className={shouldReduceMotion ? '' : 'animate-svg-flow-slow'}
              />
              <path
                d="M 28 214 C 64 208, 102 190, 178 174"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="1.4"
                strokeDasharray="4 4"
              />
              <circle cx="88" cy="180" r="4" fill="#10b981" />
              <circle cx="136" cy="159" r="4" fill="#0d9488" />
              <text x="28" y="234" fill="#0d9488" fontSize="9.2" fontFamily="monospace">
                WHO 0–60m &amp; 5–19y BMI
              </text>
            </g>

            {/* Card 2: Signed QR Passport & BM25 RAG */}
            <g onClick={() => setTikaFocus('passport')} style={{ cursor: 'pointer' }}>
              <rect
                x="238"
                y="60"
                width="178"
                height="188"
                rx="12"
                fill="var(--ds-svg-node)"
                stroke={tikaFocus === 'passport' ? '#0d9488' : 'var(--ds-svg-border-muted)'}
                strokeWidth={tikaFocus === 'passport' ? '2.2' : '1.3'}
              />
              <text x="252" y="86" fill="#0d9488" fontSize="9.5" fontFamily="monospace" fontWeight="600">
                02 · Crypto QR &amp; Bot
              </text>
              <text x="252" y="108" fill="var(--ds-svg-text)" fontSize="13.5" fontWeight="700" fontFamily="sans-serif">
                ECDSA P-256 QR
              </text>
              {/* Vector QR Matrix Motif */}
              <g transform="translate(254, 122)">
                <rect x="0" y="0" width="52" height="52" rx="6" fill="none" stroke="#0d9488" strokeWidth="1.4" />
                <rect x="6" y="6" width="12" height="12" rx="2" fill="#0d9488" />
                <rect x="34" y="6" width="12" height="12" rx="2" fill="#0d9488" />
                <rect x="6" y="34" width="12" height="12" rx="2" fill="#0d9488" />
                <rect x="24" y="24" width="8" height="8" fill="#10b981" />
                <rect x="36" y="32" width="10" height="14" fill="#0ea5e9" fillOpacity="0.85" />
                <circle
                  cx="42"
                  cy="12"
                  r="4"
                  fill="#10b981"
                  className={shouldReduceMotion ? '' : 'animate-svg-node-pulse'}
                />
              </g>
              <text x="316" y="140" fill="var(--ds-svg-text)" fontSize="10.5" fontWeight="600" fontFamily="monospace">
                TIKAPASS3
              </text>
              <text x="316" y="156" fill="var(--ds-svg-subtext)" fontSize="9.5" fontFamily="sans-serif">
                + HMAC QR
              </text>
              <text x="316" y="171" fill="var(--ds-svg-subtext)" fontSize="9.5" fontFamily="sans-serif">
                jsQR Verify
              </text>
              <text x="252" y="205" fill="var(--ds-svg-text)" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
                TikaBot BM25 RAG
              </text>
              <text x="252" y="224" fill="var(--ds-svg-subtext)" fontSize="9.2" fontFamily="monospace">
                EN/বাংলা · Cited Triage
              </text>
            </g>

            {/* Card 3: 64-District Centres & Cold-Chain 3D */}
            <g onClick={() => setTikaFocus('coldchain')} style={{ cursor: 'pointer' }}>
              <rect
                x="456"
                y="60"
                width="170"
                height="188"
                rx="12"
                fill="var(--ds-svg-node)"
                stroke={tikaFocus === 'coldchain' ? '#0d9488' : 'var(--ds-svg-border-muted)'}
                strokeWidth={tikaFocus === 'coldchain' ? '2.2' : '1.3'}
              />
              <text x="470" y="86" fill="#0d9488" fontSize="9.5" fontFamily="monospace" fontWeight="600">
                03 · Map &amp; 3D Lab
              </text>
              <text x="470" y="108" fill="var(--ds-svg-text)" fontSize="13.5" fontWeight="700" fontFamily="sans-serif">
                175 Centres Map
              </text>
              <text x="470" y="126" fill="var(--ds-svg-subtext)" fontSize="10.5" fontFamily="sans-serif">
                All 64 Districts · 8 Div.
              </text>

              {/* District Node Network Motif */}
              <line x1="484" y1="158" x2="538" y2="146" stroke="#10b981" strokeOpacity="0.5" strokeWidth="1.2" />
              <line x1="538" y1="146" x2="594" y2="162" stroke="#0ea5e9" strokeOpacity="0.5" strokeWidth="1.2" />
              <line x1="538" y1="146" x2="528" y2="184" stroke="#10b981" strokeOpacity="0.5" strokeWidth="1.2" />
              <circle cx="484" cy="158" r="4.5" fill="#10b981" />
              <circle cx="538" cy="146" r="5.5" fill="#0d9488" className={shouldReduceMotion ? '' : 'animate-svg-node-pulse'} />
              <circle cx="594" cy="162" r="4.5" fill="#0ea5e9" />
              <circle cx="528" cy="184" r="4" fill="#10b981" />

              <text x="470" y="206" fill="var(--ds-svg-text)" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
                Three.js Cold-Chain
              </text>
              <text x="470" y="224" fill="#0d9488" fontSize="9.2" fontFamily="monospace">
                WHO PQS +2°C to +8°C
              </text>
            </g>
          </svg>

          {/* Interactive Clinical Subsystem Bar */}
          <div className="space-y-2">
            <div
              role="group"
              aria-label="Inspect TikaTrack clinical subsystem"
              className="flex flex-wrap gap-1.5"
            >
              {TIKATRACK_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  aria-pressed={tikaFocus === mode.id}
                  onClick={() => setTikaFocus(mode.id)}
                  className={`rounded-[8px] border px-2.5 py-1 font-mono text-[10.5px] transition-colors cursor-pointer ${
                    tikaFocus === mode.id
                      ? 'border-teal-700/70 bg-teal-700 text-white dark:border-emerald-400/70 dark:bg-emerald-400/20 dark:text-emerald-200'
                      : 'border-teal-600/20 dark:border-emerald-400/20 bg-[#f8f1e7] dark:bg-[#051313] text-wood-walnut dark:text-slate-300 hover:border-teal-600/45'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <div className="rounded-[8px] border border-teal-600/20 dark:border-emerald-400/20 bg-[#f8f1e7] dark:bg-[#051313] px-3 py-2 text-xs">
              <p className="font-mono text-[10.5px] text-teal-800 dark:text-emerald-300 font-semibold">
                {activeTikaMode.metric}
              </p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-wood-walnut dark:text-slate-300">
                {activeTikaMode.detail}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
