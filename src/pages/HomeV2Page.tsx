import { lazy, Suspense } from 'react';
import { AboutPreview } from '../components/home/AboutPreview';
import { HomeV2Hero } from '../components/home-v2/HomeV2Hero';
import { PROFILE } from '../data/portfolio';
import { usePageMetadata } from '../hooks/usePageMetadata';

const ProjectsSection = lazy(() =>
  import('../components/home/ProjectsSection').then((m) => ({
    default: m.ProjectsSection,
  })),
);
const ResearchSection = lazy(() =>
  import('../components/home/ResearchSection').then((m) => ({
    default: m.ResearchSection,
  })),
);
const InnovationSection = lazy(() =>
  import('../components/home/InnovationSection').then((m) => ({
    default: m.InnovationSection,
  })),
);
const ExperienceSection = lazy(() =>
  import('../components/home/ExperienceSection').then((m) => ({
    default: m.ExperienceSection,
  })),
);
const AchievementsSection = lazy(() =>
  import('../components/home/AchievementsSection').then((m) => ({
    default: m.AchievementsSection,
  })),
);
const SkillsCertificatesSection = lazy(() =>
  import('../components/home/SkillsCertificatesSection').then((m) => ({
    default: m.SkillsCertificatesSection,
  })),
);
const ContactSection = lazy(() =>
  import('../components/home/ContactSection').then((m) => ({
    default: m.ContactSection,
  })),
);

function SectionBandFallback({ id }: { id: string }) {
  return (
    <div
      id={id}
      aria-hidden="true"
      className="min-h-[320px] border-b border-wood-subtle dark:border-slate-800/80 bg-wood-canvas dark:bg-[#050914]"
    />
  );
}

export function HomeV2Page() {
  usePageMetadata({
    title: 'Experimental Engineering Homepage Concept',
    description: PROFILE.summary,
    path: '/home-v2',
    noIndex: true,
    schemaType: 'Person',
    schemaExtra: {
      affiliation: {
        '@type': 'CollegeOrUniversity',
        name: PROFILE.university,
      },
      sameAs: [PROFILE.links.linkedin, PROFILE.links.github],
      jobTitle: PROFILE.headline,
    },
  });

  return (
    <>
      <HomeV2Hero />
      <AboutPreview />
      <Suspense fallback={<SectionBandFallback id="projects" />}>
        <ProjectsSection />
      </Suspense>
      <Suspense fallback={<SectionBandFallback id="research" />}>
        <ResearchSection />
      </Suspense>
      <Suspense fallback={<SectionBandFallback id="innovation" />}>
        <InnovationSection />
      </Suspense>
      <Suspense fallback={<SectionBandFallback id="experience" />}>
        <ExperienceSection />
      </Suspense>
      <Suspense fallback={<SectionBandFallback id="awards" />}>
        <AchievementsSection />
      </Suspense>
      <Suspense fallback={<SectionBandFallback id="skills" />}>
        <SkillsCertificatesSection />
      </Suspense>
      <Suspense fallback={<SectionBandFallback id="contact" />}>
        <ContactSection />
      </Suspense>
    </>
  );
}
