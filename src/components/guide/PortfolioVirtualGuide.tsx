import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  ExternalLink,
  RefreshCw,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import {
  clampGuideStepIndex,
  computeGuideProgressPercent,
  getActiveGuideNarrationText,
  getNextGuideStepIndex,
  getPrevGuideStepIndex,
  getSessionSelectedVoiceUri,
  GUIDE_INTRO_MESSAGE,
  GUIDE_PORTRAIT_ASSET,
  hasSeenVirtualGuide,
  isGuideHomePath,
  isPortraitPreloaded,
  markVirtualGuideSeen,
  type OpenVirtualGuideDetail,
  PORTFOLIO_GUIDE_OPEN_EVENT,
  preloadPortraitAsset,
  primeBrowserAudioOutput,
  resolveNextSpeechFallbackStage,
  resolvePublicAssetUrl,
  selectPreferredVoiceUri,
  setSessionSelectedVoiceUri,
  shouldRenderCompactLauncher,
  type SpeechFallbackStage,
  splitNarrationIntoChunks,
  SYSTEM_DEFAULT_VOICE_URI,
  VIRTUAL_GUIDE_TOUR_STEPS,
} from '../../utils/virtualGuide';
import { PortraitCharacter25D } from './PortraitCharacter25D';

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  void preloadPortraitAsset(resolvePublicAssetUrl(GUIDE_PORTRAIT_ASSET), { doc: null });
}

type GuideMode = 'intro' | 'tour' | 'minimized';

function clearSectionHighlights() {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('.guide-tour-highlight').forEach((el) => {
    el.classList.remove('guide-tour-highlight');
  });
}

