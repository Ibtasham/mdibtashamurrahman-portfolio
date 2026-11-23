export interface VirtualGuideStep {
  id: string;
  indexLabel: string;
  sectionId:
    | 'about'
    | 'projects'
    | 'research'
    | 'innovation'
    | 'experience'
    | 'awards'
    | 'skills'
    | 'contact';
  label: string;
  route: string;
  routeLabel: string;
  title: string;
  speech: string;
}

export const GUIDE_INTRO_MESSAGE =
  "Hello! I'm Ibtashamur Rahman. Welcome to my portfolio. Let me show you what I've been working on.";

export const GUIDE_PORTRAIT_ASSET =
  '/assets/aistudio/WhatsApp_Image_2026-09-14_at_6.44.42_PM_9eca5786.jpeg';

export const HOLOGRAM_PORTRAIT_ASSET =
  '/assets/aistudio/file_00000000ed0c820bb2e3dcfedb05bedd_08a4aca0.png';

export const GUIDE_STORAGE_KEY = 'portfolio-virtual-guide-seen-v1';
export const GUIDE_VOICE_STORAGE_KEY = 'portfolio-virtual-guide-voice-v1';
export const PORTFOLIO_GUIDE_OPEN_EVENT = 'portfolio-virtual-guide:open';

export interface OpenVirtualGuideDetail {
  mode?: 'intro' | 'tour';
}

export function isGuideHomePath(pathname: string): boolean {
  return pathname === '/' || pathname === '/home-v2';
}

export function requestOpenVirtualGuide(detail: OpenVirtualGuideDetail = {}): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<OpenVirtualGuideDetail>(PORTFOLIO_GUIDE_OPEN_EVENT, { detail }),
  );
}

export const VIRTUAL_GUIDE_TOUR_STEPS: readonly VirtualGuideStep[] = [
  {
    id: 'about',
    indexLabel: '01',
    sectionId: 'about',
    label: 'About Me',
    route: '/about',
    routeLabel: 'Open About & Academic Timeline',
    title: 'Engineering Foundation & Journey',
    speech:
      'I am MD Ibtashamur Rahman, a 2nd Year Industrial & Production Engineering undergraduate at SUST (Session 2024–25). After earning a triple GPA 5.00 across JSC, SSC, and HSC alongside a Govt. Talent Pool Scholarship, my work focuses on uniting optimization math with software systems and campus leadership.',
  },
  {
    id: 'projects',
    indexLabel: '02',
    sectionId: 'projects',
    label: 'Projects',
    route: '/projects',
    routeLabel: 'Open Full Projects Lab',
    title: 'Engineering Systems & Software',
    speech:
      'In the Projects Laboratory, you can inspect FactoryMind—an open-source Python and OR-Tools production suite—alongside ForgeMind AI for NASA C-MAPSS prognostics and TikaTrack for digital public-health records, with interactive architecture diagrams and transparent scope labels.',
  },
  {
    id: 'research',
    indexLabel: '03',
    sectionId: 'research',
    label: 'Research',
    route: '/research',
    routeLabel: 'Explore Research Pipeline',
    title: 'Manuscripts & Benchmark Experiments',
    speech:
      'Here are my four manuscripts currently in preparation across explainable Remaining Useful Life modeling, decision-aware maintenance, carbon-aware job-shop scheduling, and intermittent demand forecasting—strictly separating completed setups from ongoing and proposed work.',
  },
  {
    id: 'innovation',
    indexLabel: '04',
    sectionId: 'innovation',
    label: 'Innovation',
    route: '/innovation',
    routeLabel: 'View Case Strategy & Studio',
    title: 'Case Competitions & 3D Studio Preview',
    speech:
      'This section tracks how quantitative engineering translates into startup ideation and national case competitions—including Innovesta 3.0 Top 10 Finalist and Case Quest 2.0—paired directly with our interactive Five-Assembly 3D Engineering Studio.',
  },
  {
    id: 'experience',
    indexLabel: '05',
    sectionId: 'experience',
    label: 'Experience',
    route: '/experience',
    routeLabel: 'Inspect All Leadership Roles',
    title: 'Executive Governance & Outreach',
    speech:
      'Alongside coursework and research, I serve in five active executive and committee roles at SUST—including SUST Science Arena, GDN-SUST, and the Noakhali Association—and have represented 12 national partner initiatives as Campus Director or Ambassador.',
  },
  {
    id: 'awards',
    indexLabel: '06',
    sectionId: 'awards',
    label: 'Achievements',
    route: '/awards',
    routeLabel: 'Browse Certificates & Honors',
    title: 'Verified Awards & Visual Proof',
    speech:
      'Every academic scholarship, 1st Place IT Olympiad win at iNIT 3.0, Speak Up 2026 extempore distinction, and certificate is organized here with interactive preview modals and documentary photographs.',
  },
  {
    id: 'skills',
    indexLabel: '07',
    sectionId: 'skills',
    label: 'Skills',
    route: '/skills',
    routeLabel: 'Inspect Technical Stack & Evidence',
    title: 'Evidence-Linked Technical Capabilities',
    speech:
      'Rather than arbitrary percentage bars, each engineering, optimization, ML, and CAD capability here links directly to the verified repositories, case studies, manuscripts, or leadership records that demonstrate it.',
  },
  {
    id: 'contact',
    indexLabel: '08',
    sectionId: 'contact',
    label: 'Contact',
    route: '/contact',
    routeLabel: 'Open Contact Page',
    title: 'Direct Collaboration & CV',
    speech:
      'Thank you for taking the tour! You can reach me directly at ibtarahman@gmail.com, download my verified PDF CV, connect on LinkedIn or GitHub, or compose a structured inquiry right here.',
  },
] as const;

