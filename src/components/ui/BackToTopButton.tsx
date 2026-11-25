import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import { isGuideHomePath } from '../../utils/virtualGuide';

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();
  const { prefersReducedMotion } = useMotionPreference();
  const isMainHome = isGuideHomePath(pathname);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 420);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleScrollTop}
          aria-label="Back to top"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          transition={{
            duration: DESIGN_TOKENS.motion.durationFast,
            ease: DESIGN_TOKENS.motion.ease,
          }}
          className={`fixed right-4 sm:right-6 ${
            isMainHome ? 'bottom-[4.75rem] sm:bottom-[5.25rem]' : 'bottom-5'
          } z-40 inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-[12px] border border-wood-default dark:border-slate-700/90 bg-wood-surface/95 dark:bg-[#0b1222]/95 px-3.5 text-xs font-semibold text-wood-ink dark:text-slate-100 shadow-[0_10px_28px_-8px_rgba(45,28,12,0.22)] dark:shadow-[0_14px_32px_-8px_rgba(2,6,23,0.85)] backdrop-blur-md transition-colors duration-150 hover:border-blue-600/70 hover:text-blue-700 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer`}
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
