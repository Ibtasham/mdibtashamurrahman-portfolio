import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Download,
} from 'lucide-react';
import {
  EXPERIENCES,
  PROFILE,
  RESEARCH_MANUSCRIPTS,
} from '../../data/portfolio';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import {
  countExperiencesByCategory,
  getLeadershipEntries,
} from '../../utils/portfolioFilters';
import { HeroSystemsSchematic } from './HeroSystemsSchematic';
import { LinkButton } from '../ui/Button';
import { SurfaceCard } from '../ui/SurfaceCard';

const AMBASSADOR_COUNT = countExperiencesByCategory(EXPERIENCES).ambassador;
const ACTIVE_LEADERSHIP_COUNT = getLeadershipEntries(EXPERIENCES).filter(
  (e) => e.isCurrent,
).length;

const PROOF_ITEMS = [
  {
    eyebrow: 'Academic Record',
    value: 'GPA 5.00 / 5.00',
    label: 'JSC, SSC & HSC · Govt. Talent Pool Scholar (JSC 2019)',
  },
  {
    eyebrow: 'Research Pipeline',
    value: `${RESEARCH_MANUSCRIPTS.length} Manuscripts`,
    label: 'Studies in preparation · 0 peer-reviewed DOIs claimed yet',
  },
  {
    eyebrow: 'Verified Competitions',
    value: '1st · Top 10 · 4th',
    label: 'iNIT 3.0 Olympiad (1st), Innovesta 3.0 & Speak Up 2026 (1st in ’24–25)',
  },
  {
    eyebrow: 'Leadership & Outreach',
    value: `${ACTIVE_LEADERSHIP_COUNT} Active · ${AMBASSADOR_COUNT} Tenures`,
    label: 'Current SUST executive & club roles alongside campus representation',
  },
];

const HERO_PILLARS = [
  {
    label: 'What I Build',
    detail:
      'Engineering analytics, industrial optimization systems, predictive maintenance platforms & research-driven software',
  },
  {
    label: 'Core Interests',
    detail:
      'Smart Manufacturing · Industry 4.0 · Operations Research · Applied Machine Learning · Sustainable Industrial Systems',
  },
  {
    label: 'Other Dimension',
    detail:
      'Executive student leadership, extempore public speaking, startup ideation & national case competitions',
  },
];