export function resolvePublicAssetUrl(
  assetPath: string,
  baseUrl = import.meta.env.BASE_URL ?? '/',
): string {
  if (/^(https?:|mailto:|tel:|data:|blob:)/i.test(assetPath)) {
    return assetPath;
  }
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanAsset = assetPath.replace(/^\/+/, '');
  return `${normalizedBase}${cleanAsset}`;
}

export function clampGuideStepIndex(index: number, total = VIRTUAL_GUIDE_TOUR_STEPS.length): number {
  if (total <= 0) return 0;
  if (!Number.isFinite(index)) return 0;
  return Math.max(0, Math.min(total - 1, Math.trunc(index)));
}

export function getNextGuideStepIndex(
  currentIndex: number,
  total = VIRTUAL_GUIDE_TOUR_STEPS.length,
): number | null {
  if (total <= 0) return null;
  if (currentIndex + 1 >= total) return null;
  return clampGuideStepIndex(currentIndex + 1, total);
}

export function getPrevGuideStepIndex(
  currentIndex: number,
  total = VIRTUAL_GUIDE_TOUR_STEPS.length,
): number {
  return clampGuideStepIndex(currentIndex - 1, total);
}

export interface ParallaxTiltResult {
  rotateX: number;
  rotateY: number;
  shiftX: number;
  shiftY: number;
}

export function computeParallaxTilt(
  normX: number,
  normY: number,
  reducedMotion: boolean,
): ParallaxTiltResult {
  if (reducedMotion || !Number.isFinite(normX) || !Number.isFinite(normY)) {
    return { rotateX: 0, rotateY: 0, shiftX: 0, shiftY: 0 };
  }
  const clampedX = Math.max(-1, Math.min(1, normX));
  const clampedY = Math.max(-1, Math.min(1, normY));
  return {
    rotateX: Number((-clampedY * 4.5).toFixed(2)),
    rotateY: Number((clampedX * 4.5).toFixed(2)),
    shiftX: Number((clampedX * 4).toFixed(2)),
    shiftY: Number((clampedY * 3).toFixed(2)),
  };
}

export interface HeroPortrait25DParallax {
  rotateX: number;
  rotateY: number;
  parallaxX: number;
  parallaxY: number;
  lightXPercent: number;
  lightYPercent: number;
}

/**
 * Computes conservative 3D perspective tilt, normalized layer parallax shift,
 * and cursor-following optical rim-light origin for the homepage hero portrait.
 * Returns static neutral values when reduced motion or touch-only mode is active.
 */
