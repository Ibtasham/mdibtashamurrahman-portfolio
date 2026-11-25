import type { ComponentType } from 'react';
import { motion } from 'motion/react';
import {
  ArrowDown,
  ArrowRight,
  AudioLines,
  Award,
  Code2,
  FlaskConical,
  Lightbulb,
  Mail,
  MessageCircle,
  Microscope,
  Rocket,
  Settings,
  Trophy,
  User,
  Users,
} from 'lucide-react';
import heroBackdropUrl from '../../assets/images/home_v2_factory_backdrop.webp';
import {
  EXPERIENCES,
  PROFILE,
  RESEARCH_MANUSCRIPTS,
} from '../../data/portfolio';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import { countExperiencesByCategory } from '../../utils/portfolioFilters';
import {
  HOLOGRAM_PORTRAIT_ASSET,
  requestOpenVirtualGuide,
  resolvePublicAssetUrl,
} from '../../utils/virtualGuide';
import { IndustrialMachinesOverlay } from '../ui/IndustrialMachinesOverlay';
import { ScrollRevealItem } from '../ui/ScrollRevealItem';
import { HeroPortrait25D } from './HeroPortrait25D';

const AMBASSADOR_COUNT = countExperiencesByCategory(EXPERIENCES).ambassador;
const MANUSCRIPT_COUNT = RESEARCH_MANUSCRIPTS.length;

interface HighlightCard {
  id: string;
  label: string;
  detail: string;
  targetSectionId: string;
  icon: ComponentType<{ className?: string }>;
}

const HIGHLIGHT_CARDS: readonly HighlightCard[] = [
  {
    id: 'leadership',
    label: 'Leadership',
    detail: `${AMBASSADOR_COUNT}+ Campus Representation & Leadership Roles`,
    targetSectionId: 'experience',
    icon: Users,
  },
  {
    id: 'achievements',
    label: 'Achievements',
    detail: 'Competition & Academic Milestones',
    targetSectionId: 'awards',
    icon: Trophy,
  },
  {
    id: 'projects',
    label: 'Projects',
    detail: 'Engineering & Software Systems',
    targetSectionId: 'projects',
    icon: Code2,
  },
  {
    id: 'research',
    label: 'Research',
    detail: `Predictive Maintenance & Smart Manufacturing · ${MANUSCRIPT_COUNT} Manuscripts`,
    targetSectionId: 'research',
    icon: FlaskConical,
  },
];

interface TimelineNode {
  id: string;
  title: string;
  subtitle: string;
  sectionId: string;
  icon: ComponentType<{ className?: string }>;
}

const TIMELINE_NODES: readonly TimelineNode[] = [
  {
    id: 'tl-about',
    title: 'About Me',
    subtitle: 'Know who I am',
    sectionId: 'about',
    icon: User,
  },
  {
    id: 'tl-projects',
    title: 'My Projects',
    subtitle: 'See what I build',
    sectionId: 'projects',
    icon: Code2,
  },
  {
    id: 'tl-research',
    title: 'Research',
    subtitle: 'Explore my work',
    sectionId: 'research',
    icon: FlaskConical,
  },
  {
    id: 'tl-awards',
    title: 'Achievements',
    subtitle: 'My milestones',
    sectionId: 'awards',
    icon: Award,
  },
  {
    id: 'tl-contact',
    title: "Let's Connect",
    subtitle: 'Start a conversation',
    sectionId: 'contact',
    icon: Mail,
  },
];

const VISION_DIMENSIONS = [
  { label: 'Engineering', sectionId: 'projects', icon: Settings },
  { label: 'Research', sectionId: 'research', icon: Microscope },
  { label: 'Innovation', sectionId: 'innovation', icon: Lightbulb },
  { label: 'Leadership', sectionId: 'experience', icon: Users },
] as const;

interface HighlightCardButtonProps {
  card: HighlightCard;
  onSelect: (sectionId: string) => void;
}

