import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampGuideStepIndex,
  computeParallaxTilt,
  ensurePortraitPreloadLink,
  getActiveGuideNarrationText,
  getNextGuideStepIndex,
  getPrevGuideStepIndex,
  getSessionSelectedVoiceUri,
  GUIDE_INTRO_MESSAGE,
  GUIDE_PORTRAIT_ASSET,
  GUIDE_STORAGE_KEY,
  GUIDE_VOICE_STORAGE_KEY,
  hasSeenVirtualGuide,
  isPortraitPreloaded,
  markVirtualGuideSeen,
  preloadPortraitAsset,
  resetPortraitPreloadCacheForTest,
  resolvePublicAssetUrl,
  selectPreferredVoiceUri,
  setSessionSelectedVoiceUri,
  VIRTUAL_GUIDE_TOUR_STEPS,
  type PreloadImageLike,
  type PreloadLinkLike,
} from './virtualGuide';

test('virtual guide defines greeting, authoritative photo asset, and all 8 requested tour sections', () => {
  assert.equal(
    GUIDE_INTRO_MESSAGE,
    "Hello! I'm Ibtashamur Rahman. Welcome to my portfolio. Let me show you what I've been working on.",
  );
  assert.equal(
    GUIDE_PORTRAIT_ASSET,
    '/assets/aistudio/WhatsApp_Image_2026-09-14_at_6.44.42_PM_9eca5786.jpeg',
  );
  assert.deepEqual(
    VIRTUAL_GUIDE_TOUR_STEPS.map((step) => step.sectionId),
    ['about', 'projects', 'research', 'innovation', 'experience', 'awards', 'skills', 'contact'],
  );
  for (const step of VIRTUAL_GUIDE_TOUR_STEPS) {
    assert.ok(step.speech.length > 40, `Step ${step.id} speech should be informative`);
    assert.ok(step.route.startsWith('/'), `Step ${step.id} route must start with /`);
  }
});

test('resolvePublicAssetUrl adapts cleanly to root and GitHub Pages subpath base URLs', async () => {
  const { HOLOGRAM_PORTRAIT_ASSET } = await import('./virtualGuide');
  assert.equal(
    resolvePublicAssetUrl('/assets/portrait-card.webp', '/'),
    '/assets/portrait-card.webp',
  );
  assert.equal(
    resolvePublicAssetUrl('/assets/aistudio/WhatsApp_Image_2026-09-14_at_6.44.42_PM_9eca5786.jpeg', '/ibtasham-portfolio/'),
    '/ibtasham-portfolio/assets/aistudio/WhatsApp_Image_2026-09-14_at_6.44.42_PM_9eca5786.jpeg',
  );
  assert.equal(
    resolvePublicAssetUrl(HOLOGRAM_PORTRAIT_ASSET, '/ibtasham-portfolio/'),
    '/ibtasham-portfolio/assets/aistudio/file_00000000ed0c820bb2e3dcfedb05bedd_08a4aca0.png',
  );
  assert.equal(
    resolvePublicAssetUrl('assets/MD_Ibtashamur_Rahman_CV.pdf', '/repo'),
    '/repo/assets/MD_Ibtashamur_Rahman_CV.pdf',
  );
  assert.equal(
    resolvePublicAssetUrl('https://github.com/Ibtasham', '/repo/'),
    'https://github.com/Ibtasham',
  );
});

test('guided tour step helpers clamp indices and signal completion at final step', () => {
  assert.equal(clampGuideStepIndex(-3), 0);
  assert.equal(clampGuideStepIndex(99), 7);
  assert.equal(getPrevGuideStepIndex(0), 0);
  assert.equal(getPrevGuideStepIndex(4), 3);
  assert.equal(getNextGuideStepIndex(0), 1);
  assert.equal(getNextGuideStepIndex(6), 7);
  assert.equal(getNextGuideStepIndex(7), null);
});

test('computeParallaxTilt keeps rotation and depth translation subtle and respects reduced motion', () => {
  const active = computeParallaxTilt(1, -1, false);
  assert.equal(active.rotateY, 4.5);
  assert.equal(active.rotateX, 4.5);
  assert.equal(active.shiftX, 4);
  assert.equal(active.shiftY, -3);

  const over = computeParallaxTilt(10, -10, false);
  assert.equal(over.rotateY, 4.5);
  assert.equal(over.rotateX, 4.5);

  const reduced = computeParallaxTilt(1, -1, true);
  assert.deepEqual(reduced, { rotateX: 0, rotateY: 0, shiftX: 0, shiftY: 0 });
});

