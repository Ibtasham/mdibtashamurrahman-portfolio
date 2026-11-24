import factorymindPreview from '../assets/images/project_factorymind_preview_1794746195660.jpg';
import forgemindPreview from '../assets/images/project_forgemind_preview_1794746194669.jpg';
import tikatrackPreview from '../assets/images/project_tikatrack_preview_1794746194291.jpg';
import liveFactoryMindShot from '../assets/images/live_factorymind_ui.png';
import liveTikaTrackShot from '../assets/images/live_tikatrack_ui.png';

const PROJECT_PREVIEW_MAP: Record<string, string> = {
  tikatrack: liveTikaTrackShot,
  factorymind: liveFactoryMindShot,
  'forgemind-ai': forgemindPreview,
};

const LIVE_DEMO_SCREENSHOT_MAP: Record<string, string> = {
  tikatrack: liveTikaTrackShot,
  factorymind: liveFactoryMindShot,
};

const CONCEPTUAL_PREVIEW_MAP: Record<string, string> = {
  tikatrack: tikatrackPreview,
  factorymind: factorymindPreview,
  'forgemind-ai': forgemindPreview,
};

export function resolveProjectPreviewImage(projectId: string, customUrl?: string): string | undefined {
  if (customUrl) {
    return customUrl;
  }
  return PROJECT_PREVIEW_MAP[projectId] ?? CONCEPTUAL_PREVIEW_MAP[projectId];
}

export function resolveLiveDemoScreenshot(projectId: string): string | undefined {
  return LIVE_DEMO_SCREENSHOT_MAP[projectId];
}

export function resolveConceptualPreviewImage(projectId: string): string | undefined {
  return CONCEPTUAL_PREVIEW_MAP[projectId];
}
