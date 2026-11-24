import { useEffect, useRef, useState } from 'react';
import { useMotionPreference } from './useMotionPreference';
import { shouldImmediatelyReveal } from '../utils/revealMotion';

interface UseInViewRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useInViewReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.01,
  rootMargin = '60px 0px 60px 0px',
}: UseInViewRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const { prefersReducedMotion } = useMotionPreference();

  const hasIntersectionObserver =
    typeof window !== 'undefined' && 'IntersectionObserver' in window;

  const [isVisible, setIsVisible] = useState<boolean>(() =>
    shouldImmediatelyReveal({
      prefersReducedMotion,
      hasIntersectionObserver,
    }),
  );

  useEffect(() => {
    if (
      shouldImmediatelyReveal({
        prefersReducedMotion,
        hasIntersectionObserver,
      })
    ) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const checkViewportOverlap = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      if (rect.top <= viewportHeight + 40 && rect.bottom >= -40) {
        setIsVisible(true);
        return true;
      }
      return false;
    };

    if (checkViewportOverlap()) {
      return;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setIsVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    const handleScroll = () => {
      if (checkViewportOverlap()) {
        observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasIntersectionObserver, prefersReducedMotion, rootMargin, threshold]);

  return {
    ref,
    isVisible: prefersReducedMotion || isVisible,
    prefersReducedMotion,
  };
}