function HighlightCardButton({ card, onSelect }: HighlightCardButtonProps) {
  const Icon = card.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(card.targetSectionId)}
      className="group flex w-full items-start gap-3.5 rounded-[14px] border border-wood-subtle/95 bg-wood-surface/95 p-3.5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/65 hover:bg-wood-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:border-blue-400/25 dark:bg-[#0b162d]/95 dark:shadow-[inset_0_1px_0_rgba(148,163,184,0.14),0_8px_22px_-12px_rgba(2,6,23,0.7)] dark:hover:border-cyan-400/55 dark:hover:bg-[#102040] dark:focus-visible:ring-cyan-400 cursor-pointer"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-blue-500/25 bg-blue-50 text-blue-600 transition-colors duration-200 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white dark:border-cyan-400/30 dark:bg-[#112447] dark:text-cyan-300 dark:group-hover:border-cyan-400 dark:group-hover:bg-cyan-400 dark:group-hover:text-slate-950">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[13.5px] font-semibold tracking-tight text-wood-ink transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-cyan-300">
          {card.label}
        </span>
        <span className="mt-0.5 block text-[12.5px] leading-[1.42] text-wood-muted dark:text-slate-300">
          {card.detail}
        </span>
      </span>
    </button>
  );
}

export function HomeV2Hero() {
  const { prefersReducedMotion, shouldReduceMotion } = useMotionPreference();
  const portraitUrl = resolvePublicAssetUrl(HOLOGRAM_PORTRAIT_ASSET);

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const handleOpenGuide = () => {
    requestOpenVirtualGuide();
  };

  return (
    <section
      id="hero-v2"
      aria-label="Experimental cinematic introduction"
      className="relative overflow-hidden border-b border-wood-subtle bg-wood-canvas dark:border-blue-500/20 dark:bg-[#050914]"
    >
      {/* Background atmospheric industrial plant + architectural grid + calibrated ambient lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <img
          src={heroBackdropUrl}
          alt=""
          width={1440}
          height={810}
          decoding="async"
          className="h-full w-full object-cover object-center opacity-10 mix-blend-multiply dark:opacity-45 dark:mix-blend-normal"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-wood-canvas via-wood-canvas/94 to-wood-canvas/78 dark:from-[#050914] dark:via-[#050914]/92 dark:to-[#050914]/64" />
        <div className="absolute inset-0 bg-gradient-to-t from-wood-canvas via-transparent to-wood-canvas/65 dark:from-[#050914] dark:via-transparent dark:to-[#050914]/65" />
        <div className="bg-blueprint-grid absolute inset-0 opacity-55 dark:opacity-45" />
        <IndustrialMachinesOverlay variant="hero" />
        <div
          className={`absolute right-[10%] top-[2%] h-[520px] w-[520px] rounded-full ${
            shouldReduceMotion ? '' : 'animate-hero-ambient-breathe'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, rgba(56, 189, 248, 0.07) 38%, rgba(56, 189, 248, 0) 70%)',
          }}
        />
        <div
          className="absolute left-[-8%] bottom-[-14%] h-[380px] w-[380px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, rgba(14, 165, 233, 0) 68%)',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-7 pb-12 sm:px-6 sm:pt-9 sm:pb-14 lg:px-8 lg:pt-10 lg:pb-12">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-7">
          {/* LEFT COLUMN: Intro, Headline, Tagline, CTAs, and Desktop 4 Highlight Cards */}
          <div className="min-w-0 space-y-5 lg:col-span-6 lg:space-y-6">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : DESIGN_TOKENS.motion.durationReveal,
                ease: DESIGN_TOKENS.motion.ease,
              }}
              className="space-y-5"
            >
              {/* Status chip */}
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-blue-600/25 bg-wood-surface/92 px-2.5 min-[390px]:px-3 sm:px-3.5 py-1.5 text-[10.5px] min-[390px]:text-[11px] sm:text-xs font-medium leading-snug text-wood-ink shadow-sm backdrop-blur-sm dark:border-cyan-400/25 dark:bg-[#09152c]/90 dark:text-cyan-100">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 dark:bg-emerald-400"
                />
                <span>
                  Industrial &amp; Production Engineering Student • SUST
                </span>
              </div>

              {/* Hero Display Name */}
              <div className="space-y-3">
                <h1 className="font-display text-[1.92rem] min-[390px]:text-[2.1rem] font-bold leading-[1.08] tracking-[-0.03em] text-wood-ink dark:text-white sm:text-[2.85rem] md:text-[3.1rem] lg:text-[2.55rem] xl:text-[3.35rem] xl:leading-[1.04]">
                  <span className="block">Hello, I&apos;m</span>
                  <span className="relative inline-block whitespace-nowrap text-blue-600 dark:text-[#28acff]">
                    {PROFILE.shortName}
                    <svg
                      viewBox="0 0 300 16"
                      aria-hidden="true"
                      className="pointer-events-none mt-1 block h-2.5 w-full"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M4 11 C 85 3, 210 3, 294 10"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        fill="none"
                        className="text-blue-500/80 dark:text-cyan-400/85"
                      />
                    </svg>
                  </span>
                </h1>

                <p className="font-display text-[17px] font-semibold leading-snug text-wood-walnut dark:text-slate-100 sm:text-xl">
                  Engineering Today. Innovating for Tomorrow.
                </p>

                <p className="max-w-xl text-sm leading-relaxed text-wood-muted dark:text-slate-300 sm:text-[15px]">
                  An Industrial &amp; Production Engineering student at SUST,
                  passionate about Smart Manufacturing, Research, and Building
                  Innovative Solutions.
                </p>
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-0.5">
                <button
                  type="button"
                  onClick={() => scrollToSection('projects')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 sm:px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer"
                >
                  <Rocket className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Explore My Work</span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('about')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-wood-default bg-wood-surface/95 px-5 sm:px-6 py-2.5 text-sm font-semibold text-wood-walnut transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-wood-hover hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:border-blue-400/35 dark:bg-[#09152b]/85 dark:text-slate-100 dark:hover:border-cyan-400 dark:hover:text-cyan-300 dark:focus-visible:ring-cyan-400 cursor-pointer"
                >
                  <User className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>About Me</span>
                </button>
              </div>
            </motion.div>

            {/* Desktop 4 Highlight Cards (No academic scores/GPAs) */}
            <div
              aria-label="Core engineering and leadership highlights"
              className="hidden lg:grid grid-cols-2 gap-3 pt-1"
            >
              {HIGHLIGHT_CARDS.map((card, idx) => (
                <ScrollRevealItem key={card.id} index={idx} className="flex">
                  <HighlightCardButton
                    card={card}
                    onSelect={scrollToSection}
                  />
                </ScrollRevealItem>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Prominent Original Photograph + Rim Lighting + Compact Guide Callout + Timeline */}
          <div className="min-w-0 lg:col-span-6">
            <div className="flex flex-col items-center gap-7 lg:flex-row lg:items-center lg:justify-end lg:gap-4 xl:gap-6">
              {/* Portrait Focal Stage + Non-Overlapping Speech Bubble */}
              <div className="relative flex w-full max-w-[340px] flex-col items-center sm:max-w-[360px] lg:w-auto lg:max-w-none">
                {/* Compact Virtual Guide Speech Bubble stacked cleanly ABOVE portrait bezel */}
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.34,
                    delay: shouldReduceMotion ? 0 : 0.16,
                    ease: DESIGN_TOKENS.motion.ease,
                  }}
                  className="relative z-20 mb-2.5 w-full max-w-[304px] sm:max-w-[314px] lg:max-w-[264px] xl:max-w-[314px] lg:self-start lg:-ml-2 xl:-ml-4"
                >
                  <button
                    type="button"
                    onClick={handleOpenGuide}
                    aria-label="Open interactive portfolio virtual guide"
                    className="group block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[14px] cursor-pointer"
                  >
                    <span
                      className={`relative block rounded-[14px] border border-blue-500/35 bg-wood-surface/95 px-3.5 py-2.5 shadow-[0_10px_26px_-10px_rgba(37,99,235,0.22)] backdrop-blur-md transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-blue-600 dark:border-cyan-400/40 dark:bg-[#08142a]/92 dark:shadow-[0_14px_30px_-10px_rgba(2,6,23,0.75)] dark:group-hover:border-cyan-300 ${
                        prefersReducedMotion ? '' : 'animate-guide-bubble-float'
                      }`}
                    >
                      <span className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-blue-50 text-blue-600 dark:bg-cyan-400/15 dark:text-cyan-300">
                          <AudioLines className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1 text-[11.5px] leading-[1.48] text-wood-walnut dark:text-slate-200">
                          <span className="font-semibold text-wood-ink dark:text-white">
                            Hey there!
                          </span>{' '}
                          I&apos;m Ibtashamur Rahman. Welcome to my portfolio! Let me
                          guide you through my journey...
                          <span className="mt-1 flex w-fit items-center gap-1 font-mono text-[10.5px] font-semibold text-blue-700 transition-transform group-hover:translate-x-0.5 dark:text-cyan-300">
                            <span>Start Virtual Tour</span>
                            <ArrowRight className="h-3 w-3" aria-hidden="true" />
                          </span>
                        </span>
                      </span>
                      {/* Subtle speech tail pointing toward portrait below */}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r border-b border-blue-500/35 bg-wood-surface dark:border-cyan-400/40 dark:bg-[#08142a] lg:left-20 lg:translate-x-0 xl:left-24"
                      />
                    </span>
                  </button>
                </motion.div>

                {/* Interactive 2.5D Photographic Character Stage */}
                <HeroPortrait25D portraitUrl={portraitUrl} ownerName={PROFILE.name} />
              </div>

              {/* Mobile / Tablet Highlight Cards right after portrait for above-the-fold clarity */}
              <div
                aria-label="Core engineering and leadership highlights"
                className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden"
              >
                {HIGHLIGHT_CARDS.map((card, idx) => (
                  <ScrollRevealItem
                    key={`mob-${card.id}`}
                    index={idx}
                    className="flex"
                  >
                    <HighlightCardButton
                      card={card}
                      onSelect={scrollToSection}
                    />
                  </ScrollRevealItem>
                ))}
              </div>

              {/* Vertical Navigation Timeline */}
              <motion.nav
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.38,
                  delay: shouldReduceMotion ? 0 : 0.18,
                  ease: DESIGN_TOKENS.motion.ease,
                }}
                aria-label="Quick section timeline"
                className="relative w-full lg:w-[174px] xl:w-[198px] shrink-0"
              >
                {/* Vertical luminous connector line on lg+ desktop */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-6 bottom-6 left-[17px] xl:left-[19px] hidden w-[2px] bg-gradient-to-b from-blue-500/70 via-cyan-400/65 to-blue-600/30 lg:block"
                />
                <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1 lg:gap-3 xl:gap-4">
                  {TIMELINE_NODES.map((node, index) => {
                    const Icon = node.icon;
                    const spanFullOnTablet =
                      index === TIMELINE_NODES.length - 1
                        ? 'sm:col-span-2 lg:col-span-1'
                        : '';
                    return (
                      <li key={node.id} className={spanFullOnTablet}>
                        <button
                          type="button"
                          onClick={() => scrollToSection(node.sectionId)}
                          className="group relative flex min-h-[44px] w-full items-center gap-3 rounded-[12px] border border-wood-subtle/85 bg-wood-surface/90 px-3 py-2.5 text-left transition-all duration-200 hover:border-blue-500/60 hover:bg-wood-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:border-blue-500/20 dark:bg-[#09152b]/85 dark:hover:border-cyan-400/50 dark:hover:bg-[#0e1f3e] dark:focus-visible:ring-cyan-400 lg:min-h-[40px] lg:border-transparent lg:bg-transparent lg:px-0 lg:py-0.5 lg:hover:border-transparent lg:hover:bg-transparent lg:dark:border-transparent lg:dark:bg-transparent lg:dark:hover:bg-transparent cursor-pointer"
                        >
                          <span className="relative z-10 flex h-9 w-9 xl:h-10 xl:w-10 shrink-0 items-center justify-center rounded-full border border-blue-500/40 bg-wood-surface text-blue-600 shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white dark:border-cyan-400/50 dark:bg-[#0a1834] dark:text-cyan-300 dark:shadow-[0_0_14px_-4px_rgba(34,211,238,0.35)] dark:group-hover:border-cyan-300 dark:group-hover:bg-cyan-400 dark:group-hover:text-slate-950">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block font-display text-[13.5px] font-semibold text-wood-ink transition-colors group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-cyan-300">
                              {node.title}
                            </span>
                            <span className="block text-[11.5px] text-wood-muted dark:text-slate-400">
                              {node.subtitle}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.nav>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Chamfered "Four Dimensions. One Vision." Panel + Centered Scroll Indicator */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.38,
            delay: shouldReduceMotion ? 0 : 0.2,
            ease: DESIGN_TOKENS.motion.ease,
          }}
          className="mt-8 grid items-end gap-5 lg:mt-10 lg:grid-cols-12"
        >
          {/* Chamfered Four Dimensions Panel */}
          <div className="lg:col-span-5">
            <div className="relative drop-shadow-[0_10px_24px_rgba(37,99,235,0.16)] dark:drop-shadow-[0_12px_26px_rgba(14,165,233,0.16)]">
              <div className="home-v2-chamfer p-[1.5px] bg-gradient-to-r from-cyan-500/75 via-blue-500/60 to-cyan-400/75">
                <div className="home-v2-chamfer bg-wood-surface/95 px-5 py-3.5 backdrop-blur-md dark:bg-[#071226]/95 sm:px-6 sm:py-4">
                  <p className="font-display text-sm font-semibold text-wood-ink dark:text-white">
                    Four Dimensions. One Vision.
                  </p>
                  <div className="mt-3 grid grid-cols-2 divide-wood-subtle dark:divide-blue-500/20 sm:grid-cols-4 sm:divide-x">
                    {VISION_DIMENSIONS.map((dim) => {
                      const Icon = dim.icon;
                      return (
                        <button
                          key={dim.label}
                          type="button"
                          onClick={() => scrollToSection(dim.sectionId)}
                          className="group flex min-h-[44px] flex-col items-center justify-center gap-1.5 rounded-[8px] px-2 py-2.5 text-center transition-colors hover:bg-wood-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:hover:bg-[#0d1d3a] dark:focus-visible:ring-cyan-400 cursor-pointer"
                        >
                          <Icon
                            className="h-5 w-5 text-blue-600 transition-transform duration-200 group-hover:scale-110 dark:text-cyan-400"
                            aria-hidden="true"
                          />
                          <span className="text-[11.5px] font-medium text-wood-walnut dark:text-slate-200">
                            {dim.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Scroll Indicator */}
          <div className="flex justify-center lg:col-span-2">
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="group inline-flex min-h-[44px] flex-col items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-wood-muted transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:text-slate-300 dark:hover:text-cyan-300 dark:focus-visible:ring-cyan-400 cursor-pointer"
            >
              <span
                aria-hidden="true"
                className="flex h-7 w-4.5 items-start justify-center rounded-full border-2 border-current pt-1.5"
              >
                <span className="h-1.5 w-0.5 rounded-full bg-current" />
              </span>
              <span className="whitespace-nowrap text-[11.5px] font-medium">
                Scroll to explore
              </span>
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:block lg:col-span-5" aria-hidden="true" />
        </motion.div>
      </div>

      {/* Floating "Talk to Me" Button opening existing Virtual Guide */}
      <button
        type="button"
        onClick={handleOpenGuide}
        aria-label="Talk to Me — open interactive portfolio virtual guide"
        className="fixed right-3.5 bottom-3.5 z-30 inline-flex min-h-[42px] sm:min-h-[46px] items-center gap-2 rounded-full border border-blue-600/35 bg-wood-surface/95 px-3.5 py-2 text-xs font-semibold text-wood-ink shadow-[0_12px_28px_-8px_rgba(37,99,235,0.28)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:border-cyan-400/45 dark:bg-[#081327]/95 dark:text-white dark:shadow-[0_14px_32px_-10px_rgba(2,6,23,0.85)] dark:hover:border-cyan-300 dark:focus-visible:ring-cyan-400 sm:right-6 sm:bottom-5 sm:gap-2.5 sm:px-5 sm:text-[13px] cursor-pointer"
      >
        <MessageCircle className="h-4 w-4 text-blue-600 dark:text-cyan-300" aria-hidden="true" />
        <span>Talk to Me</span>
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400"
        />
      </button>
    </section>
  );
}
