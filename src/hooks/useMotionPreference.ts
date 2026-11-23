import { useEffect, useState } from 'react';

export interface MotionPreference {
  prefersReducedMotion: boolean;
  isMobile: boolean;
  shouldReduceMotion: boolean;
}

export function useMotionPreference(): MotionPreference {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileMedia = window.matchMedia('(max-width: 767px)');

    const sync = () => {
      setPrefersReducedMotion(motionMedia.matches);
      setIsMobile(mobileMedia.matches);
    };

    sync();
    motionMedia.addEventListener('change', sync);
    mobileMedia.addEventListener('change', sync);

    return () => {
      motionMedia.removeEventListener('change', sync);
      mobileMedia.removeEventListener('change', sync);
    };
  }, []);

  return {
    prefersReducedMotion,
    isMobile,
    shouldReduceMotion: prefersReducedMotion || isMobile,
  };
}
