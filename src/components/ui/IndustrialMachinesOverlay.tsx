import { useMemo } from 'react';

interface IndustrialMachinesOverlayProps {
  variant?: 'hero' | 'banner';
}

function buildSpurGearPath(
  cx: number,
  cy: number,
  outerRadius: number,
  rootRadius: number,
  teeth: number,
): string {
  const step = (Math.PI * 2) / teeth;
  const segments: string[] = [];

  for (let i = 0; i < teeth; i += 1) {
    const base = i * step;
    const a0 = base;
    const a1 = base + step * 0.14;
    const a2 = base + step * 0.28;
    const a3 = base + step * 0.52;
    const a4 = base + step * 0.66;

    const p0x = cx + rootRadius * Math.cos(a0);
    const p0y = cy + rootRadius * Math.sin(a0);
    const p1x = cx + rootRadius * Math.cos(a1);
    const p1y = cy + rootRadius * Math.sin(a1);
    const p2x = cx + outerRadius * Math.cos(a2);
    const p2y = cy + outerRadius * Math.sin(a2);
    const p3x = cx + outerRadius * Math.cos(a3);
    const p3y = cy + outerRadius * Math.sin(a3);
    const p4x = cx + rootRadius * Math.cos(a4);
    const p4y = cy + rootRadius * Math.sin(a4);

    if (i === 0) {
      segments.push(`M ${p0x.toFixed(1)} ${p0y.toFixed(1)}`);
    } else {
      segments.push(`L ${p0x.toFixed(1)} ${p0y.toFixed(1)}`);
    }
    segments.push(
      `L ${p1x.toFixed(1)} ${p1y.toFixed(1)}`,
      `L ${p2x.toFixed(1)} ${p2y.toFixed(1)}`,
      `L ${p3x.toFixed(1)} ${p3y.toFixed(1)}`,
      `L ${p4x.toFixed(1)} ${p4y.toFixed(1)}`,
    );
  }

  return `${segments.join(' ')} Z`;
}

