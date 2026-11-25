import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { motion, MotionConfig } from 'motion/react';
import { HomeV2Navbar } from './components/home-v2/HomeV2Navbar';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { BackToTopButton } from './components/ui/BackToTopButton';
import { LoadingState } from './components/ui/SectionReveal';
import { ThemeProvider } from './context/ThemeContext';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { DESIGN_TOKENS } from './styles/designSystem';

const AboutPage = lazy(() =>
  import('./pages/SubPages').then((m) => ({ default: m.AboutPage })),
);
const ProjectsPage = lazy(() =>
  import('./pages/SubPages').then((m) => ({ default: m.ProjectsPage })),
);
const ProjectCaseStudyPage = lazy(() =>
  import('./pages/ProjectCaseStudyPage').then((m) => ({
    default: m.ProjectCaseStudyPage,
  })),
);
const ResearchPage = lazy(() =>
  import('./pages/SubPages').then((m) => ({ default: m.ResearchPage })),
);
const ResearchDetailPage = lazy(() =>
  import('./pages/ResearchDetailPage').then((m) => ({
    default: m.ResearchDetailPage,
  })),
);
const InnovationPage = lazy(() =>
  import('./pages/SubPages').then((m) => ({ default: m.InnovationPage })),
);
const ExperiencePage = lazy(() =>
  import('./pages/SubPages').then((m) => ({ default: m.ExperiencePage })),
);
const ExperienceDetailPage = lazy(() =>
  import('./pages/ExperienceDetailPage').then((m) => ({
    default: m.ExperienceDetailPage,
  })),
);
const AwardsPage = lazy(() =>
  import('./pages/SubPages').then((m) => ({ default: m.AwardsPage })),
);
const ArchivePage = lazy(() =>
  import('./pages/SubPages').then((m) => ({ default: m.ArchivePage })),
);
const SkillsPage = lazy(() =>
  import('./pages/SubPages').then((m) => ({ default: m.SkillsPage })),
);
const ContactPage = lazy(() =>
  import('./pages/SubPages').then((m) => ({ default: m.ContactPage })),
);
const Studio3DPage = lazy(() =>
  import('./pages/Studio3DPage').then((m) => ({ default: m.Studio3DPage })),
);
const PortfolioVirtualGuide = lazy(() =>
  import('./components/guide/PortfolioVirtualGuide').then((m) => ({
    default: m.PortfolioVirtualGuide,
  })),
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function AppShell() {
  const location = useLocation();
  const isFullscreenStudio = location.pathname === '/studio';
  const isMainHome = location.pathname === '/' || location.pathname === '/home-v2';

  return (
    <div className="flex min-h-screen flex-col bg-wood-canvas text-wood-ink dark:bg-[#050914] dark:text-slate-100">
      {!isFullscreenStudio && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-[10px] focus:bg-[#2563eb] focus:px-4 focus:py-2.5 focus:text-xs focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          Skip to main content
        </a>
      )}
      {!isFullscreenStudio && (isMainHome ? <HomeV2Navbar /> : <Navbar />)}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: DESIGN_TOKENS.motion.durationFast,
            ease: DESIGN_TOKENS.motion.ease,
          }}
        >
          <Suspense fallback={<LoadingState label="Loading portfolio section..." />}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/home-v2" element={<Navigate to="/" replace />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/studio" element={<Studio3DPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectCaseStudyPage />} />
              <Route path="/research" element={<ResearchPage />} />
              <Route path="/research/:id" element={<ResearchDetailPage />} />
              <Route path="/innovation" element={<InnovationPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/experience/:id" element={<ExperienceDetailPage />} />
              <Route path="/awards" element={<AwardsPage />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </motion.div>
      </main>
      {!isFullscreenStudio && <Footer />}
      {!isFullscreenStudio && <BackToTopButton />}
      {!isFullscreenStudio && (
        <Suspense fallback={null}>
          <PortfolioVirtualGuide />
        </Suspense>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <AppShell />
        </BrowserRouter>
      </MotionConfig>
    </ThemeProvider>
  );
}
