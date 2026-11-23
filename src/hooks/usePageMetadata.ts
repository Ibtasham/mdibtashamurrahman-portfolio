import { useEffect } from 'react';
import {
  clampMetaDescription,
  formatSeoTitle,
  resolveOgType,
  SITE_OWNER,
  type PortfolioSchemaType,
} from '../utils/seoMetadata';

export interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  schemaType?: PortfolioSchemaType;
  schemaExtra?: Record<string, unknown>;
}

const DEFAULT_IMAGE = '/og-preview.jpg';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function usePageMetadata({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  noIndex = false,
  schemaType = 'WebPage',
  schemaExtra,
}: PageMetadataOptions) {
  const fullTitle = formatSeoTitle(title);
  const metaDescription = clampMetaDescription(description);
  const ogType = resolveOgType(schemaType);

  useEffect(() => {
    document.title = fullTitle;

    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : '';
    const canonicalUrl = `${origin}${path}`;
    const absoluteImage = image.startsWith('http') ? image : `${origin}${image}`;

    upsertCanonical(canonicalUrl);
    upsertMeta(
      'name',
      'robots',
      noIndex ? 'noindex, nofollow' : 'index, follow',
    );
    upsertMeta('name', 'description', metaDescription);
    upsertMeta('property', 'og:site_name', SITE_OWNER);
    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', metaDescription);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', absoluteImage);
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', metaDescription);
    upsertMeta('name', 'twitter:image', absoluteImage);

    const scriptId = 'route-structured-data';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const baseJsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: fullTitle,
      description: metaDescription,
      url: canonicalUrl,
      ...(schemaExtra ?? {}),
    };

    scriptEl.textContent = JSON.stringify(baseJsonLd);
  }, [
    fullTitle,
    metaDescription,
    ogType,
    path,
    image,
    noIndex,
    schemaType,
    schemaExtra,
  ]);
}