export function HeroSection() {
  const { shouldReduceMotion } = useMotionPreference();

  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#050914] bg-blueprint-grid"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ambient-hero-light"
      />

      <div
        className={`relative ${DESIGN_TOKENS.spacing.container} pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-10 lg:pb-14`}
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Left Column: Identity, Headline, Four Pillars, CTAs */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion
                ? 0
                : DESIGN_TOKENS.motion.durationReveal,
              ease: DESIGN_TOKENS.motion.ease,
            }}
            className="flex min-w-0 flex-col justify-between gap-5 lg:col-span-7"
          >
            <div className="space-y-4">
              {/* Academic Affiliation Strip */}
              <div className="space-y-0.5">
                <p className="font-mono text-xs font-medium text-cyan-700 dark:text-cyan-400">
                  {PROFILE.university}
                </p>
                <p className="font-mono text-xs text-slate-700 dark:text-slate-300">
                  B.Sc. in Industrial &amp; Production Engineering · Session{' '}
                  {PROFILE.session} ({PROFILE.academicStanding})
                </p>
              </div>

              {/* Name & Concise Professional Headline */}
              <div className="space-y-2.5">
                <h1 className={DESIGN_TOKENS.typography.heroDisplay}>
                  {PROFILE.name}
                </h1>
                <p className="font-editorial text-xl font-medium leading-snug text-slate-800 dark:text-slate-100 sm:text-2xl text-balance">
                  Engineering Optimization Systems, Predictive Maintenance &amp;
                  Research-Driven Software.
                </p>
              </div>

              {/* Short Personal Introduction */}
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[15px]">
                I am an Industrial &amp; Production Engineering undergraduate at
                SUST building quantitative decision-support tools that turn
                operations research and applied machine learning into reliable
                manufacturing software—alongside leading student organizations,
                competing in national case finals, and speaking on stage.
              </p>

              {/* Clean Typographic Pillars (What I Build / Interests / Other Dimension) */}
              <dl className="divide-y divide-slate-200 dark:divide-slate-800/80 border-y border-slate-200 dark:border-slate-800/80">
                {HERO_PILLARS.map((item) => (
                  <div
                    key={item.label}
                    className="grid gap-1 py-2.5 sm:grid-cols-[136px_1fr] sm:items-baseline sm:gap-4"
                  >
                    <dt className="font-mono text-[11px] font-medium text-cyan-700 dark:text-cyan-400">
                      {item.label}
                    </dt>
                    <dd className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 sm:text-[13px]">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Strictly One Primary CTA + One Secondary CTA + External Verification Links */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3.5">
                <LinkButton to="/projects" variant="primary" size="md">
                  <span>Explore Projects</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </LinkButton>

                <LinkButton to="/research" variant="secondary" size="md">
                  <span>View Research</span>
                </LinkButton>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                <a
                  href={PROFILE.links.cvPdf}
                  download="MD_Ibtashamur_Rahman_CV.pdf"
                  className="inline-flex items-center gap-1.5 font-medium text-blue-700 dark:text-cyan-300 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px]"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Download CV (PDF)</span>
                </a>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                  ·
                </span>
                <a
                  href={PROFILE.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium transition-colors duration-150 hover:text-blue-700 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px]"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                  ·
                </span>
                <a
                  href={PROFILE.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium transition-colors duration-150 hover:text-blue-700 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px]"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Portrait + Restrained Engineering Systems Schematic */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion
                ? 0
                : DESIGN_TOKENS.motion.durationReveal,
              delay: shouldReduceMotion ? 0 : 0.08,
              ease: DESIGN_TOKENS.motion.ease,
            }}
            className="lg:col-span-5"
          >
            <SurfaceCard className="flex h-full flex-col justify-between gap-3.5 p-4">
              {/* Professional Individual Portrait */}
              <figure className="space-y-2">
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[10px] border border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-[#060b16]">
                  <img
                    src={PROFILE.profilePhoto}
                    alt={`Formal portrait of ${PROFILE.name}`}
                    width={1200}
                    height={800}
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-cover object-[50%_18%]"
                  />
                </div>
                <figcaption className="flex flex-wrap items-baseline justify-between gap-2 px-0.5 font-mono text-[11px]">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {PROFILE.shortName}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    SUST IPE · {PROFILE.publicLocation}
                  </span>
                </figcaption>
              </figure>

              {/* Interactive Technical Illustration / Pipeline Schematic */}
              <HeroSystemsSchematic />
            </SurfaceCard>
          </motion.div>
        </div>

        {/* Verified Proof Strip */}
        <div
          aria-label="Verified academic, research, competition, and leadership credentials"
          className="mt-7 overflow-hidden rounded-[14px] border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1222]"
        >
          <div className="grid grid-cols-1 divide-y divide-slate-200 dark:divide-slate-800/80 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {PROOF_ITEMS.map((item, idx) => (
              <div
                key={item.eyebrow}
                className={`px-4 py-3.5 ${
                  idx === 1 || idx === 3
                    ? 'sm:border-l sm:border-slate-200 dark:sm:border-slate-800/80 lg:border-l-0'
                    : ''
                } ${
                  idx >= 2
                    ? 'sm:border-t sm:border-slate-200 dark:sm:border-slate-800/80 lg:border-t-0'
                    : ''
                }`}
              >
                <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                  {item.eyebrow}
                </p>
                <p className="mt-1 font-mono text-lg font-semibold text-slate-950 dark:text-slate-50 tabular-nums sm:text-xl">
                  {item.value}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
