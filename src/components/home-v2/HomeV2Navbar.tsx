import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Download, Menu, Moon, Sun, X } from 'lucide-react';
import { PROFILE } from '../../data/portfolio';
import { useTheme } from '../../context/ThemeContext';
import { mapSectionIdToNavRoute, useActiveSection } from '../../hooks/useActiveSection';
import { resolvePublicAssetUrl } from '../../utils/virtualGuide';

const HOME_V2_NAV_ITEMS = [
  { label: 'Home', to: '/', matchSectionRoute: null },
  { label: 'Projects', to: '/projects', matchSectionRoute: '/projects' },
  { label: 'Research', to: '/research', matchSectionRoute: '/research' },
  { label: 'Innovation', to: '/innovation', matchSectionRoute: '/innovation' },
  { label: 'Experience', to: '/experience', matchSectionRoute: '/experience' },
  { label: 'Achievements', to: '/awards', matchSectionRoute: '/awards' },
  { label: 'Archive', to: '/archive', matchSectionRoute: '/archive' },
  { label: 'Skills', to: '/skills', matchSectionRoute: '/skills' },
  { label: 'Contact', to: '/contact', matchSectionRoute: '/contact' },
] as const;

function EngineeringBrandLogo() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="h-9 w-9 shrink-0 text-blue-600 dark:text-cyan-400"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="20"
        cy="20"
        r="17"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeOpacity="0.32"
        strokeDasharray="3 3"
      />
      <path
        d="M20 6.5V9.5M20 30.5V33.5M6.5 20H9.5M30.5 20H33.5M10.45 10.45L12.6 12.6M27.4 27.4L29.55 29.55M29.55 10.45L27.4 12.6M12.6 27.4L10.45 29.55"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle
        cx="20"
        cy="20"
        r="10.25"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M15.5 24V16L20 20.5L24.5 16V24"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="11.5" r="1.4" fill="currentColor" />
      <circle cx="20" cy="28.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function HomeV2Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isMainHome = pathname === '/' || pathname === '/home-v2';
  const activeSectionId = useActiveSection(isMainHome);
  const activeSectionRoute = mapSectionIdToNavRoute(activeSectionId);
  const cvUrl = resolvePublicAssetUrl(PROFILE.links.cvPdf);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileOpen(false);
        window.requestAnimationFrame(() => {
          mobileToggleRef.current?.focus();
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const handleHomeClick = () => {
    setMobileOpen(false);
    if (isMainHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-wood-subtle/90 bg-wood-surface/90 backdrop-blur-md dark:border-blue-500/20 dark:bg-[#050914]/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3.5 sm:px-6 lg:px-4 xl:gap-4 xl:px-8">
        {/* Left: Engineering emblem + Identity */}
        <Link
          to="/"
          onClick={handleHomeClick}
          className="group flex min-w-0 shrink-0 items-center gap-2 rounded-[10px] py-0.5 pr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400"
        >
          <EngineeringBrandLogo />
          <div className="min-w-0 leading-tight">
            <span className="block truncate font-display text-[13px] font-semibold tracking-normal text-wood-ink transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-cyan-300 xl:text-[15px]">
              {PROFILE.name}
            </span>
            <span className="block font-mono text-[10px] font-medium tracking-[0.12em] text-wood-muted dark:text-slate-400 xl:text-[10.5px]">
              SUST · IPE
            </span>
          </div>
        </Link>

        {/* Center: Primary functional links */}
        <nav aria-label="Primary homepage navigation" className="hidden lg:flex items-center gap-2 xl:gap-5">
          {HOME_V2_NAV_ITEMS.map((item) => {
            const isActiveItem =
              item.to === '/'
                ? isMainHome && activeSectionRoute === null
                : pathname === item.to || (isMainHome && activeSectionRoute === item.matchSectionRoute);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={item.to === '/' ? handleHomeClick : undefined}
                className={`relative py-2 text-[11.5px] xl:text-[13.5px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px] ${
                  isActiveItem
                    ? 'text-blue-700 dark:text-cyan-300 after:absolute after:inset-x-0 after:-bottom-[1px] after:h-[2.5px] after:rounded-full after:bg-blue-600 after:shadow-[0_0_12px_rgba(37,99,235,0.65)] dark:after:bg-cyan-400 dark:after:shadow-[0_0_14px_rgba(34,211,238,0.9)]'
                    : 'text-wood-muted hover:text-wood-ink dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Segmented Theme Toggle + Download CV + Mobile Toggle */}
        <div className="flex shrink-0 items-center gap-2 xl:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex h-10 items-center gap-1 rounded-full border border-wood-default bg-wood-inset/90 p-1 text-wood-muted transition-colors hover:border-blue-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:border-blue-500/30 dark:bg-[#0b152a] dark:text-slate-400 dark:focus-visible:ring-cyan-400 cursor-pointer"
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                theme === 'light'
                  ? 'bg-wood-input text-amber-600 shadow-sm'
                  : 'text-amber-300/75'
              }`}
            >
              <Sun className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                theme === 'dark'
                  ? 'bg-[#17284b] text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.28)]'
                  : 'text-wood-muted'
              }`}
            >
              <Moon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </button>

          <a
            href={cvUrl}
            download="MD_Ibtashamur_Rahman_CV.pdf"
            className="hidden sm:inline-flex min-h-[38px] xl:min-h-[40px] items-center gap-1.5 xl:gap-2 rounded-full border border-blue-600/30 bg-blue-50/90 px-2.5 xl:px-4 py-1.5 text-[11.5px] xl:text-[13px] font-semibold text-blue-800 transition-all hover:border-blue-600 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:border-cyan-400/35 dark:bg-[#0b1730]/90 dark:text-slate-100 dark:shadow-[0_0_20px_-6px_rgba(34,211,238,0.35)] dark:hover:border-cyan-400 dark:hover:bg-[#102042] dark:focus-visible:ring-cyan-400 whitespace-nowrap"
          >
            <span>Download CV</span>
            <Download className="h-3.5 w-3.5 text-blue-700 dark:text-cyan-300" aria-hidden="true" />
          </a>

          <button
            ref={mobileToggleRef}
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="home-v2-mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-wood-default bg-wood-inset text-wood-walnut transition-colors hover:border-blue-500/60 hover:text-wood-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:border-blue-500/25 dark:bg-[#0b152a] dark:text-slate-200 dark:hover:border-cyan-400/50 dark:hover:text-white dark:focus-visible:ring-cyan-400 lg:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          id="home-v2-mobile-navigation"
          aria-label="Mobile navigation"
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-wood-subtle bg-wood-surface/98 px-4 py-4 shadow-xl dark:border-blue-500/20 dark:bg-[#070f21]/98 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {HOME_V2_NAV_ITEMS.map((item) => {
              const isActiveItem =
                item.to === '/'
                  ? isMainHome && activeSectionRoute === null
                  : pathname === item.to || (isMainHome && activeSectionRoute === item.matchSectionRoute);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (item.to === '/') handleHomeClick();
                    else setMobileOpen(false);
                  }}
                  className={`flex min-h-[44px] items-center rounded-[10px] px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 ${
                    isActiveItem
                      ? 'bg-blue-50 text-blue-700 dark:bg-cyan-500/15 dark:text-cyan-300'
                      : 'text-wood-walnut hover:bg-wood-hover hover:text-wood-ink dark:text-slate-300 dark:hover:bg-[#101e3b] dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </NavLink>
              );
            })}

            <div className="mt-2 grid gap-2 border-t border-wood-subtle pt-3 dark:border-slate-800/80 sm:hidden">
              <a
                href={cvUrl}
                download="MD_Ibtashamur_Rahman_CV.pdf"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>Download CV (PDF)</span>
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
