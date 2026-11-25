import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { mapSectionIdToNavRoute, useActiveSection } from '../../hooks/useActiveSection';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import { LinkButton } from '../ui/Button';

const NAV_ITEMS = [
  { label: 'About', to: '/about' },
  { label: '3D Lab', to: '/studio' },
  { label: 'Projects', to: '/projects' },
  { label: 'Research', to: '/research' },
  { label: 'Innovation', to: '/innovation' },
  { label: 'Experience', to: '/experience' },
  { label: 'Awards', to: '/awards' },
  { label: 'Archive', to: '/archive' },
  { label: 'Skills', to: '/skills' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const activeSectionId = useActiveSection(pathname === '/');
  const activeHomeRoute = mapSectionIdToNavRoute(activeSectionId);

  const isContactActive =
    pathname === '/contact' || (pathname === '/' && activeHomeRoute === '/contact');

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

  return (
    <header className="sticky top-0 z-40 border-b border-wood-subtle/90 dark:border-slate-800/80 bg-wood-surface/92 dark:bg-[#050914]/92 backdrop-blur-md">
      <div className={`${DESIGN_TOKENS.spacing.container} flex items-center justify-between gap-4 py-4`}>
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="font-display text-base font-semibold tracking-normal text-wood-ink dark:text-slate-50 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[6px] whitespace-nowrap shrink-0"
        >
          MD Ibtashamur Rahman
        </Link>

        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-2.5 xl:gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) => {
              const active = isActive && activeHomeRoute === null;
              return `relative py-1 text-[13px] font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px] ${
                active
                  ? 'text-blue-700 dark:text-cyan-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-blue-600 dark:after:bg-cyan-400'
                  : 'text-wood-muted dark:text-slate-300 hover:text-wood-ink dark:hover:text-white'
              }`;
            }}
          >
            Home
          </NavLink>
          {NAV_ITEMS.map((item) => {
            const isSectionActive = pathname === '/' && activeHomeRoute === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => {
                  const active = isActive || isSectionActive;
                  return `relative py-1 text-[13px] font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px] ${
                    active
                      ? 'text-blue-700 dark:text-cyan-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-blue-600 dark:after:bg-cyan-400'
                      : 'text-wood-muted dark:text-slate-300 hover:text-wood-ink dark:hover:text-white'
                  }`;
                }}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#0b1222] text-wood-walnut dark:text-slate-200 transition-colors duration-150 hover:border-blue-500/60 hover:text-blue-700 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          <div className="hidden lg:block">
            <LinkButton
              to="/contact"
              variant="primary"
              size="sm"
              className={
                isContactActive
                  ? 'ring-2 ring-cyan-500/70 dark:ring-cyan-400/70'
                  : ''
              }
            >
              Contact
            </LinkButton>
          </div>

          <button
            ref={mobileToggleRef}
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#0b1222] text-wood-walnut dark:text-slate-200 transition-colors duration-150 hover:border-blue-500/50 hover:text-wood-ink dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 lg:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-b border-wood-subtle dark:border-slate-800 bg-wood-surface dark:bg-[#0b1222] px-6 py-4 shadow-[0_20px_40px_-12px_rgba(28,20,13,0.18)] dark:shadow-[0_24px_48px_-12px_rgba(2,6,23,0.9)] lg:hidden"
        >
          <div className="flex flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex min-h-[44px] items-center rounded-[10px] px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-cyan-300'
                    : 'text-wood-walnut dark:text-slate-300 hover:bg-wood-hover dark:hover:bg-[#101a30] hover:text-wood-ink dark:hover:text-white'
                }`
              }
            >
              Home
            </NavLink>
            {NAV_ITEMS.map((item) => {
              const isSectionActive = pathname === '/' && activeHomeRoute === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-[44px] items-center rounded-[10px] px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 ${
                      isActive || isSectionActive
                        ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-cyan-300'
                        : 'text-wood-walnut dark:text-slate-300 hover:bg-wood-hover dark:hover:bg-[#101a30] hover:text-wood-ink dark:hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}
            <LinkButton
              to="/contact"
              variant="primary"
              size="md"
              onClick={() => setMobileOpen(false)}
              className="mt-2 w-full"
            >
              Contact
            </LinkButton>
          </div>
        </nav>
      )}
    </header>
  );
}
