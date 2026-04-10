import { getCitySlugs } from '@/data/cities'

const BASE = 'https://interclinics.ru'

/**
 * Любые \n / \r / \t / пробелы и прочие ECMAScript-пробельные символы внутри строки URL
 * ломают ожидание Яндекса «<loc> в одну строку». Для sitemap убираем их полностью.
 */
export function normalizeSitemapLoc(href: string): string {
  return href.trim().replace(/\s/g, '')
}

export type SitemapEntry = {
  loc: string
  changefreq: 'weekly' | 'monthly'
  priority: number
}

/** Те же URL, что раньше в `app/sitemap.ts` (канонические, со слэшем). */
export function getSitemapEntries(): SitemapEntry[] {
  const cities = getCitySlugs()

  const cityPages: SitemapEntry[] = cities.flatMap(slug => [
    { loc: normalizeSitemapLoc(`${BASE}/${slug}/`), changefreq: 'weekly', priority: 0.9 },
    { loc: normalizeSitemapLoc(`${BASE}/${slug}/vyvod-iz-zapoya/`), changefreq: 'weekly', priority: 0.8 },
    { loc: normalizeSitemapLoc(`${BASE}/${slug}/narkolog-na-dom/`), changefreq: 'weekly', priority: 0.8 },
    { loc: normalizeSitemapLoc(`${BASE}/${slug}/stacionar/`), changefreq: 'weekly', priority: 0.7 },
    { loc: normalizeSitemapLoc(`${BASE}/${slug}/kodirovanie/`), changefreq: 'weekly', priority: 0.7 },
    { loc: normalizeSitemapLoc(`${BASE}/${slug}/reabilitaciya/`), changefreq: 'monthly', priority: 0.6 },
  ])

  return [{ loc: normalizeSitemapLoc(`${BASE}/`), changefreq: 'weekly', priority: 1.0 }, ...cityPages]
}
