import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import {
  computeParallaxTilt,
  GUIDE_PORTRAIT_ASSET,
  isPortraitPreloaded,
  resolvePublicAssetUrl,
} from '../../utils/virtualGuide';

interface PortraitCharacter25DProps {
  isSpeaking?: boolean;
  compact?: boolean;
  label?: string;
  preloaded?: boolean;
}

export function PortraitCharacter25D({
  isSpeaking = false,
  compact = false,
  label = 'Ibtashamur Rahman',
  preloaded = false,
}: PortraitCharacter25DProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const { prefersReducedMotion, isMobile } = useMotionPreference();

  const portraitSrc = resolvePublicAssetUrl(GUIDE_PORTRAIT_ASSET);
  const [imageReady, setImageReady] = useState<boolean>(
    () => preloaded || isPortraitPreloaded(portraitSrc),
  );

  useEffect(() => {
    if (preloaded || isPortraitPreloaded(portraitSrc)) {
      setImageReady(true);
      return;
    }
    const imgEl = imgRef.current;
    if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
      setImageReady(true);
    }
  }, [portraitSrc, preloaded]);

  const applyTilt = useCallback((normX: number, normY: number) => {
    const el = stageRef.current;
    if (!el) return;
    const tilt = computeParallaxTilt(normX, normY, prefersReducedMotion || isMobile);
    el.style.setProperty('--guide-rx', `${tilt.rotateX}deg`);
    el.style.setProperty('--guide-ry', `${tilt.rotateY}deg`);
    el.style.setProperty('--guide-sx', `${tilt.shiftX}px`);
    el.style.setProperty('--guide-sy', `${tilt.shiftY}px`);
  }, [prefersReducedMotion, isMobile]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || isMobile || e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = window.requestAnimationFrame(() => {
      applyTilt(normX, normY);
    });
  };

  const handlePointerLeave = () => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = window.requestAnimationFrame(() => {
      applyTilt(0, 0);
    });
  };

  return (
    <div
      ref={stageRef}
      data-portrait-label={label}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`guide-25d-stage relative select-none ${
        compact ? 'w-14 sm:w-24' : 'w-16 sm:w-24'
      } shrink-0`}
    >
      {/* Subtle pulsing halo ring around portrait frame (leaves facial image undistorted) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-2 rounded-[16px] border border-cyan-400/35 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-400/15 dark:border-cyan-400/40 ${
          prefersReducedMotion ? '' : 'animate-guide-ring-pulse'
        }`}
      />

      {/* Back depth plate — subtle blueprint plane floating behind portrait */}
      <div
        aria-hidden="true"
        className="guide-25d-backplate bg-blueprint-grid pointer-events-none absolute -inset-1.5 rounded-[14px] border border-blue-500/25 bg-slate-100/85 dark:border-cyan-400/25 dark:bg-[#081022]/95 shadow-inner"
      />

      {/* Ambient ground shadow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-2 inset-x-3 h-3 rounded-full bg-slate-900/20 blur-md dark:bg-black/65"
      />

      {/* Portrait plane — authoritative original photograph strictly undistorted */}
      <div className="guide-25d-portrait relative aspect-[3/4] overflow-hidden rounded-[12px] border border-slate-300/90 bg-slate-200 dark:border-cyan-400/35 dark:bg-[#0b1222] shadow-[0_14px_30px_-10px_rgba(15,23,42,0.28)] dark:shadow-[0_18px_36px_-10px_rgba(2,6,23,0.85)]">
        <img
          ref={imgRef}
          src={portraitSrc}
          alt="Photograph of MD Ibtashamur Rahman serving as your interactive portfolio guide"
          width={960}
          height={1280}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          referrerPolicy="no-referrer"
          onLoad={() => setImageReady(true)}
          onError={() => setImageReady(true)}
          className={`h-full w-full object-cover object-top transition-opacity duration-200 ${
            imageReady ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Subtle lower atmospheric edge for card depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-slate-950/35 to-transparent"
        />

        {/* Subtle directional optical light sheen */}
        <div
          aria-hidden="true"
          className={`guide-25d-sheen pointer-events-none absolute inset-0 opacity-65 dark:opacity-45 ${
            prefersReducedMotion ? '' : 'animate-guide-sheen-idle'
          }`}
        />

        {/* Restrained speaking visualizer only while speech output is active */}
        {isSpeaking && (
          <div
            aria-hidden="true"
            className="guide-25d-foreground pointer-events-none absolute right-2 bottom-2 inline-flex h-5 items-end gap-[2px] rounded-[6px] border border-white/20 bg-slate-950/80 px-1.5 py-1 backdrop-blur-sm"
          >
            <span className="animate-guide-voice-bar h-2.5 w-[2px] rounded-full bg-cyan-400" />
            <span className="animate-guide-voice-bar h-3 w-[2px] rounded-full bg-blue-400 [animation-delay:140ms]" />
            <span className="animate-guide-voice-bar h-2 w-[2px] rounded-full bg-cyan-300 [animation-delay:280ms]" />
          </div>
        )}
      </div>
    </div>
  );
}
