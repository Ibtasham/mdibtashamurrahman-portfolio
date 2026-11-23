import type { ReactNode } from 'react';
import { useInViewReveal } from '../../hooks/useInViewReveal';
import { getRevealDelayMs } from '../../utils/revealMotion';

interface ScrollRevealItemProps {
  index?: number;
  stepMs?: number;
  className?: string;
  children: ReactNode;
}

export function ScrollRevealItem({
  index = 0,
  stepMs = 70,
  className = '',
  children,
}: ScrollRevealItemProps) {
  const { ref, isVisible, prefersReducedMotion } = useInViewReveal<HTMLDivElement>();
  const delayMs = prefersReducedMotion ? 0 : getRevealDelayMs(index, stepMs);

  return (
    <div
      ref={ref}
      data-scroll-reveal={isVisible ? 'visible' : 'hidden'}
      style={
        prefersReducedMotion
          ? undefined
          : {
              transitionDelay: `${delayMs}ms`,
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }
      }
      className={`${
        prefersReducedMotion
          ? ''
          : 'transition-[opacity,transform] duration-[440ms] will-change-[opacity,transform]'
      } ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  );
}