test('hasSeenVirtualGuide and markVirtualGuideSeen handle storage persistence safely', () => {
  const memory = new Map<string, string>();
  const mockStorage = {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, val: string) => {
      memory.set(key, val);
    },
  };

  assert.equal(hasSeenVirtualGuide(mockStorage), false);
  markVirtualGuideSeen(mockStorage);
  assert.equal(memory.get(GUIDE_STORAGE_KEY), 'true');
  assert.equal(hasSeenVirtualGuide(mockStorage), true);

  const failingStorage = {
    getItem: () => {
      throw new Error('blocked');
    },
    setItem: () => {
      throw new Error('blocked');
    },
  };
  assert.equal(hasSeenVirtualGuide(failingStorage), false);
  markVirtualGuideSeen(failingStorage);
});

test('portrait preload helpers inject single preload link, decode image once, and handle SSR safely', async () => {
  resetPortraitPreloadCacheForTest();

  assert.equal(ensurePortraitPreloadLink('/assets/test.jpg', null), null);
  assert.equal(await preloadPortraitAsset('/assets/test.jpg', { doc: null, ImageCtor: null }), false);

  const appendedLinks: Array<PreloadLinkLike & { attrs: Record<string, string> }> = [];
  const mockDoc = {
    head: {
      querySelector: (selector: string) => {
        if (selector.includes('data-guide-portrait-preload')) {
          return appendedLinks[0] ?? null;
        }
        return null;
      },
      appendChild: (node: PreloadLinkLike) => {
        appendedLinks.push(node as PreloadLinkLike & { attrs: Record<string, string> });
      },
    },
    createElement: () => {
      const attrs: Record<string, string> = {};
      const node: PreloadLinkLike & { attrs: Record<string, string> } = {
        attrs,
        setAttribute: (k: string, v: string) => {
          attrs[k] = v;
        },
        getAttribute: (k: string) => attrs[k] ?? null,
      };
      return node;
    },
  };

  let createdCount = 0;
  let decodeCount = 0;
  class MockImage implements PreloadImageLike {
    decoding = '';
    referrerPolicy = '';
    complete = false;
    naturalWidth = 0;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    private _src = '';

    constructor() {
      createdCount += 1;
    }

    get src() {
      return this._src;
    }

    set src(value: string) {
      this._src = value;
      queueMicrotask(() => {
        this.complete = true;
        this.naturalWidth = 960;
        this.onload?.();
      });
    }

    async decode() {
      decodeCount += 1;
    }
  }

  const assetUrl = resolvePublicAssetUrl(GUIDE_PORTRAIT_ASSET, '/');
  const [first, second] = await Promise.all([
    preloadPortraitAsset(assetUrl, { doc: mockDoc, ImageCtor: MockImage }),
    preloadPortraitAsset(assetUrl, { doc: mockDoc, ImageCtor: MockImage }),
  ]);

  assert.equal(first, true);
  assert.equal(second, true);
  assert.equal(createdCount, 1);
  assert.equal(decodeCount, 1);
  assert.equal(isPortraitPreloaded(assetUrl), true);
  assert.equal(appendedLinks.length, 1);
  assert.equal(appendedLinks[0]?.getAttribute('rel'), 'preload');
  assert.equal(appendedLinks[0]?.getAttribute('as'), 'image');
  assert.equal(appendedLinks[0]?.getAttribute('fetchpriority'), 'high');
  assert.equal(appendedLinks[0]?.getAttribute('href'), assetUrl);

  // Subsequent call resolves from memory without constructing a new Image or duplicate <link>
  assert.equal(await preloadPortraitAsset(assetUrl, { doc: mockDoc, ImageCtor: MockImage }), true);
  assert.equal(createdCount, 1);
  assert.equal(appendedLinks.length, 1);
});

test('session voice helpers remember selected voice safely and selectPreferredVoiceUri preserves it', () => {
  const sessionMap = new Map<string, string>();
  const mockSessionStorage = {
    getItem: (key: string) => sessionMap.get(key) ?? null,
    setItem: (key: string, val: string) => {
      sessionMap.set(key, val);
    },
    removeItem: (key: string) => {
      sessionMap.delete(key);
    },
  };

  assert.equal(getSessionSelectedVoiceUri(mockSessionStorage), '');
  setSessionSelectedVoiceUri('voice-custom-en', mockSessionStorage);
  assert.equal(sessionMap.get(GUIDE_VOICE_STORAGE_KEY), 'voice-custom-en');
  assert.equal(getSessionSelectedVoiceUri(mockSessionStorage), 'voice-custom-en');

  const sampleVoices = [
    { voiceURI: 'voice-fr', name: 'Thomas', lang: 'fr-FR' },
    { voiceURI: 'voice-en-basic', name: 'English Basic', lang: 'en-US' },
    { voiceURI: 'voice-en-natural', name: 'Microsoft Guy Online (Natural)', lang: 'en-US' },
    { voiceURI: 'voice-custom-en', name: 'Custom English', lang: 'en-GB' },
  ];

  assert.equal(
    selectPreferredVoiceUri(sampleVoices, getSessionSelectedVoiceUri(mockSessionStorage)),
    'voice-custom-en',
  );
  assert.equal(
    selectPreferredVoiceUri(sampleVoices, 'non-existent-voice'),
    'voice-en-natural',
  );
  assert.equal(selectPreferredVoiceUri([], 'voice-custom-en'), 'voice-custom-en');

  setSessionSelectedVoiceUri('', mockSessionStorage);
  assert.equal(getSessionSelectedVoiceUri(mockSessionStorage), '');
});

