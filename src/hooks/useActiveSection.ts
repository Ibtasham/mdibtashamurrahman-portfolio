import { useEffect, useState } from 'react';

export const HOME_SECTION_IDS = [
  'about',
  'projects',
  'research',
  'innovation',
  'studio-3d',
  'experience',
  'awards',
  'archive',
  'skills',
  'contact',
] as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

export function mapSectionIdToNavRoute(sectionId: string | null): string | null {
  switch (sectionId) {
    case 'about':
    case 'journey':
      return '/about';
    case 'studio-3d':
      return '/studio';
    case 'projects':
      return '/projects';
    case 'research':
      return '/research';
    case 'innovation':
      return '/innovation';
    case 'experience':
      return '/experience';
    case 'awards':
      return '/awards';
    case 'archive':
      return '/archive';
    case 'skills':
      return '/skills';
    case 'contact':
      return '/contact';
    default:
      return null;
  }
}

export function useActiveSection(enabled: boolean): HomeSectionId | null {
  const [activeId, setActiveId] = useState<HomeSectionId | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setActiveId(null);
      return;
    }

    const computeActiveSection = () => {
      const scrollY = window.scrollY;
      if (scrollY < 260) {
        setActiveId(null);
        return;
      }

      const probeY = window.innerHeight * 0.34;
      let current: HomeSectionId | null = null;

      for (const id of HOME_SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > 80) {
          current = id;
        }
      }

      setActiveId(current);
    };

    computeActiveSection();

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        computeActiveSection();
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [enabled]);

  return activeId;
}
