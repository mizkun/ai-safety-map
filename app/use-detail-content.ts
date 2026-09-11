'use client';
import { useEffect, useState } from 'react';
import type { SiteContent } from '@/lib/content-types';
import type { Locale } from '@/lib/i18n';
import { readDetailPackage } from '@/lib/detail-package.mjs';

// Retain one complete package per language while the user follows reading links.
// The diagram keeps using the lightweight content passed with the initial page.
export function useDetailContent(
  site: SiteContent,
  locale: Locale,
  needed: boolean,
) {
  const [content, setContent] = useState<Partial<SiteContent['content']>>({});
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const url = site.detailsUrls?.[locale];
  const ready = !url || Boolean(content[locale]);

  useEffect(() => {
    if (!needed || ready || !url || error) return;
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Content fetch failed');
        return response.json();
      })
      .then((data: SiteContent['content']) => {
        const initial = site.content[locale] || site.content.ja;
        const detail = readDetailPackage(
          data,
          locale,
          Object.keys(initial.nodes),
        );
        setContent((previous) => ({ ...previous, [locale]: detail }));
      })
      .catch((cause) => {
        if (cause.name !== 'AbortError') setError(true);
      });
    return () => controller.abort();
  }, [needed, ready, url, locale, attempt, error, site.content]);

  return {
    data: content[locale] || site.content[locale] || site.content.ja,
    ready,
    error,
    clearError: () => setError(false),
    retry: () => {
      setError(false);
      setAttempt((n) => n + 1);
    },
  };
}