test('getActiveGuideNarrationText keeps spoken text synchronized with intro or active tour step', () => {
  const step3 = VIRTUAL_GUIDE_TOUR_STEPS[2];
  assert.equal(getActiveGuideNarrationText('intro', step3), GUIDE_INTRO_MESSAGE);
  assert.equal(getActiveGuideNarrationText('tour', step3), step3.speech);
  assert.equal(getActiveGuideNarrationText('minimized', step3), '');
});

test('isGuideHomePath matches main and experimental homepages cleanly', async () => {
  const mod = await import('./virtualGuide');
  assert.equal(mod.isGuideHomePath('/'), true);
  assert.equal(mod.isGuideHomePath('/home-v2'), true);
  assert.equal(mod.isGuideHomePath('/projects'), false);
  assert.equal(mod.isGuideHomePath('/studio'), false);
  assert.equal(mod.isGuideHomePath(''), false);
  assert.equal(mod.PORTFOLIO_GUIDE_OPEN_EVENT, 'portfolio-virtual-guide:open');
});

test('computeGuideProgressPercent and shouldRenderCompactLauncher calculate assistant UI states accurately', async () => {
  const mod = await import('./virtualGuide');
  assert.equal(mod.computeGuideProgressPercent(0, 8), 13);
  assert.equal(mod.computeGuideProgressPercent(3, 8), 50);
  assert.equal(mod.computeGuideProgressPercent(7, 8), 100);
  assert.equal(mod.computeGuideProgressPercent(99, 8), 100);
  assert.equal(mod.computeGuideProgressPercent(0, 0), 0);

  assert.equal(mod.shouldRenderCompactLauncher(true, false), false);
  assert.equal(mod.shouldRenderCompactLauncher(true, true), true);
  assert.equal(mod.shouldRenderCompactLauncher(false, false), true);
  assert.equal(mod.shouldRenderCompactLauncher(false, true), true);
});

test('splitNarrationIntoChunks splits multi-sentence text cleanly without breaking decimals, emails, or B.Sc.', async () => {
  const { splitNarrationIntoChunks } = await import('./virtualGuide');

  assert.deepEqual(splitNarrationIntoChunks(''), []);
  assert.deepEqual(splitNarrationIntoChunks(GUIDE_INTRO_MESSAGE), [
    "Hello!",
    "I'm Ibtashamur Rahman.",
    "Welcome to my portfolio.",
    "Let me show you what I've been working on.",
  ]);

  const aboutChunks = splitNarrationIntoChunks(VIRTUAL_GUIDE_TOUR_STEPS[0].speech);
  assert.equal(aboutChunks.length, 2);
  assert.ok(aboutChunks[1]?.includes('GPA 5.00'));
  assert.ok(aboutChunks[1]?.includes('Govt. Talent Pool Scholarship'));

  const contactChunks = splitNarrationIntoChunks(VIRTUAL_GUIDE_TOUR_STEPS[7].speech);
  assert.equal(contactChunks.length, 2);
  assert.ok(contactChunks[1]?.includes('ibtarahman@gmail.com'));

  const innovationChunks = splitNarrationIntoChunks(VIRTUAL_GUIDE_TOUR_STEPS[3].speech);
  assert.equal(innovationChunks.length, 1);
  assert.ok(innovationChunks[0]?.includes('Innovesta 3.0'));
  assert.ok(innovationChunks[0]?.includes('Case Quest 2.0'));

  const degreeTest = splitNarrationIntoChunks('He studies B.Sc. IPE at SUST. Next sentence follows.');
  assert.deepEqual(degreeTest, [
    'He studies B.Sc. IPE at SUST.',
    'Next sentence follows.',
  ]);
});

