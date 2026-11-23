import { useEffect, useRef, useState } from 'react';
import { useMotionPreference } from './useMotionPreference';
import { shouldImmediatelyReveal } from '../utils/revealMotion';

interface UseInViewRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useInViewReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.12,
  rootMargin = '0px 0px -28px 0px',
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

    const rect = element.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < viewportHeight * 0.96 && rect.bottom > 0) {
      setIsVisible(true);
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

    return () => {
      observer.disconnect();
    };
  }, [hasIntersectionObserver, prefersReducedMotion, rootMargin, threshold]);

  return {
    ref,
    isVisible: prefersReducedMotion || isVisible,
    prefersReducedMotion,
  };
}