export function computeHeroPortrait25DParallax(
  normX: number,
  normY: number,
  disablePointerTracking: boolean,
): HeroPortrait25DParallax {
  if (disablePointerTracking || !Number.isFinite(normX) || !Number.isFinite(normY)) {
    return {
      rotateX: 0,
      rotateY: 0,
      parallaxX: 0,
      parallaxY: 0,
      lightXPercent: 50,
      lightYPercent: 32,
    };
  }
  const clampedX = Math.max(-1, Math.min(1, normX));
  const clampedY = Math.max(-1, Math.min(1, normY));
  return {
    rotateX: Number((-clampedY * 7.5).toFixed(2)),
    rotateY: Number((clampedX * 7.5).toFixed(2)),
    parallaxX: Number(clampedX.toFixed(3)),
    parallaxY: Number(clampedY.toFixed(3)),
    lightXPercent: Number((50 + clampedX * 38).toFixed(1)),
    lightYPercent: Number((45 + clampedY * 34).toFixed(1)),
  };
}

export function hasSeenVirtualGuide(storage?: Pick<Storage, 'getItem'> | null): boolean {
  try {
    const store = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
    return store?.getItem(GUIDE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markVirtualGuideSeen(storage?: Pick<Storage, 'setItem'> | null): void {
  try {
    const store = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
    store?.setItem(GUIDE_STORAGE_KEY, 'true');
  } catch {
    // Ignore storage access errors in restricted privacy contexts
  }
}

export function getSessionSelectedVoiceUri(storage?: Pick<Storage, 'getItem'> | null): string {
  try {
    const store = storage ?? (typeof window !== 'undefined' ? window.sessionStorage : null);
    return store?.getItem(GUIDE_VOICE_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

export function setSessionSelectedVoiceUri(
  voiceUri: string,
  storage?: Pick<Storage, 'setItem' | 'removeItem'> | null,
): void {
  try {
    const store = storage ?? (typeof window !== 'undefined' ? window.sessionStorage : null);
    if (!store) return;
    if (voiceUri) {
      store.setItem(GUIDE_VOICE_STORAGE_KEY, voiceUri);
    } else {
      store.removeItem(GUIDE_VOICE_STORAGE_KEY);
    }
  } catch {
    // Ignore storage access errors in restricted privacy contexts
  }
}

export interface VoiceChoiceLike {
  voiceURI: string;
  name: string;
  lang: string;
  localService?: boolean;
}

export const SYSTEM_DEFAULT_VOICE_URI = '__system_default__';

export function selectPreferredVoiceUri(
  voices: readonly VoiceChoiceLike[],
  preferredOrSavedUri?: string,
): string {
  if (preferredOrSavedUri === SYSTEM_DEFAULT_VOICE_URI) {
    return SYSTEM_DEFAULT_VOICE_URI;
  }
  if (voices.length === 0) return preferredOrSavedUri ?? '';
  if (preferredOrSavedUri && voices.some((v) => v.voiceURI === preferredOrSavedUri)) {
    return preferredOrSavedUri;
  }
  const preferred =
    // Local OS English voices speak reliably on mobile (Android/iOS) without network stalls
    voices.find(
      (v) =>
        v.localService === true &&
        v.lang.toLowerCase().startsWith('en') &&
        /natural|samantha|daniel|karen|serena|arthur|aria|guy|enhanced/i.test(v.name),
    ) ??
    voices.find((v) => v.localService === true && v.lang.toLowerCase() === 'en-us') ??
    voices.find((v) => v.localService === true && v.lang.toLowerCase().startsWith('en')) ??
    voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('en') &&
        /natural|google|samantha|daniel|aria|guy/i.test(v.name),
    ) ??
    voices.find((v) => v.lang.toLowerCase().startsWith('en')) ??
    voices.find((v) => v.localService === true) ??
    voices[0];
  return preferred?.voiceURI ?? '';
}

export function findFallbackVoice<T extends VoiceChoiceLike>(
  voices: readonly T[],
  failedVoiceUri?: string,
): T | undefined {
  if (voices.length === 0) return undefined;
  const candidates = failedVoiceUri
    ? voices.filter((v) => v.voiceURI !== failedVoiceUri)
    : [...voices];
  const pool = candidates.length > 0 ? candidates : voices;
  return (
    pool.find((v) => v.localService === true && v.lang.toLowerCase() === 'en-us') ??
    pool.find((v) => v.localService === true && v.lang.toLowerCase().startsWith('en')) ??
    pool.find((v) => v.lang.toLowerCase().startsWith('en')) ??
    pool.find((v) => v.localService === true) ??
    pool[0]
  );
}

export type SpeechFallbackStage = 0 | 1 | 2;

/**
 * Resolves the next SpeechSynthesis recovery stage when a voice errors or stalls silently:
 * Stage 0 (selected/preferred voice) -> Stage 1 (alternate local English voice) -> Stage 2 (OS default, voice unset) -> null.
 */
export function resolveNextSpeechFallbackStage<T extends VoiceChoiceLike>(
  currentStage: SpeechFallbackStage,
  voices: readonly T[],
  currentVoiceUri?: string,
): { nextStage: SpeechFallbackStage | null; voice: T | undefined } {
  if (currentStage === 0) {
    const alternate = findFallbackVoice(voices, currentVoiceUri);
    if (alternate && alternate.voiceURI !== currentVoiceUri) {
      return { nextStage: 1, voice: alternate };
    }
    return { nextStage: 2, voice: undefined };
  }
  if (currentStage === 1) {
    return { nextStage: 2, voice: undefined };
  }
  return { nextStage: null, voice: undefined };
}

/**
 * Unlocks mobile (iOS Safari / Android Chrome) audio output cleanly on user gesture
 * using a silent 1-sample Web Audio buffer before triggering SpeechSynthesis.
 */
export function primeBrowserAudioOutput(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      void ctx.resume().catch(() => {});
    }
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
    window.setTimeout(() => {
      void ctx.close().catch(() => {});
    }, 150);
  } catch {
    // Ignore audio context restrictions cleanly
  }
}

/**
 * Splits multi-sentence guide narration into short chunks to prevent Chromium's
 * ~15-second SpeechSynthesis cutoff on laptop and stalling on mobile engines,
 * while preserving abbreviations (B.Sc.), decimals (5.00, 3.0), and email addresses.
 */
export function splitNarrationIntoChunks(text: string): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];

  const chunks: string[] = [];
  let start = 0;

  for (let i = 0; i < normalized.length; i += 1) {
    const ch = normalized[i];
    if (ch !== '.' && ch !== '!' && ch !== '?') continue;

    const prev = i > 0 ? normalized[i - 1] : '';
    const next = i + 1 < normalized.length ? normalized[i + 1] : '';
    const afterSpace = i + 2 < normalized.length ? normalized[i + 2] : '';

    // Do not split inside decimal numbers (e.g. 5.00, 3.0), emails, or B.Sc.
    if (ch === '.' && /\d/.test(prev) && /\d/.test(next)) continue;
    if (ch === '.' && /[a-z]/i.test(next)) continue;

    const sliceToHere = normalized.slice(start, i + 1);
    if (/(?:^|\s)(?:B\.Sc|Govt|Dr|Mr|Ms|Prof|St|No)\.$/i.test(sliceToHere)) continue;

    if (next === ' ' && /[A-Z0-9"“'(]/.test(afterSpace)) {
      const part = sliceToHere.trim();
      if (part) chunks.push(part);
      start = i + 2;
    }
  }

  const tail = normalized.slice(start).trim();
  if (tail) chunks.push(tail);
  return chunks.length > 0 ? chunks : [normalized];
}

export function getActiveGuideNarrationText(
  mode: 'intro' | 'tour' | 'minimized',
  step: Pick<VirtualGuideStep, 'speech'>,
): string {
  if (mode === 'intro') return GUIDE_INTRO_MESSAGE;
  if (mode === 'tour') return step.speech;
  return '';
}

export function computeGuideProgressPercent(
  stepIndex: number,
  total = VIRTUAL_GUIDE_TOUR_STEPS.length,
): number {
  if (total <= 0) return 0;
  const clamped = clampGuideStepIndex(stepIndex, total);
  return Math.round(((clamped + 1) / total) * 100);
}

export function shouldRenderCompactLauncher(
  isOnHome: boolean,
  hasCollapsedInSession: boolean,
): boolean {
  return !isOnHome || hasCollapsedInSession;
}

const readyPortraitUrls = new Set<string>();
const pendingPortraitPromises = new Map<string, Promise<boolean>>();

export function isPortraitPreloaded(src: string): boolean {
  return readyPortraitUrls.has(src);
}

export function resetPortraitPreloadCacheForTest(): void {
  readyPortraitUrls.clear();
  pendingPortraitPromises.clear();
}

export interface PreloadLinkLike {
  setAttribute(name: string, value: string): void;
  getAttribute(name: string): string | null;
}

export interface PreloadDocLike {
  head?: {
    querySelector(selector: string): PreloadLinkLike | null;
    appendChild(node: PreloadLinkLike): void;
  } | null;
  createElement(tagName: string): PreloadLinkLike;
}

export function ensurePortraitPreloadLink(
  src: string,
  doc?: PreloadDocLike | null,
): PreloadLinkLike | null {
  if (!src) return null;
  const targetDoc: PreloadDocLike | null =
    doc !== undefined
      ? doc
      : typeof document !== 'undefined'
        ? (document as unknown as PreloadDocLike)
        : null;
  if (!targetDoc?.head) return null;

  const existing = targetDoc.head.querySelector(
    'link[rel="preload"][as="image"][data-guide-portrait-preload="true"]',
  );
  if (existing) {
    if (existing.getAttribute('href') !== src) {
      existing.setAttribute('href', src);
    }
    return existing;
  }

  const link = targetDoc.createElement('link');
  link.setAttribute('rel', 'preload');
  link.setAttribute('as', 'image');
  link.setAttribute('href', src);
  link.setAttribute('fetchpriority', 'high');
  link.setAttribute('referrerpolicy', 'no-referrer');
  link.setAttribute('data-guide-portrait-preload', 'true');
  targetDoc.head.appendChild(link);
  return link;
}

export interface PreloadImageLike {
  decoding: string;
  referrerPolicy: string;
  complete: boolean;
  naturalWidth: number;
  src: string;
  onload: (() => void) | null;
  onerror: (() => void) | null;
  decode?: () => Promise<void>;
  setAttribute?: (name: string, value: string) => void;
}

export function preloadPortraitAsset(
  src: string,
  options?: {
    doc?: PreloadDocLike | null;
    ImageCtor?: (new () => PreloadImageLike) | null;
  },
): Promise<boolean> {
  if (!src) return Promise.resolve(false);

  ensurePortraitPreloadLink(src, options?.doc);

  if (readyPortraitUrls.has(src)) {
    return Promise.resolve(true);
  }

  const existingPromise = pendingPortraitPromises.get(src);
  if (existingPromise) {
    return existingPromise;
  }

  const Img =
    options?.ImageCtor === undefined
      ? typeof window !== 'undefined'
        ? (window.Image as unknown as new () => PreloadImageLike)
        : null
      : options.ImageCtor;

  if (!Img) {
    return Promise.resolve(false);
  }

  const promise = new Promise<boolean>((resolve) => {
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      if (ok) {
        readyPortraitUrls.add(src);
      }
      pendingPortraitPromises.delete(src);
      resolve(ok);
    };

    try {
      const img = new Img();
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.setAttribute?.('fetchpriority', 'high');

      img.onload = () => {
        if (typeof img.decode === 'function') {
          img.decode().then(() => finish(true)).catch(() => finish(true));
        } else {
          finish(true);
        }
      };
      img.onerror = () => finish(false);
      img.src = src;

      if (img.complete && img.naturalWidth > 0) {
        if (typeof img.decode === 'function') {
          img.decode().then(() => finish(true)).catch(() => finish(true));
        } else {
          finish(true);
        }
      }
    } catch {
      finish(false);
    }
  });

  pendingPortraitPromises.set(src, promise);
  return promise;
}