test('findFallbackVoice prioritizes local English voices when a primary or remote voice fails', async () => {
  const { findFallbackVoice } = await import('./virtualGuide');

  const voices = [
    { voiceURI: 'remote-en', name: 'Google US English', lang: 'en-US', localService: false },
    { voiceURI: 'local-fr', name: 'Amelie', lang: 'fr-FR', localService: true },
    { voiceURI: 'local-en', name: 'Daniel', lang: 'en-GB', localService: true },
  ];

  assert.equal(findFallbackVoice(voices, 'remote-en')?.voiceURI, 'local-en');
  assert.equal(findFallbackVoice(voices, 'local-en')?.voiceURI, 'remote-en');
  assert.equal(findFallbackVoice([], 'remote-en'), undefined);
});

test('computeHeroPortrait25DParallax bounds tilt, maps cursor light coordinates, and respects reduced motion', async () => {
  const { computeHeroPortrait25DParallax } = await import('./virtualGuide');

  const center = computeHeroPortrait25DParallax(0, 0, false);
  assert.equal(center.rotateX, 0);
  assert.equal(center.rotateY, 0);
  assert.equal(center.parallaxX, 0);
  assert.equal(center.parallaxY, 0);
  assert.equal(center.lightXPercent, 50);
  assert.equal(center.lightYPercent, 45);

  const clamped = computeHeroPortrait25DParallax(5, -5, false);
  assert.equal(clamped.rotateY, 7.5);
  assert.equal(clamped.rotateX, 7.5);
  assert.equal(clamped.parallaxX, 1);
  assert.equal(clamped.parallaxY, -1);
  assert.equal(clamped.lightXPercent, 88);
  assert.equal(clamped.lightYPercent, 11);

  const disabled = computeHeroPortrait25DParallax(0.8, -0.5, true);
  assert.deepEqual(disabled, {
    rotateX: 0,
    rotateY: 0,
    parallaxX: 0,
    parallaxY: 0,
    lightXPercent: 50,
    lightYPercent: 32,
  });
});

test('selectPreferredVoiceUri prefers localService English voices for mobile reliability and preserves SYSTEM_DEFAULT_VOICE_URI', async () => {
  const { SYSTEM_DEFAULT_VOICE_URI } = await import('./virtualGuide');

  const mixedVoices = [
    { voiceURI: 'cloud-en', name: 'Google US English', lang: 'en-US', localService: false },
    { voiceURI: 'local-en-us', name: 'English United States', lang: 'en-US', localService: true },
    { voiceURI: 'local-en-nat', name: 'Samantha', lang: 'en-US', localService: true },
  ];

  assert.equal(selectPreferredVoiceUri(mixedVoices), 'local-en-nat');
  assert.equal(
    selectPreferredVoiceUri(mixedVoices, SYSTEM_DEFAULT_VOICE_URI),
    SYSTEM_DEFAULT_VOICE_URI,
  );
  assert.equal(
    selectPreferredVoiceUri([], SYSTEM_DEFAULT_VOICE_URI),
    SYSTEM_DEFAULT_VOICE_URI,
  );
});

test('resolveNextSpeechFallbackStage steps cleanly from failed voice to alternate local voice to OS default', async () => {
  const { resolveNextSpeechFallbackStage } = await import('./virtualGuide');

  const voices = [
    { voiceURI: 'cloud-en', name: 'Google US English', lang: 'en-US', localService: false },
    { voiceURI: 'local-en', name: 'Daniel', lang: 'en-GB', localService: true },
  ];

  const step1 = resolveNextSpeechFallbackStage(0, voices, 'cloud-en');
  assert.equal(step1.nextStage, 1);
  assert.equal(step1.voice?.voiceURI, 'local-en');

  const step2 = resolveNextSpeechFallbackStage(1, voices, 'local-en');
  assert.equal(step2.nextStage, 2);
  assert.equal(step2.voice, undefined);

  const step3 = resolveNextSpeechFallbackStage(2, voices, undefined);
  assert.equal(step3.nextStage, null);
  assert.equal(step3.voice, undefined);

  // When only one broken voice exists, skip directly from Stage 0 to Stage 2 OS default
  const singleVoice = [{ voiceURI: 'only-voice', name: 'Broken', lang: 'en-US', localService: false }];
  const directDefault = resolveNextSpeechFallbackStage(0, singleVoice, 'only-voice');
  assert.equal(directDefault.nextStage, 2);
  assert.equal(directDefault.voice, undefined);
});

test('primeBrowserAudioOutput fails gracefully in SSR and headless Node contexts', async () => {
  const { primeBrowserAudioOutput } = await import('./virtualGuide');
  assert.doesNotThrow(() => {
    primeBrowserAudioOutput();
  });
});