export function IndustrialMachinesOverlay({
  variant = 'hero',
}: IndustrialMachinesOverlayProps) {
  const gearPaths = useMemo(() => {
    const bullGear = buildSpurGearPath(1220, 175, 92, 74, 18);
    const pinionGear = buildSpurGearPath(1338, 250, 56, 42, 11);
    const leftGear = buildSpurGearPath(84, 595, 68, 53, 14);
    const leftPinion = buildSpurGearPath(168, 650, 42, 31, 9);
    const bannerGear = buildSpurGearPath(1260, 128, 72, 57, 16);
    const bannerPinion = buildSpurGearPath(1348, 186, 42, 31, 9);

    return {
      bullGear,
      pinionGear,
      leftGear,
      leftPinion,
      bannerGear,
      bannerPinion,
    };
  }, []);

  if (variant === 'banner') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      >
        <svg
          viewBox="0 0 1440 260"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full opacity-[0.26] dark:opacity-[0.28]"
        >
          {/* Meshing Spur & Pinion Reduction Train (Right Field) */}
          <g className="text-[#4a3219] dark:text-cyan-400">
            <path
              d={gearPaths.bannerGear}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
            />
            <circle
              cx="1260"
              cy="128"
              r="34"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.05"
            />
            <circle
              cx="1260"
              cy="128"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d={gearPaths.bannerPinion}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle
              cx="1348"
              cy="186"
              r="11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.15"
            />
          </g>

          <g className="text-[#0e7490] dark:text-blue-400">
            <circle
              cx="1260"
              cy="128"
              r="64.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeDasharray="5 4"
            />
            <circle
              cx="1348"
              cy="186"
              r="36.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeDasharray="5 4"
            />
            <line
              x1="1155"
              y1="128"
              x2="1370"
              y2="128"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeDasharray="10 4 2 4"
            />
            <line
              x1="1260"
              y1="32"
              x2="1260"
              y2="232"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeDasharray="10 4 2 4"
            />
          </g>

          {/* CNC Tooling Silhouette & Machined Workpiece (Center-Right Field) */}
          <g className="text-[#4a3219] dark:text-cyan-400" transform="translate(880 28)">
            <rect
              x="44"
              y="0"
              width="76"
              height="30"
              rx="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.15"
            />
            <path
              d="M54 30 L58 64 L106 64 L110 30 M66 64 L66 102 L98 102 L98 64 M76 102 L76 146 L88 146 L88 102 M76 116 L88 124 M76 130 L88 138"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.15"
            />
            <path
              d="M12 184 L152 184 L152 204 L12 204 Z M36 184 L36 154 L128 154 L128 184 M60 154 L60 144 L104 144 L104 154"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.15"
            />
          </g>

          {/* Roller Conveyor & Totes (Bottom Left Edge) */}
          <g className="text-[#4a3219] dark:text-sky-400" transform="translate(36 164)">
            <rect
              x="0"
              y="30"
              width="280"
              height="24"
              rx="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
            />
            <circle cx="14" cy="42" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="96" cy="42" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="184" cy="42" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="266" cy="42" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
            <rect x="44" y="8" width="38" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
            <rect x="128" y="4" width="44" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      <svg
        viewBox="0 0 1440 820"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full opacity-[0.26] dark:opacity-[0.28]"
      >
        {/* 1. UPPER-CENTER-RIGHT: CNC Vertical Milling Spindle & Clamped Workpiece */}
        <g className="text-[#4a3219] dark:text-cyan-400" transform="translate(650 38)">
          <rect x="40" y="0" width="96" height="44" rx="4" fill="none" stroke="currentColor" strokeWidth="1.25" />
          <path
            d="M52 44 L56 84 L120 84 L124 44"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M68 84 L74 126 L102 126 L108 84 M80 126 L80 182 L96 182 L96 126 M80 140 L96 150 M80 156 L96 166"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M14 218 L162 218 L162 242 L14 242 Z M38 218 L38 186 L138 186 L138 218"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.15"
          />
          <line
            x1="88"
            y1="-14"
            x2="88"
            y2="258"
            stroke="currentColor"
            strokeWidth="0.85"
            strokeDasharray="10 4 2 4"
            className="text-[#0e7490] dark:text-blue-400"
          />
        </g>

        {/* 2. TOP-RIGHT: Meshing Spur & Helical Gear Train */}
        <g className="text-[#4a3219] dark:text-cyan-400">
          <g>
            <path d={gearPaths.bullGear} fill="none" stroke="currentColor" strokeWidth="1.35" />
            <circle cx="1220" cy="175" r="46" fill="none" stroke="currentColor" strokeWidth="1.1" />
            <circle cx="1220" cy="175" r="18" fill="none" stroke="currentColor" strokeWidth="1.25" />
            <rect x="1216" y="151" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1" />
            <line x1="1186" y1="175" x2="1202" y2="175" stroke="currentColor" strokeWidth="1" />
            <line x1="1238" y1="175" x2="1254" y2="175" stroke="currentColor" strokeWidth="1" />
            <line x1="1220" y1="141" x2="1220" y2="157" stroke="currentColor" strokeWidth="1" />
            <line x1="1220" y1="193" x2="1220" y2="209" stroke="currentColor" strokeWidth="1" />
          </g>

          <g>
            <path d={gearPaths.pinionGear} fill="none" stroke="currentColor" strokeWidth="1.25" />
            <circle cx="1338" cy="250" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="1338" cy="250" r="10" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </g>

          <g className="text-[#0e7490] dark:text-blue-400">
            <circle
              cx="1220"
              cy="175"
              r="83"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeDasharray="6 4"
            />
            <circle
              cx="1338"
              cy="250"
              r="49"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeDasharray="6 4"
            />
            <line x1="1100" y1="175" x2="1405" y2="175" stroke="currentColor" strokeWidth="0.8" strokeDasharray="10 4 2 4" />
            <line x1="1220" y1="60" x2="1220" y2="310" stroke="currentColor" strokeWidth="0.8" strokeDasharray="10 4 2 4" />
          </g>
        </g>

        {/* 3. BOTTOM-RIGHT: 6-Axis Articulated Industrial Robotic Arm & Conveyor Cell */}
        <g className="text-[#4a3219] dark:text-cyan-400" transform="translate(970 490)">
          <path
            d="M210 278 L350 278 L342 254 L218 254 Z M234 254 L234 228 L326 228 L326 254"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.35"
          />
          <circle cx="280" cy="204" r="24" fill="none" stroke="currentColor" strokeWidth="1.35" />
          <circle cx="280" cy="204" r="9" fill="none" stroke="currentColor" strokeWidth="1.15" />
          <path
            d="M262 192 L182 94 L212 78 L294 184"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <circle cx="192" cy="84" r="19" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="192" cy="84" r="7" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <path
            d="M178 72 L78 106 L84 128 L186 98"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <circle cx="72" cy="118" r="11" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M62 112 L34 112 L34 102 L48 102 M62 124 L34 124 L34 134 L48 134"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <rect x="18" y="106" width="16" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <path
            d="M42 186 A 210 210 0 0 1 286 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.95"
            strokeDasharray="6 5"
            className="text-[#0e7490] dark:text-blue-400"
          />
          <rect x="-250" y="232" width="410" height="32" rx="16" fill="none" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="-234" cy="248" r="9" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <circle cx="-138" cy="248" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="-42" cy="248" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="54" cy="248" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="144" cy="248" r="9" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <rect x="-200" y="198" width="54" height="34" rx="3" fill="none" stroke="currentColor" strokeWidth="1.15" />
          <rect x="-82" y="190" width="60" height="42" rx="3" fill="none" stroke="currentColor" strokeWidth="1.15" />
          <path d="M-98 232 L-98 158 L-6 158 L-6 232" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <rect x="34" y="202" width="48" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="1.15" />
        </g>

        {/* 4. LOWER-LEFT PERIMETER: Twin Spur Gears + Vernier Caliper */}
        <g className="text-[#4a3219] dark:text-cyan-400">
          <g>
            <path d={gearPaths.leftGear} fill="none" stroke="currentColor" strokeWidth="1.25" />
            <circle cx="84" cy="595" r="28" fill="none" stroke="currentColor" strokeWidth="1.05" />
            <circle cx="84" cy="595" r="11" fill="none" stroke="currentColor" strokeWidth="1.15" />
          </g>
          <g>
            <path d={gearPaths.leftPinion} fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="168" cy="650" r="14" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="168" cy="650" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
          </g>
          <g transform="translate(260 676)">
            <path
              d="M0 24 L270 24 L270 40 L26 40 L26 78 L8 60 L0 24 Z M26 24 L26 0 L10 14 L10 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.15"
            />
            <path
              d="M78 18 L128 18 L128 46 L78 46 L78 82 L94 64 L94 46 M78 18 L92 4 L92 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.15"
            />
            <line x1="270" y1="32" x2="318" y2="32" stroke="currentColor" strokeWidth="1.1" />
            <path
              d="M140 24 V31 M154 24 V30 M168 24 V32 M182 24 V30 M196 24 V31 M210 24 V30 M224 24 V32 M238 24 V30 M252 24 V31"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.95"
            />
          </g>
        </g>

        {/* 5. TOP-LEFT EDGE: Orthographic Roller Bearing Section */}
        <g className="text-[#4a3219] dark:text-sky-400" transform="translate(46 28)">
          <circle cx="36" cy="36" r="32" fill="none" stroke="currentColor" strokeWidth="1.15" />
          <circle cx="36" cy="36" r="24" fill="none" stroke="currentColor" strokeWidth="0.95" />
          <circle cx="36" cy="36" r="14" fill="none" stroke="currentColor" strokeWidth="1.15" />
          <circle cx="36" cy="17" r="4" fill="none" stroke="currentColor" strokeWidth="0.95" />
          <circle cx="55" cy="36" r="4" fill="none" stroke="currentColor" strokeWidth="0.95" />
          <circle cx="36" cy="55" r="4" fill="none" stroke="currentColor" strokeWidth="0.95" />
          <circle cx="17" cy="36" r="4" fill="none" stroke="currentColor" strokeWidth="0.95" />
          <circle cx="49.5" cy="22.5" r="4" fill="none" stroke="currentColor" strokeWidth="0.95" />
          <circle cx="49.5" cy="49.5" r="4" fill="none" stroke="currentColor" strokeWidth="0.95" />
          <circle cx="22.5" cy="49.5" r="4" fill="none" stroke="currentColor" strokeWidth="0.95" />
          <circle cx="22.5" cy="22.5" r="4" fill="none" stroke="currentColor" strokeWidth="0.95" />
        </g>
      </svg>
    </div>
  );
}
