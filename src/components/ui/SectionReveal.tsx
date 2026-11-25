import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import { DESIGN_TOKENS } from '../../styles/designSystem';

interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function SectionReveal({
  children,
  delay = 0,
  className = '',
}: SectionRevealProps) {
  const { prefersReducedMotion, isMobile } = useMotionPreference();

  if (prefersReducedMotion || isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={DESIGN_TOKENS.motion.viewport}
      transition={{
        duration: DESIGN_TOKENS.motion.durationReveal,
        delay,
        ease: DESIGN_TOKENS.motion.ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LoadingState({ label = 'Loading view...' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-6xl px-6 py-20 space-y-6"
    >
      <div className="space-y-3">
        <div className="h-3 w-36 rounded-[6px] bg-wood-inset dark:bg-slate-800/80 animate-pulse motion-reduce:animate-none" />
        <div className="h-8 w-80 max-w-full rounded-[8px] bg-wood-inset dark:bg-slate-800/80 animate-pulse motion-reduce:animate-none" />
        <p className="font-mono text-xs text-wood-muted dark:text-slate-400">{label}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((slot) => (
          <div
            key={slot}
            className="h-44 rounded-[14px] border border-wood-subtle dark:border-slate-800/80 bg-wood-surface dark:bg-[#0b1222] p-5 space-y-3"
          >
            <div className="h-3 w-28 rounded-[6px] bg-wood-inset dark:bg-slate-800/80 animate-pulse motion-reduce:animate-none" />
            <div className="h-5 w-48 rounded-[6px] bg-wood-inset dark:bg-slate-800/80 animate-pulse motion-reduce:animate-none" />
            <div className="h-3 w-full rounded-[6px] bg-wood-alt dark:bg-slate-800/60 animate-pulse motion-reduce:animate-none" />
            <div className="h-3 w-3/4 rounded-[6px] bg-wood-alt dark:bg-slate-800/60 animate-pulse motion-reduce:animate-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