export function PortfolioVirtualGuide() {
  const navigate = useNavigate();
  const location = useLocation();
  const { prefersReducedMotion } = useMotionPreference();

  const isOnHome = isGuideHomePath(location.pathname);

  const [mode, setMode] = useState<GuideMode>(() =>
    isGuideHomePath(location.pathname) || hasSeenVirtualGuide() ? 'minimized' : 'intro',
  );
  const [hasCollapsedInSession, setHasCollapsedInSession] = useState(false);
  const [resumeTarget, setResumeTarget] = useState<'intro' | 'tour'>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [scrollTriggerNonce, setScrollTriggerNonce] = useState(0);
  const [narrationTriggerNonce, setNarrationTriggerNonce] = useState(0);

  // Voice synthesis state — activates on explicit user gesture unless muted by visitor
  const speechSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance !== 'undefined';

  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>(() =>
    getSessionSelectedVoiceUri(),
  );

  const selectedVoiceUriRef = useRef(selectedVoiceUri);
  selectedVoiceUriRef.current = selectedVoiceUri;

  const userMutedRef = useRef(false);
  const utteranceIdRef = useRef(0);
  const activeUtterancesRef = useRef<Set<SpeechSynthesisUtterance>>(new Set());
  const chromeRetryTimerRef = useRef<number | null>(null);
  const watchdogTimerRef = useRef<number | null>(null);
  const lastSpokenSyncKeyRef = useRef<string | null>(null);
  const launcherBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const lastScrolledNonceRef = useRef<number>(-1);
  const prevPathnameRef = useRef(location.pathname);

  const safeStepIndex = clampGuideStepIndex(stepIndex);
  const currentStep = VIRTUAL_GUIDE_TOUR_STEPS[safeStepIndex];
  const portraitAssetSrc = resolvePublicAssetUrl(GUIDE_PORTRAIT_ASSET);
  const [isPortraitReady, setIsPortraitReady] = useState<boolean>(() =>
    isPortraitPreloaded(portraitAssetSrc),
  );

  useEffect(() => {
    if (isPortraitReady) return;
    let cancelled = false;
    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled) {
        setIsPortraitReady(true);
      }
    }, 1200);

    void preloadPortraitAsset(portraitAssetSrc, { doc: null }).then(() => {
      if (!cancelled) {
        window.clearTimeout(fallbackTimer);
        setIsPortraitReady(true);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
    };
  }, [isPortraitReady, portraitAssetSrc]);

  const prioritizedVoices = useMemo(() => {
    if (voices.length === 0) return [];
    const englishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
    return englishVoices.length > 0 ? englishVoices : voices;
  }, [voices]);

  const prioritizedVoicesRef = useRef(prioritizedVoices);
  prioritizedVoicesRef.current = prioritizedVoices;

  const clearSpeechTimers = useCallback(() => {
    if (chromeRetryTimerRef.current !== null) {
      window.clearTimeout(chromeRetryTimerRef.current);
      chromeRetryTimerRef.current = null;
    }
    if (watchdogTimerRef.current !== null) {
      window.clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
  }, []);

  const stopSpeech = useCallback(() => {
    utteranceIdRef.current += 1;
    clearSpeechTimers();
    activeUtterancesRef.current.clear();
    lastSpokenSyncKeyRef.current = null;
    if (!speechSupported) {
      setIsSpeaking(false);
      return;
    }
    try {
      const synth = window.speechSynthesis;
      if (synth.speaking || synth.pending || synth.paused) {
        synth.cancel();
      }
    } catch {
      // Ignore browser speech synthesis cancellation quirks
    }
    setIsSpeaking(false);
  }, [clearSpeechTimers, speechSupported]);

  const speakText = useCallback(
    (
      text: string,
      options?: {
        voiceUriOverride?: string;
        syncKey?: string;
      },
    ) => {
      if (!speechSupported || !text) return;
      const chunks = splitNarrationIntoChunks(text);
      if (chunks.length === 0) return;

      clearSpeechTimers();
      activeUtterancesRef.current.clear();
      setVoiceNotice(null);

      const myUtteranceId = utteranceIdRef.current + 1;
      utteranceIdRef.current = myUtteranceId;
      if (options?.syncKey) {
        lastSpokenSyncKeyRef.current = options.syncKey;
      }

      const synth = window.speechSynthesis;

      // Refresh lazy mobile voice lists synchronously inside user interaction
      let availableVoices = prioritizedVoicesRef.current;
      if (availableVoices.length === 0) {
        try {
          const fresh = synth.getVoices();
          if (fresh.length > 0) {
            setVoices(fresh);
            const en = fresh.filter((v) => v.lang.toLowerCase().startsWith('en'));
            availableVoices = en.length > 0 ? en : fresh;
            prioritizedVoicesRef.current = availableVoices;
          }
        } catch {
          // Proceed cleanly with OS system default voice + en-US lang
        }
      }

      const targetVoiceUri = options?.voiceUriOverride ?? selectedVoiceUriRef.current;
      const useSystemDefaultOnly = targetVoiceUri === SYSTEM_DEFAULT_VOICE_URI;
      const initialVoice = useSystemDefaultOnly
        ? undefined
        : availableVoices.find((v) => v.voiceURI === targetVoiceUri) ?? availableVoices[0];
      const initialStage: SpeechFallbackStage = initialVoice ? 0 : 2;

      let wasBusy = false;
      try {
        wasBusy = Boolean(synth.speaking || synth.pending || synth.paused);
        if (wasBusy) {
          synth.cancel();
        }
        if (synth.paused) {
          synth.resume();
        }
      } catch {
        // Ignore cancellation errors on restricted engines
      }

      const speakChunk = (
        chunkIndex: number,
        voiceToUse: SpeechSynthesisVoice | undefined,
        fallbackStage: SpeechFallbackStage,
        allowCancelDropRetry: boolean,
      ) => {
        if (utteranceIdRef.current !== myUtteranceId) return;
        const chunkText = chunks[chunkIndex];
        if (!chunkText) {
          clearSpeechTimers();
          activeUtterancesRef.current.clear();
          setIsSpeaking(false);
          return;
        }

        clearSpeechTimers();

        try {
          const utterance = new SpeechSynthesisUtterance(chunkText);
          utterance.lang = voiceToUse?.lang || 'en-US';
          utterance.volume = 1;
          utterance.rate = 1;
          utterance.pitch = 1;
          if (voiceToUse) {
            utterance.voice = voiceToUse;
          }

          // Retain utterance reference until settled so mobile JS engines do not GC mid-speech
          activeUtterancesRef.current.add(utterance);

          let chunkStarted = false;
          let chunkSettled = false;

          const escalateFallback = () => {
            if (chunkSettled || utteranceIdRef.current !== myUtteranceId) return;
            chunkSettled = true;
            clearSpeechTimers();
            activeUtterancesRef.current.delete(utterance);

            const next = resolveNextSpeechFallbackStage(
              fallbackStage,
              prioritizedVoicesRef.current,
              voiceToUse?.voiceURI,
            );
            if (next.nextStage !== null) {
              try {
                if (synth.speaking || synth.pending) {
                  synth.cancel();
                }
              } catch {
                // Ignore cancel errors during recovery
              }
              speakChunk(chunkIndex, next.voice, next.nextStage, false);
              return;
            }

            setIsSpeaking(false);
            setVoiceNotice(
              'No sound detected — turn up media volume, disable Silent Mode, or choose System Default and tap Replay.',
            );
          };

          utterance.onstart = () => {
            if (utteranceIdRef.current !== myUtteranceId || chunkSettled) return;
            chunkStarted = true;
            clearSpeechTimers();
            setVoiceNotice(null);
            setIsSpeaking(true);
          };

          utterance.onend = () => {
            activeUtterancesRef.current.delete(utterance);
            if (utteranceIdRef.current !== myUtteranceId || chunkSettled) return;
            chunkSettled = true;
            clearSpeechTimers();
            if (chunkIndex + 1 < chunks.length) {
              speakChunk(chunkIndex + 1, voiceToUse, fallbackStage, false);
            } else {
              setIsSpeaking(false);
            }
          };

          utterance.onerror = (event) => {
            activeUtterancesRef.current.delete(utterance);
            if (utteranceIdRef.current !== myUtteranceId || chunkSettled) return;
            const errCode = (event as SpeechSynthesisErrorEvent | undefined)?.error ?? '';
            if (errCode === 'canceled' || errCode === 'interrupted') {
              return;
            }
            escalateFallback();
          };

          if (synth.paused) {
            synth.resume();
          }
          // Call speak() synchronously in the gesture callstack so iOS/Android keep audio unlocked
          synth.speak(utterance);

          // Desktop Chromium occasional cancel()+speak() drop recovery without delaying initial gesture
          if (allowCancelDropRetry) {
            chromeRetryTimerRef.current = window.setTimeout(() => {
              chromeRetryTimerRef.current = null;
              if (
                utteranceIdRef.current === myUtteranceId &&
                !chunkStarted &&
                !chunkSettled &&
                !synth.speaking &&
                !synth.pending
              ) {
                try {
                  if (synth.paused) synth.resume();
                  synth.speak(utterance);
                } catch {
                  escalateFallback();
                }
              }
            }, 160);
          }

          // Mobile cloud-voice silent stall watchdog: recover automatically if voice stays silent
          watchdogTimerRef.current = window.setTimeout(() => {
            watchdogTimerRef.current = null;
            if (
              utteranceIdRef.current === myUtteranceId &&
              !chunkStarted &&
              !chunkSettled &&
              !synth.speaking
            ) {
              escalateFallback();
            }
          }, 1100);
        } catch {
          if (utteranceIdRef.current === myUtteranceId) {
            clearSpeechTimers();
            activeUtterancesRef.current.clear();
            setIsSpeaking(false);
          }
        }
      };

      speakChunk(0, initialVoice, initialStage, wasBusy);
    },
    [clearSpeechTimers, speechSupported],
  );

  // Populate available browser SpeechSynthesis voices across desktop and mobile engines
  useEffect(() => {
    if (!speechSupported) return;
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      try {
        const available = synth.getVoices();
        if (available.length === 0) return;
        setVoices(available);
        const currentOrSaved = selectedVoiceUriRef.current || getSessionSelectedVoiceUri();
        const resolved = selectPreferredVoiceUri(available, currentOrSaved);
        if (
          resolved &&
          resolved !== selectedVoiceUriRef.current &&
          !synth.speaking &&
          !synth.pending
        ) {
          setSelectedVoiceUri(resolved);
          setSessionSelectedVoiceUri(resolved);
        }
      } catch {
        // Ignore transient browser SpeechSynthesis access issues
      }
    };

    loadVoices();
    synth.addEventListener?.('voiceschanged', loadVoices);
    const prevOnVoicesChanged = synth.onvoiceschanged;
    synth.onvoiceschanged = loadVoices;

    // Mobile Chrome and iOS WebKit often populate OS voices asynchronously without firing early
    const retryTimers = [150, 500, 1400].map((delay) =>
      window.setTimeout(loadVoices, delay),
    );

    return () => {
      retryTimers.forEach((t) => window.clearTimeout(t));
      synth.removeEventListener?.('voiceschanged', loadVoices);
      if (synth.onvoiceschanged === loadVoices) {
        synth.onvoiceschanged = prevOnVoicesChanged ?? null;
      }
      stopSpeech();
    };
  }, [speechSupported, stopSpeech]);

  const activeNarrationText = useMemo(
    () => getActiveGuideNarrationText(mode, currentStep),
    [currentStep, mode],
  );

  // Synchronize narration with displayed text; skip re-triggering when user click already initiated synchronously
  useEffect(() => {
    if (!voiceEnabled || mode === 'minimized' || !activeNarrationText) {
      stopSpeech();
      return;
    }

    const syncKey = `${mode}:${currentStep.id}:${selectedVoiceUri}:${narrationTriggerNonce}`;
    if (lastSpokenSyncKeyRef.current === syncKey) {
      return;
    }

    speakText(activeNarrationText, { syncKey });
  }, [
    activeNarrationText,
    currentStep.id,
    mode,
    narrationTriggerNonce,
    selectedVoiceUri,
    speakText,
    stopSpeech,
    voiceEnabled,
  ]);

  // If the visitor uses normal site navigation away from a home view, pause the tour cleanly without interrupting navigation
  useEffect(() => {
    const prevPath = prevPathnameRef.current;
    prevPathnameRef.current = location.pathname;

    if (isGuideHomePath(prevPath) && !isGuideHomePath(location.pathname) && mode === 'tour') {
      stopSpeech();
      clearSectionHighlights();
      setResumeTarget('tour');
      setHasCollapsedInSession(true);
      setMode('minimized');
    }
  }, [location.pathname, mode, stopSpeech]);

  // Synchronize section highlight and smooth scroll when tour is active on '/' or '/home-v2'
  useEffect(() => {
    if (mode !== 'tour' || !isGuideHomePath(location.pathname)) {
      clearSectionHighlights();
      return;
    }

    const sectionId = currentStep.sectionId;
    const currentScrollNonce = scrollTriggerNonce;
    let cancelled = false;
    let rafId: number | null = null;
    let attemptCount = 0;

    const applyHighlightAndScroll = () => {
      if (cancelled) return false;
      const target = document.getElementById(sectionId);
      if (!target) return false;

      clearSectionHighlights();
      target.classList.add('guide-tour-highlight');

      if (lastScrolledNonceRef.current !== currentScrollNonce) {
        lastScrolledNonceRef.current = currentScrollNonce;
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
      return true;
    };

    const tick = () => {
      if (cancelled) return;
      const found = applyHighlightAndScroll();
      if (!found && attemptCount < 45) {
        attemptCount += 1;
        rafId = window.requestAnimationFrame(tick);
      }
    };

    tick();

    // Keep highlight attached and scroll aligned when Suspense replaces a SectionBandFallback
    const mainEl = document.getElementById('main-content');
    const observer =
      mainEl && typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => {
            const target = document.getElementById(sectionId);
            if (target && !target.classList.contains('guide-tour-highlight')) {
              clearSectionHighlights();
              target.classList.add('guide-tour-highlight');
              target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start',
              });
            }
          })
        : null;

    if (observer && mainEl) {
      observer.observe(mainEl, { childList: true, subtree: true });
    }

    return () => {
      cancelled = true;
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [currentStep.sectionId, location.pathname, mode, prefersReducedMotion, scrollTriggerNonce]);

  // Clean up section highlight and speech if guide unmounts cleanly
  useEffect(() => {
    return () => {
      clearSectionHighlights();
      stopSpeech();
    };
  }, [stopSpeech]);

  const handleStartTour = useCallback(() => {
    markVirtualGuideSeen();
    const firstStep = VIRTUAL_GUIDE_TOUR_STEPS[0];
    const nextNonce = narrationTriggerNonce + 1;
    const shouldSpeak = !userMutedRef.current;

    setStepIndex(0);
    setResumeTarget('tour');
    setScrollTriggerNonce((n) => n + 1);
    setNarrationTriggerNonce(nextNonce);
    setMode('tour');

    if (shouldSpeak && speechSupported && firstStep) {
      primeBrowserAudioOutput();
      if (!voiceEnabled) {
        setVoiceEnabled(true);
      }
      speakText(firstStep.speech, {
        syncKey: `tour:${firstStep.id}:${selectedVoiceUri}:${nextNonce}`,
      });
    } else {
      stopSpeech();
    }

    if (!isGuideHomePath(location.pathname)) {
      navigate('/');
    }
    window.requestAnimationFrame(() => {
      panelRef.current?.focus({ preventScroll: true });
    });
  }, [
    location.pathname,
    narrationTriggerNonce,
    navigate,
    selectedVoiceUri,
    speakText,
    speechSupported,
    stopSpeech,
    voiceEnabled,
  ]);

  const handleRestartTour = () => {
    markVirtualGuideSeen();
    const firstStep = VIRTUAL_GUIDE_TOUR_STEPS[0];
    const nextNonce = narrationTriggerNonce + 1;
    const shouldSpeak = !userMutedRef.current;

    setStepIndex(0);
    setResumeTarget('tour');
    setScrollTriggerNonce((n) => n + 1);
    setNarrationTriggerNonce(nextNonce);
    setMode('tour');

    if (shouldSpeak && speechSupported && firstStep) {
      primeBrowserAudioOutput();
      if (!voiceEnabled) {
        setVoiceEnabled(true);
      }
      speakText(firstStep.speech, {
        syncKey: `tour:${firstStep.id}:${selectedVoiceUri}:${nextNonce}`,
      });
    } else {
      stopSpeech();
    }

    if (!isGuideHomePath(location.pathname)) {
      navigate('/');
    }
    window.requestAnimationFrame(() => {
      panelRef.current?.focus({ preventScroll: true });
    });
  };

  const handleExploreYourself = () => {
    markVirtualGuideSeen();
    stopSpeech();
    clearSectionHighlights();
    setStepIndex(0);
    setResumeTarget('intro');
    setHasCollapsedInSession(true);
    setMode('minimized');
  };

  const handleMinimize = () => {
    markVirtualGuideSeen();
    stopSpeech();
    setResumeTarget(mode === 'tour' ? 'tour' : 'intro');
    clearSectionHighlights();
    setHasCollapsedInSession(true);
    setMode('minimized');
    window.requestAnimationFrame(() => {
      launcherBtnRef.current?.focus({ preventScroll: true });
    });
  };

  const handleSkipTour = () => {
    markVirtualGuideSeen();
    stopSpeech();
    clearSectionHighlights();
    setStepIndex(0);
    setResumeTarget('intro');
    setHasCollapsedInSession(true);
    setMode('minimized');
    window.requestAnimationFrame(() => {
      launcherBtnRef.current?.focus({ preventScroll: true });
    });
  };

  const handleSelectStep = (nextIdx: number) => {
    const clamped = clampGuideStepIndex(nextIdx);
    const nextStep = VIRTUAL_GUIDE_TOUR_STEPS[clamped];
    const shouldSpeak = !userMutedRef.current;
    setStepIndex(clamped);
    setScrollTriggerNonce((n) => n + 1);
    if (shouldSpeak && speechSupported && nextStep) {
      primeBrowserAudioOutput();
      if (!voiceEnabled) {
        setVoiceEnabled(true);
      }
      speakText(nextStep.speech, {
        syncKey: `tour:${nextStep.id}:${selectedVoiceUri}:${narrationTriggerNonce}`,
      });
    } else {
      stopSpeech();
    }
  };

  const handleNextStep = () => {
    const nextIdx = getNextGuideStepIndex(safeStepIndex);
    if (nextIdx === null) {
      handleSkipTour();
      return;
    }
    const nextStep = VIRTUAL_GUIDE_TOUR_STEPS[nextIdx];
    const shouldSpeak = !userMutedRef.current;
    setStepIndex(nextIdx);
    setScrollTriggerNonce((n) => n + 1);
    if (shouldSpeak && speechSupported && nextStep) {
      primeBrowserAudioOutput();
      if (!voiceEnabled) {
        setVoiceEnabled(true);
      }
      speakText(nextStep.speech, {
        syncKey: `tour:${nextStep.id}:${selectedVoiceUri}:${narrationTriggerNonce}`,
      });
    } else {
      stopSpeech();
    }
  };

  const handlePrevStep = () => {
    const prevIdx = getPrevGuideStepIndex(safeStepIndex);
    const prevStep = VIRTUAL_GUIDE_TOUR_STEPS[prevIdx];
    const shouldSpeak = !userMutedRef.current;
    setStepIndex(prevIdx);
    setScrollTriggerNonce((n) => n + 1);
    if (shouldSpeak && speechSupported && prevStep) {
      primeBrowserAudioOutput();
      if (!voiceEnabled) {
        setVoiceEnabled(true);
      }
      speakText(prevStep.speech, {
        syncKey: `tour:${prevStep.id}:${selectedVoiceUri}:${narrationTriggerNonce}`,
      });
    } else {
      stopSpeech();
    }
  };

  const handleReopenGuide = useCallback(() => {
    const targetMode = resumeTarget === 'tour' ? 'tour' : 'intro';
    const shouldSpeak = !userMutedRef.current;
    if (targetMode === 'tour') {
      setScrollTriggerNonce((n) => n + 1);
      if (!isGuideHomePath(location.pathname)) {
        navigate('/');
      }
    }
    setMode(targetMode);
    if (shouldSpeak && speechSupported) {
      primeBrowserAudioOutput();
      if (!voiceEnabled) {
        setVoiceEnabled(true);
      }
      const targetText =
        targetMode === 'intro' ? GUIDE_INTRO_MESSAGE : currentStep.speech;
      speakText(targetText, {
        syncKey: `${targetMode}:${currentStep.id}:${selectedVoiceUri}:${narrationTriggerNonce}`,
      });
    }
    window.requestAnimationFrame(() => {
      panelRef.current?.focus({ preventScroll: true });
    });
  }, [
    currentStep.id,
    currentStep.speech,
    location.pathname,
    narrationTriggerNonce,
    navigate,
    resumeTarget,
    selectedVoiceUri,
    speakText,
    speechSupported,
    voiceEnabled,
  ]);

  useEffect(() => {
    const handleExternalOpen = (event: Event) => {
      const detail = (event as CustomEvent<OpenVirtualGuideDetail>).detail;
      // Clicking "Talk to Me" / "Start Virtual Tour" always indicates intent to hear the guide
      userMutedRef.current = false;
      if (detail?.mode === 'tour') {
        handleStartTour();
        return;
      }
      if (detail?.mode === 'intro') {
        clearSectionHighlights();
        setMode('intro');
        if (speechSupported) {
          primeBrowserAudioOutput();
          if (!voiceEnabled) {
            setVoiceEnabled(true);
          }
          speakText(GUIDE_INTRO_MESSAGE, {
            syncKey: `intro:${currentStep.id}:${selectedVoiceUri}:${narrationTriggerNonce}`,
          });
        }
        window.requestAnimationFrame(() => {
          panelRef.current?.focus({ preventScroll: true });
        });
        return;
      }
      handleReopenGuide();
    };

    window.addEventListener(PORTFOLIO_GUIDE_OPEN_EVENT, handleExternalOpen);
    return () => {
      window.removeEventListener(PORTFOLIO_GUIDE_OPEN_EVENT, handleExternalOpen);
    };
  }, [
    currentStep.id,
    handleReopenGuide,
    handleStartTour,
    narrationTriggerNonce,
    selectedVoiceUri,
    speakText,
    speechSupported,
    voiceEnabled,
  ]);

  const handleToggleVoice = () => {
    if (!speechSupported) return;
    if (voiceEnabled) {
      userMutedRef.current = true;
      setVoiceEnabled(false);
      setVoiceNotice(null);
      stopSpeech();
    } else {
      userMutedRef.current = false;
      const nextNonce = narrationTriggerNonce + 1;
      primeBrowserAudioOutput();
      setVoiceEnabled(true);
      setVoiceNotice(null);
      setNarrationTriggerNonce(nextNonce);
      if (activeNarrationText) {
        speakText(activeNarrationText, {
          syncKey: `${mode}:${currentStep.id}:${selectedVoiceUri}:${nextNonce}`,
        });
      }
    }
  };

  const handleReplaySpeech = () => {
    if (!speechSupported) return;
    userMutedRef.current = false;
    const nextNonce = narrationTriggerNonce + 1;
    primeBrowserAudioOutput();
    if (!voiceEnabled) {
      setVoiceEnabled(true);
    }
    setVoiceNotice(null);
    setNarrationTriggerNonce(nextNonce);
    if (activeNarrationText) {
      speakText(activeNarrationText, {
        syncKey: `${mode}:${currentStep.id}:${selectedVoiceUri}:${nextNonce}`,
      });
    }
  };

  const handleVoiceChange = (nextUri: string) => {
    userMutedRef.current = false;
    primeBrowserAudioOutput();
    setSelectedVoiceUri(nextUri);
    setSessionSelectedVoiceUri(nextUri);
    if (!voiceEnabled) {
      setVoiceEnabled(true);
    }
    setVoiceNotice(null);
    if (activeNarrationText) {
      speakText(activeNarrationText, {
        voiceUriOverride: nextUri,
        syncKey: `${mode}:${currentStep.id}:${nextUri}:${narrationTriggerNonce}`,
      });
    }
  };

  const handleRouteFollow = () => {
    markVirtualGuideSeen();
    stopSpeech();
    clearSectionHighlights();
    setResumeTarget('tour');
    setHasCollapsedInSession(true);
    setMode('minimized');
  };

  const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleMinimize();
    }
  };

  const preloadLinkElement = (
    <link
      rel="preload"
      as="image"
      href={portraitAssetSrc}
      fetchPriority="high"
      referrerPolicy="no-referrer"
      data-guide-portrait-preload="true"
    />
  );

  if (!isPortraitReady) {
    return preloadLinkElement;
  }

  const isLastStep = safeStepIndex === VIRTUAL_GUIDE_TOUR_STEPS.length - 1;
  const progressPercent = computeGuideProgressPercent(safeStepIndex);
  const showCompactLauncher = shouldRenderCompactLauncher(isOnHome, hasCollapsedInSession);

  return (
    <>
      {preloadLinkElement}

      <AnimatePresence mode="wait">
        {mode === 'minimized' ? (
          !showCompactLauncher ? null : (
            <motion.div
              key="guide-minimized"
              data-virtual-guide="true"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 8 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="fixed left-3.5 bottom-3.5 sm:left-6 sm:bottom-5 z-40"
            >
              <div className="relative">
                {/* Subtle idle pulse ring strictly around the floating button */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -inset-1 rounded-[17px] border border-cyan-400/45 dark:border-cyan-400/50 ${
                    prefersReducedMotion ? '' : 'animate-guide-ring-pulse'
                  }`}
                />
                <button
                  ref={launcherBtnRef}
                  type="button"
                  onClick={handleReopenGuide}
                  title={
                    resumeTarget === 'tour'
                      ? `Reopen Virtual Guide (${currentStep.indexLabel}/0${VIRTUAL_GUIDE_TOUR_STEPS.length})`
                      : 'Reopen Virtual Guide'
                  }
                  aria-label={
                    resumeTarget === 'tour'
                      ? `Open interactive virtual guide, resume section ${currentStep.indexLabel} of ${VIRTUAL_GUIDE_TOUR_STEPS.length}`
                      : 'Open interactive virtual guide'
                  }
                  className="group relative flex h-[50px] w-[50px] sm:h-[58px] sm:w-[58px] items-center justify-center rounded-[15px] border border-slate-300/95 bg-white/95 p-1 shadow-[0_14px_30px_-8px_rgba(15,23,42,0.28)] backdrop-blur-md transition-colors duration-200 hover:border-blue-500/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:border-cyan-400/45 dark:bg-[#0b1222]/95 dark:shadow-[0_18px_36px_-8px_rgba(2,6,23,0.92)] dark:hover:border-cyan-300 dark:focus-visible:ring-cyan-400 cursor-pointer"
                >
                  <span className="relative h-full w-full overflow-hidden rounded-[11px] border border-slate-300/75 bg-slate-200 dark:border-slate-600/80 dark:bg-[#0b1222]">
                    <img
                      src={portraitAssetSrc}
                      alt="Ibtashamur Rahman"
                      width={960}
                      height={1280}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top"
                    />
                  </span>

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-1.5 -top-1.5 inline-flex h-5 items-center justify-center rounded-full border border-white bg-[#2563eb] px-1.5 font-mono text-[9.5px] font-bold tracking-tight text-white shadow-sm dark:border-[#050914] dark:bg-cyan-500 dark:text-slate-950"
                  >
                    {resumeTarget === 'tour'
                      ? `${safeStepIndex + 1}/${VIRTUAL_GUIDE_TOUR_STEPS.length}`
                      : 'Guide'}
                  </span>
                </button>
              </div>
            </motion.div>
          )
        ) : (
          <motion.aside
            key="guide-panel"
            ref={panelRef}
            tabIndex={-1}
            data-virtual-guide="true"
            aria-label="Interactive Portfolio Virtual Guide"
            onKeyDown={handlePanelKeyDown}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
            className="fixed left-3 right-3 bottom-3 sm:right-auto sm:left-6 sm:bottom-5 z-[45] sm:w-[492px] max-h-[min(66dvh,480px)] sm:max-h-[calc(100dvh-4.5rem)] overflow-y-auto rounded-[16px] border border-slate-300/95 bg-white/95 p-2.5 sm:p-4 text-slate-900 shadow-[0_24px_56px_-16px_rgba(15,23,42,0.28)] backdrop-blur-xl focus:outline-none dark:border-slate-700/90 dark:bg-[#0b1222]/95 dark:text-slate-100 dark:shadow-[0_28px_64px_-16px_rgba(2,6,23,0.92)]"
          >
            {/* Top utility header */}
            <div className="mb-2 sm:mb-2.5 flex items-center justify-between gap-2 border-b border-slate-200/90 pb-2 dark:border-slate-800/90">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <Compass
                  className="h-4 w-4 shrink-0 text-blue-700 dark:text-cyan-300"
                  aria-hidden="true"
                />
                <span className="font-mono text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-700 dark:text-slate-200 whitespace-nowrap">
                  {mode === 'intro'
                    ? 'Virtual Guide'
                    : `Tour · ${currentStep.indexLabel} / 0${VIRTUAL_GUIDE_TOUR_STEPS.length}`}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {speechSupported && (
                  <>
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      aria-pressed={!voiceEnabled}
                      aria-label={voiceEnabled ? 'Mute voice narration' : 'Unmute voice narration'}
                      title={voiceEnabled ? 'Mute voice narration' : 'Unmute voice narration'}
                      className={`inline-flex min-h-[38px] sm:min-h-[34px] items-center gap-1 rounded-[8px] border px-2 text-[11px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 ${
                        voiceEnabled
                          ? 'border-blue-600/40 bg-blue-50 text-blue-800 dark:border-cyan-400/40 dark:bg-cyan-950/50 dark:text-cyan-200'
                          : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-[#101a30] dark:text-slate-300 dark:hover:border-slate-500'
                      }`}
                    >
                      {voiceEnabled ? (
                        <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>{voiceEnabled ? 'Mute' : 'Unmute'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReplaySpeech}
                      aria-label="Replay narration"
                      title="Replay narration"
                      className="inline-flex min-h-[38px] sm:min-h-[34px] items-center justify-center gap-1 rounded-[8px] border border-slate-300 bg-slate-50 px-2.5 sm:px-2 text-[11px] font-medium text-slate-700 transition-colors hover:border-blue-500/60 hover:text-blue-700 dark:border-slate-700 dark:bg-[#101a30] dark:text-slate-300 dark:hover:border-cyan-400/60 dark:hover:text-cyan-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="hidden sm:inline">Replay</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleMinimize}
                  aria-label="Collapse virtual guide to floating portrait button"
                  title="Collapse"
                  className="inline-flex min-h-[38px] min-w-[38px] sm:min-h-[34px] sm:min-w-[34px] items-center justify-center rounded-[8px] border border-transparent text-slate-500 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-[#101a30] dark:hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Smooth animated section progress bar during guided tour */}
            {mode === 'tour' && (
              <div
                aria-hidden="true"
                className="mb-2.5 h-1 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800/80"
              >
                <div
                  style={{ width: `${progressPercent}%` }}
                  className={`h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 ${
                    prefersReducedMotion ? '' : 'transition-[width] duration-300 ease-out'
                  }`}
                />
              </div>
            )}

            {/* Main 2.5D character + animated dialogue area */}
            <div className="flex flex-row items-start gap-2.5 sm:gap-3.5">
              <div className="shrink-0">
                <PortraitCharacter25D
                  compact={mode === 'tour'}
                  isSpeaking={voiceEnabled && isSpeaking}
                  label={mode === 'intro' ? 'MD Ibtashamur' : currentStep.label}
                  preloaded={isPortraitReady}
                />
              </div>

              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {mode === 'intro' ? (
                    <motion.div
                      key="dialogue-intro"
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
                      className="space-y-2 sm:space-y-2.5"
                    >
                      <div>
                        <p className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-[0.08em] text-blue-700 dark:text-cyan-300">
                          B.Sc. IPE · SUST
                        </p>
                        <h2 className="mt-0.5 text-sm sm:text-base font-bold leading-snug text-slate-900 dark:text-white">
                          Welcome to my Interactive Portfolio
                        </h2>
                      </div>

                      <div
                        aria-live="polite"
                        className="max-h-[96px] sm:max-h-none overflow-y-auto rounded-[12px] border border-slate-200/90 bg-slate-50/90 p-2 sm:p-3 text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-[#070d1b] dark:text-slate-200"
                      >
                        “{activeNarrationText}”
                      </div>

                      <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={handleStartTour}
                          className="inline-flex min-h-[38px] sm:min-h-[40px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[10px] bg-[#2563eb] px-3 sm:px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1d4ed8] dark:hover:bg-[#3b82f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
                        >
                          <span>Start Guided Tour</span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={handleExploreYourself}
                          className="inline-flex min-h-[38px] sm:min-h-[40px] flex-1 items-center justify-center whitespace-nowrap rounded-[10px] border border-slate-300 bg-white px-3 sm:px-3.5 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#101a30] dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-[#16233d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
                        >
                          Explore Yourself
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`dialogue-step-${currentStep.id}`}
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
                      className="space-y-1.5 sm:space-y-2"
                    >
                      <div>
                        <p className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-[0.08em] text-blue-700 dark:text-cyan-300">
                          Section {currentStep.indexLabel} · {currentStep.label}
                        </p>
                        <h2 className="mt-0.5 text-[13.5px] sm:text-[15px] font-bold leading-snug text-slate-900 dark:text-white">
                          {currentStep.title}
                        </h2>
                      </div>

                      <div
                        aria-live="polite"
                        className="max-h-[92px] sm:max-h-none overflow-y-auto rounded-[12px] border border-slate-200/90 bg-slate-50/90 p-2 sm:p-3 text-[11.5px] sm:text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-[#070d1b] dark:text-slate-200"
                      >
                        {activeNarrationText}
                      </div>

                      <div>
                        <Link
                          to={currentStep.route}
                          onClick={handleRouteFollow}
                          className="inline-flex items-center gap-1.5 rounded text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline dark:text-cyan-300 dark:hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400"
                        >
                          <span>{currentStep.routeLabel}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Session-persisted Voice selector & mobile audio status */}
            {voiceEnabled && speechSupported && (
              <div className="mt-2.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2 rounded-[10px] border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-800 dark:bg-[#070d1b]">
                  <label
                    htmlFor="virtual-guide-voice-select"
                    className="font-mono text-[10px] uppercase tracking-[0.06em] text-slate-600 dark:text-slate-400 shrink-0"
                  >
                    Voice
                  </label>
                  <select
                    id="virtual-guide-voice-select"
                    value={selectedVoiceUri || SYSTEM_DEFAULT_VOICE_URI}
                    onChange={(e) => handleVoiceChange(e.target.value)}
                    className="min-h-[38px] sm:min-h-0 min-w-0 flex-1 truncate rounded-[6px] border border-slate-300 bg-white px-2 py-1 text-base sm:text-[11px] text-slate-800 dark:border-slate-700 dark:bg-[#101a30] dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400"
                  >
                    <option value={SYSTEM_DEFAULT_VOICE_URI}>
                      System Default (Recommended for Mobile)
                    </option>
                    {prioritizedVoices.map((voice) => (
                      <option key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>

                {voiceNotice && (
                  <p
                    role="status"
                    className="rounded-[8px] border border-amber-300/70 bg-amber-50/90 px-2.5 py-1 text-[11px] leading-snug text-amber-900 dark:border-amber-500/35 dark:bg-amber-950/40 dark:text-amber-200"
                  >
                    {voiceNotice}
                  </p>
                )}
              </div>
            )}

            {!speechSupported && (
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                Browser speech synthesis is unavailable here — visual captions are active.
              </p>
            )}

            {/* Guided tour step selector and navigation bar */}
            {mode === 'tour' && (
              <div className="mt-2.5 sm:mt-3 border-t border-slate-200/90 pt-2.5 sm:pt-3 dark:border-slate-800/90 space-y-2 sm:space-y-2.5">
                <div
                  role="tablist"
                  aria-label="Guided tour sections"
                  className="flex flex-nowrap overflow-x-auto gap-1.5 pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0"
                >
                  {VIRTUAL_GUIDE_TOUR_STEPS.map((step, idx) => {
                    const active = idx === safeStepIndex;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => handleSelectStep(idx)}
                        className={`min-h-[36px] sm:min-h-[32px] shrink-0 whitespace-nowrap sm:truncate rounded-[7px] border px-2.5 sm:px-2 py-1 text-[10.5px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 ${
                          active
                            ? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-500/20 dark:text-cyan-200'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#080f1f] dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-[#101a30] dark:hover:text-white'
                        }`}
                      >
                        {step.indexLabel} · {step.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={safeStepIndex === 0}
                      className="inline-flex min-h-[40px] sm:min-h-[38px] items-center gap-1 rounded-[9px] border border-slate-300 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-slate-700 dark:bg-[#101a30] dark:text-slate-100 dark:hover:bg-[#16233d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Previous</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex min-h-[40px] sm:min-h-[38px] items-center gap-1 rounded-[9px] bg-[#2563eb] px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1d4ed8] dark:hover:bg-[#3b82f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
                    >
                      <span>{isLastStep ? 'Finish Tour' : 'Next'}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleRestartTour}
                      aria-label="Restart guided tour"
                      title="Restart Tour"
                      className="inline-flex min-h-[40px] sm:min-h-[38px] items-center gap-1 rounded-[9px] border border-slate-300/80 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-blue-500/60 hover:text-blue-700 dark:border-slate-700/80 dark:bg-[#101a30] dark:text-slate-300 dark:hover:border-cyan-400/60 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Restart</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSkipTour}
                      aria-label="Skip guided tour"
                      className="inline-flex min-h-[40px] sm:min-h-[38px] items-center gap-1 rounded-[9px] border border-transparent px-2 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
                    >
                      <SkipForward className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Skip</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
