import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Settings } from 'lucide-react';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import {
  computeHeroPortrait25DParallax,
  preloadPortraitAsset,
} from '../../utils/virtualGuide';

interface HeroPortrait25DProps {
  portraitUrl: string;
  ownerName: string;
}

export function HeroPortrait25D({ portraitUrl, ownerName }: HeroPortrait25DProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { prefersReducedMotion, shouldReduceMotion, isMobile } = useMotionPreference();
  const disablePointerTracking = prefersReducedMotion || isMobile;

  useEffect(() => {
    void preloadPortraitAsset(portraitUrl);
  }, [portraitUrl]);

  const applyParallax = useCallback(
    (normX: number, normY: number) => {
      const el = stageRef.current;
      if (!el) return;
      const t = computeHeroPortrait25DParallax(normX, normY, disablePointerTracking);
      el.style.setProperty('--hero-rx', `${t.rotateX}deg`);
      el.style.setProperty('--hero-ry', `${t.rotateY}deg`);
      el.style.setProperty('--hero-px', `${t.parallaxX}`);
      el.style.setProperty('--hero-py', `${t.parallaxY}`);
      el.style.setProperty('--hero-lx', `${t.lightXPercent}%`);
      el.style.setProperty('--hero-ly', `${t.lightYPercent}%`);
    },
    [disablePointerTracking],
  );

  useEffect(() => {
    if (disablePointerTracking) {
      setIsHovered(false);
      applyParallax(0, 0);
    }
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [applyParallax, disablePointerTracking]);

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disablePointerTracking || e.pointerType === 'touch') return;
    setIsHovered(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disablePointerTracking || e.pointerType === 'touch') return;
    setIsHovered(true);
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = window.requestAnimationFrame(() => {
      applyParallax(normX, normY);
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = window.requestAnimationFrame(() => {
      applyParallax(0, 0);
    });
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.52,
        delay: shouldReduceMotion ? 0 : 0.08,
        ease: DESIGN_TOKENS.motion.ease,
      }}
      className="relative"
    >
      <div
        ref={stageRef}
        data-hero-portrait-25d="true"
        data-hovered={isHovered && !disablePointerTracking ? 'true' : 'false'}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
        className="hero-25d-stage relative flex flex-col items-center justify-center pt-5 pb-6 sm:pt-6 sm:pb-7 select-none"
      >
        {/* Layer 1: Deep Atmospheric Projection Core + Orbiting Electric-Blue Rim Light */}
        <div
          aria-hidden="true"
          className="hero-25d-aura pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          {/* Sapphire projection sphere (provides dark atmospheric continuity in both dark & light themes) */}
          <div
            className="h-[318px] w-[318px] rounded-full opacity-90 dark:opacity-75 sm:h-[372px] sm:w-[372px] lg:h-[316px] lg:w-[316px] xl:h-[396px] xl:w-[396px]"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, rgba(6, 17, 42, 0.96) 0%, rgba(7, 22, 54, 0.9) 46%, rgba(37, 99, 235, 0.28) 64%, transparent 74%)',
            }}
          />
          <div
            className={`absolute h-[290px] w-[290px] rounded-full blur-3xl sm:h-[340px] sm:w-[340px] ${
              prefersReducedMotion ? '' : 'animate-hero-ambient-breathe'
            }`}
            style={{
              background:
                'radial-gradient(circle, rgba(37, 99, 235, 0.48) 0%, rgba(34, 211, 238, 0.22) 48%, transparent 76%)',
            }}
          />
          {/* Soft moving electric-blue orbital spotlight around silhouette */}
          <div
            className={`absolute h-[230px] w-[230px] rounded-full blur-2xl sm:h-[268px] sm:w-[268px] ${
              prefersReducedMotion ? 'opacity-45' : 'animate-hero-orbit-light'
            }`}
            style={{
              background:
                'radial-gradient(circle, rgba(56, 189, 248, 0.42) 0%, rgba(37, 99, 235, 0.18) 52%, transparent 76%)',
            }}
          />
        </div>

        {/* Layer 2: Rotating Concentric Holographic HUD Rings Centered Behind Head & Shoulders */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.58,
              delay: shouldReduceMotion ? 0 : 0.14,
              ease: DESIGN_TOKENS.motion.ease,
            }}
            className="hero-25d-rings relative flex items-center justify-center"
          >
            {/* Outer rotating segmented HUD circle + bright flare nodes */}
            <svg
              viewBox="0 0 460 460"
              className={`h-[312px] w-[312px] text-cyan-400/70 sm:h-[378px] sm:w-[378px] lg:h-[322px] lg:w-[322px] xl:h-[420px] xl:w-[420px] ${
                prefersReducedMotion ? '' : 'animate-hud-orbit-slow'
              }`}
              fill="none"
            >
              <circle
                cx="230"
                cy="230"
                r="212"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeOpacity="0.45"
                strokeDasharray="3 6"
              />
              <circle
                cx="230"
                cy="230"
                r="196"
                stroke="#38bdf8"
                strokeWidth="2.8"
                strokeOpacity="0.72"
                strokeDasharray="92 140 52 190"
                strokeLinecap="round"
              />
              <circle
                cx="230"
                cy="230"
                r="182"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeOpacity="0.48"
                strokeDasharray="64 32 16 32"
              />
              {/* Bright cyan energy nodes mimicking reference dial flare */}
              <circle cx="34" cy="230" r="4.5" fill="#67e8f9" fillOpacity="0.95" />
              <circle cx="426" cy="230" r="3.5" fill="#38bdf8" fillOpacity="0.85" />
              <path
                d="M230 12V28M230 432V448M12 230H28M432 230H448"
                stroke="#67e8f9"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeOpacity="0.82"
              />
            </svg>

            {/* Counter-rotating inner holographic power arc */}
            <svg
              viewBox="0 0 400 400"
              className={`absolute h-[264px] w-[264px] text-blue-400/70 sm:h-[320px] sm:w-[320px] lg:h-[272px] lg:w-[272px] xl:h-[354px] xl:w-[354px] ${
                prefersReducedMotion ? '' : 'animate-hud-orbit-reverse'
              }`}
              fill="none"
            >
              <circle
                cx="200"
                cy="200"
                r="176"
                stroke="#22d3ee"
                strokeWidth="2.2"
                strokeOpacity="0.65"
                strokeDasharray="54 24 14 24"
                strokeLinecap="round"
              />
              <circle
                cx="200"
                cy="200"
                r="158"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.4"
                strokeDasharray="4 8"
              />
            </svg>

            <div
              className={`absolute h-[218px] w-[218px] rounded-full border border-cyan-300/35 shadow-[0_0_32px_-4px_rgba(34,211,238,0.45)] sm:h-[262px] sm:w-[262px] lg:h-[224px] lg:w-[224px] xl:h-[296px] xl:w-[296px] ${
                prefersReducedMotion ? '' : 'animate-guide-ring-pulse'
              }`}
            />
          </motion.div>
        </div>

        {/* Layer 3: Interactive 2.5D Holographic Stage */}
        <div className="relative z-10 w-[264px] sm:w-[306px] lg:w-[258px] xl:w-[334px] [transform-style:preserve-3d]">
          {/* Projected depth shadow behind floating figure */}
          <div
            aria-hidden="true"
            className="hero-25d-cast-shadow pointer-events-none absolute inset-x-10 top-6 bottom-12 rounded-full bg-blue-950/75 blur-2xl"
          />

          {/* Borderless Floating Holographic Silhouette Wrapper */}
          <div
            className={`relative [transform-style:preserve-3d] ${
              prefersReducedMotion ? '' : 'animate-hero-portrait-float'
            }`}
          >
            {/* Main Elevated 2.5D Photographic Figure (rises & tilts in response to hover/cursor) */}
            <div className="hero-25d-card relative">
              <div className="hero-holo-mask-radial relative aspect-[9/10] w-full overflow-hidden">
                <div className="hero-holo-mask-base relative h-full w-full overflow-hidden">
                  <img
                    src={portraitUrl}
                    alt={`Formal holographic portrait of ${ownerName}`}
                    width={1672}
                    height={941}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    referrerPolicy="no-referrer"
                    className="pointer-events-none absolute left-1/2 -top-[2.5%] h-[142%] w-auto max-w-none -translate-x-1/2 select-none"
                  />

                  {/* Subtle Occasional Cyan Holographic Scan Beam (masked cleanly inside figure silhouette) */}
                  {!prefersReducedMotion && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 overflow-hidden"
                    >
                      <div
                        data-hero-holo-scan="true"
                        className="animate-hero-holo-scan h-[13%] w-full bg-gradient-to-b from-transparent via-cyan-400/16 to-cyan-300/38 mix-blend-screen"
                      >
                        <div className="h-full w-full border-b-[1.5px] border-cyan-200/80 shadow-[0_2px_18px_rgba(34,211,238,0.7)]" />
                      </div>
                    </div>
                  )}

                  {/* Cursor-responsive electric-blue optical specular rim lighting */}
                  <div
                    aria-hidden="true"
                    className="hero-25d-cursor-light pointer-events-none absolute inset-0 mix-blend-screen"
                  />
                </div>
              </div>
            </div>

            {/* Subtle Corner Telemetry HUD Reticle Brackets (rotate/pulse & lock outward on hover) */}
            <div
              aria-hidden="true"
              className="hero-25d-foreground pointer-events-none absolute inset-x-1 top-2 bottom-10"
            >
              <span
                className={`hero-25d-bracket hero-25d-bracket-tl absolute top-0 left-0 h-5 w-5 rounded-tl-[6px] border-t-2 border-l-2 border-cyan-400/75 shadow-[-2px_-2px_10px_rgba(34,211,238,0.35)] ${
                  prefersReducedMotion ? '' : 'animate-hero-bracket-pulse'
                }`}
              />
              <span
                className={`hero-25d-bracket hero-25d-bracket-tr absolute top-0 right-0 h-5 w-5 rounded-tr-[6px] border-t-2 border-r-2 border-cyan-400/75 shadow-[2px_-2px_10px_rgba(34,211,238,0.35)] ${
                  prefersReducedMotion ? '' : 'animate-hero-bracket-pulse'
                }`}
              />
              <span
                className={`hero-25d-bracket hero-25d-bracket-bl absolute bottom-3 left-0 h-5 w-5 rounded-bl-[6px] border-b-2 border-l-2 border-cyan-400/75 shadow-[-2px_2px_10px_rgba(34,211,238,0.35)] ${
                  prefersReducedMotion ? '' : 'animate-hero-bracket-pulse'
                }`}
              />
              <span
                className={`hero-25d-bracket hero-25d-bracket-br absolute bottom-3 right-0 h-5 w-5 rounded-br-[6px] border-b-2 border-r-2 border-cyan-400/75 shadow-[2px_2px_10px_rgba(34,211,238,0.35)] ${
                  prefersReducedMotion ? '' : 'animate-hero-bracket-pulse'
                }`}
              />
            </div>
          </div>

          {/* Layer 4: Concentric Holographic Projector Emitter Pedestal + Chamfered Badge */}
          <div
            aria-hidden="true"
            className="hero-25d-foreground relative -mt-12 flex flex-col items-center justify-center pointer-events-none"
          >
            {/* Glowing upward holographic beam cone */}
            <div
              className="pointer-events-none -mb-6 h-12 w-[78%] blur-md opacity-80"
              style={{
                background:
                  'radial-gradient(ellipse 65% 90% at 50% 95%, rgba(56, 189, 248, 0.52) 0%, rgba(37, 99, 235, 0.18) 55%, transparent 82%)',
              }}
            />

            {/* Floating Chamfered Holographic HUD Nameplate */}
            <div className="hero-holo-plaque relative z-20 mb-[-16px] bg-gradient-to-r from-cyan-400/80 via-sky-300/90 to-blue-500/80 p-[1.5px] shadow-[0_0_24px_rgba(56,189,248,0.45)]">
              <div className="hero-holo-plaque flex items-center gap-2.5 bg-[#061229]/95 px-4 py-1.5 backdrop-blur-md">
                <Settings className="h-3.5 w-3.5 text-cyan-300" />
                <span className="h-3.5 w-[1px] bg-cyan-400/45" />
                <span className="font-mono text-[11px] font-semibold tracking-wider text-cyan-50 whitespace-nowrap">
                  IPE · SUST
                </span>
                <span className="h-3.5 w-[1px] bg-cyan-400/35" />
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-200 whitespace-nowrap">
                  <MapPin className="h-3 w-3 text-cyan-300" />
                  Bangladesh
                </span>
              </div>
            </div>

            {/* Perspective 3D Concentric Glowing Emitter Rings */}
            <div className="relative flex h-16 w-[108%] items-center justify-center [perspective:420px]">
              <div
                className={`relative flex h-32 w-full items-center justify-center ${
                  prefersReducedMotion ? 'hero-holo-pedestal-plane' : 'animate-hero-pedestal-pulse'
                }`}
              >
                {/* Outer luminous ring */}
                <div className="absolute inset-x-1 inset-y-2 rounded-full border-2 border-cyan-400/75 shadow-[0_0_26px_rgba(34,211,238,0.6),inset_0_0_18px_rgba(37,99,235,0.45)]" />
                {/* Middle ring */}
                <div className="absolute inset-x-7 inset-y-5 rounded-full border border-sky-300/80 shadow-[0_0_16px_rgba(56,189,248,0.55)]" />
                {/* Inner radiant emitter core */}
                <div
                  className="absolute inset-x-14 inset-y-8 rounded-full"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(103, 232, 249, 0.65) 0%, rgba(37, 99, 235, 0.28) 58%, transparent 80%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
