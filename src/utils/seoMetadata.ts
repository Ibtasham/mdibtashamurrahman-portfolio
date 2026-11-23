export type PortfolioSchemaType =
  | 'Person'
  | 'CreativeWork'
  | 'ScholarlyArticle'
  | 'CollectionPage'
  | 'WebApplication'
  | 'WebPage';

export const SITE_OWNER = 'MD Ibtashamur Rahman';
export const SHORT_SITE_BRAND = 'Ibtashamur Rahman';

export function formatSeoTitle(title: string, maxLength = 66): string {
  const clean = title.replace(/\s+/g, ' ').trim();
  if (!clean) {
    return `${SITE_OWNER} — Engineering & Research`;
  }

  const withOwner = clean.includes(SITE_OWNER)
    ? clean
    : `${clean} — ${SITE_OWNER}`;

  if (withOwner.length <= maxLength) {
    return withOwner;
  }

  // Prefer keeping short brand suffix when full owner string pushes past snippet width
  if (!clean.includes(SITE_OWNER)) {
    const withShortBrand = `${clean} — ${SHORT_SITE_BRAND}`;
    if (withShortBrand.length <= maxLength) {
      return withShortBrand;
    }
  }

  const suffix = ` — ${SHORT_SITE_BRAND}`;
  const available = maxLength - suffix.length;
  if (available >= 18) {
    const clipped = clean.slice(0, available).replace(/\s+\S*$/, '').trim();
    if (clipped.length >= 12) {
      return `${clipped}…${suffix}`;
    }
  }

  return clean.slice(0, maxLength - 1).trimEnd() + '…';
}

export function clampMetaDescription(description: string, maxLength = 158): string {
  const normalized = description.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const slice = normalized.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(' ');
  const trimmed =
    lastSpace > Math.floor(maxLength * 0.65)
      ? slice.slice(0, lastSpace)
      : slice;

  return `${trimmed.replace(/[,:;.\-\s]+$/, '')}.`;
}

export function resolveOgType(
  schemaType: PortfolioSchemaType,
): 'profile' | 'article' | 'website' {
  if (schemaType === 'Person') return 'profile';
  if (schemaType === 'ScholarlyArticle') return 'article';
  return 'website';
}
