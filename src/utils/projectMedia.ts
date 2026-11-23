import factorymindPreview from '../assets/images/project_factorymind_preview_1794746195660.jpg';
import forgemindPreview from '../assets/images/project_forgemind_preview_1794746194669.jpg';
import tikatrackPreview from '../assets/images/project_tikatrack_preview_1794746194291.jpg';

const PROJECT_PREVIEW_MAP: Record<string, string> = {
  tikatrack: tikatrackPreview,
  factorymind: factorymindPreview,
  'forgemind-ai': forgemindPreview,
};

export function resolveProjectPreviewImage(projectId: string, customUrl?: string): string | undefined {
  if (customUrl) {
    return customUrl;
  }
  return PROJECT_PREVIEW_MAP[projectId];
}
