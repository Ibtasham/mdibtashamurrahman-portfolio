import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AboutPreview } from '../components/home/AboutPreview';
import { AchievementsSection } from '../components/home/AchievementsSection';
import { ContactSection } from '../components/home/ContactSection';
import { ExperienceSection } from '../components/home/ExperienceSection';
import { JourneyPreview } from '../components/home/JourneyPreview';
import { ProjectsSection } from '../components/home/ProjectsSection';
import { ResearchSection } from '../components/home/ResearchSection';
import { InnovationSection } from '../components/home/InnovationSection';
import { SkillsCertificatesSection } from '../components/home/SkillsCertificatesSection';
import { VisualArchiveGallery } from '../components/home/VisualArchiveGallery';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { DESIGN_TOKENS } from '../styles/designSystem';

function PageBanner({
  section,
  title,
  subtitle,
}: {
  section: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#050914] bg-blueprint-grid py-12 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ambient-hero-light"
      />
      <div className={`relative ${DESIGN_TOKENS.spacing.container} space-y-4`}>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-600 dark:text-slate-400 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Overview</span>
        </Link>
        <div className="space-y-2 max-w-2xl">
          <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
            {section}
          </p>
          <h1 className={DESIGN_TOKENS.typography.pageTitle}>
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AboutPage() {
  usePageMetadata({
    title: 'About, Education & Journey',
    description:
      'Academic foundation, triple GPA 5.00 record, SUST Industrial & Production Engineering studies, formal education timeline, and long-term career aspirations.',
    path: '/about',
    schemaType: 'Person',
  });

  return (
    <>
      <PageBanner
        section="About, Education & Journey"
        title="MD Ibtashamur Rahman"
        subtitle="Personal introduction, biography, formal education timeline, academic research interests, personal development milestones, and future engineering aspirations."
      />
      <AboutPreview expanded />
      <JourneyPreview />
    </>
  );
}

export function ProjectsPage() {
  usePageMetadata({
    title: 'Project Laboratory & Case Studies',
    description:
      'Engineering and ML case studies spanning FactoryMind, ForgeMind AI, and TikaTrack across industrial optimization and software.',
    path: '/projects',
    schemaType: 'CollectionPage',
  });

  return (
    <>
      <PageBanner
        section="Project Laboratory"
        title="Engineering, Research & Software Systems"
        subtitle="Explore interactive case studies spanning FactoryMind, ForgeMind AI, and TikaTrack—filtered across Engineering, Research, AI/ML, Software, and Innovation."
      />
      <ProjectsSection expanded />
    </>
  );
}

export function ResearchPage() {
  usePageMetadata({
    title: 'Research Profile & Manuscripts',
    description:
      'SUST Industrial & Production Engineering research on NASA C-MAPSS prognostics, carbon-aware scheduling, and inventory policy.',
    path: '/research',
    schemaType: 'CollectionPage',
  });

  return (
    <>
      <PageBanner
        section="Research & Academic Profile"
        title="Empirical Prognostics, Optimization & Industrial Analytics"
        subtitle="Undergraduate research profile in Industrial & Production Engineering covering NASA C-MAPSS uncertainty-aware predictive maintenance, sustainable scheduling, and inventory replenishment."
      />
      <ResearchSection expanded />
    </>
  );
}

export function InnovationPage() {
  usePageMetadata({
    title: 'Innovation & Entrepreneurship Hub',
    description:
      'Structured problem-to-solution tracking across ideas, working software and research prototypes, innovation competitions, and future discovery milestones.',
    path: '/innovation',
    schemaType: 'CollectionPage',
  });

  return (
    <>
      <PageBanner
        section="Innovation & Entrepreneurship"
        title="Problem Framing, Prototypes & Venture Strategy"
        subtitle="Tracking ideas, working software and research prototypes, innovation competitions, five-step problem-solving workflows, and future pre-validation milestones—with zero fabricated commercial validation."
      />
      <InnovationSection expanded />
    </>
  );
}

export function ExperiencePage() {
  usePageMetadata({
    title: 'Leadership & Campus Outreach',
    description:
      'SUST executive committee mandates, campus ambassador tenures, event coordination, and volunteering roles with supporting evidence.',
    path: '/experience',
    schemaType: 'CollectionPage',
  });

  return (
    <>
      <PageBanner
        section="Leadership & Campus Outreach"
        title="Executive, Ambassador, Events & Volunteering"
        subtitle="Separated across current and former positions, executive committees, campus ambassador tenures, event organization, and volunteering—with documented responsibilities and photographic or certificate proof."
      />
      <ExperienceSection expanded />
    </>
  );
}

export function AwardsPage() {
  usePageMetadata({
    title: 'Achievements, Competitions & Honors',
    description:
      'Verified academic scholarships, iNIT 3.0 IT Olympiad championship, national business case finals, public speaking distinctions, and recognition certificates.',
    path: '/awards',
    schemaType: 'CollectionPage',
  });

  return (
    <>
      <PageBanner
        section="Honors & Recognition"
        title="Achievements, Competitions & Certificates"
        subtitle="Verified academic scholarships, IT Olympiad win, business case competitions, public speaking distinctions, and volunteering recognition with zoomable certificate previews."
      />
      <AchievementsSection expanded />
    </>
  );
}

export function ArchivePage() {
  usePageMetadata({
    title: 'Visual Achievement Archive',
    description:
      'Event-grouped photography, competition certificates, official appointment letters, and campus portraits with interactive lightbox inspection.',
    path: '/archive',
    schemaType: 'CollectionPage',
  });

  return (
    <>
      <PageBanner
        section="Visual Achievement Archive"
        title="Photographs, Certificates & Official Letters"
        subtitle="Organized visual archive across awards, public speaking, leadership activities, campus ambassador outreach, volunteering, university events, and portraits—with editable metadata and transparent confirmation flags."
      />
      <VisualArchiveGallery />
    </>
  );
}

export function SkillsPage() {
  usePageMetadata({
    title: 'Skills & Certificate Gallery',
    description:
      'Evidence-linked capabilities across Industrial Engineering, Software, Machine Learning, Operations Research, and Leadership.',
    path: '/skills',
    schemaType: 'CollectionPage',
  });

  return (
    <>
      <PageBanner
        section="Skills & Credential Verification"
        title="Skills & Certificate Management"
        subtitle="Evidence-linked capability matrix covering Industrial Engineering, Programming & Software, Data Analytics & ML, Operations Research, Research Methods, and Leadership paired with the searchable certificate gallery."
      />
      <SkillsCertificatesSection expanded />
    </>
  );
}

export function ContactPage() {
  usePageMetadata({
    title: 'Contact & Collaboration Inquiries',
    description:
      'Get in touch with MD Ibtashamur Rahman for industrial engineering research collaboration, software projects, or campus initiatives.',
    path: '/contact',
    schemaType: 'WebPage',
  });

  return (
    <>
      <PageBanner
        section="Connect"
        title="Direct Contact & Collaboration"
        subtitle="Reach out regarding industrial engineering projects, research collaborations, or campus leadership initiatives."
      />
      <ContactSection />
    </>
  );
}
