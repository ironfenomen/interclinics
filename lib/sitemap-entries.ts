import { getCitySlugs } from '@/data/cities'

const BASE = 'https://interclinics.ru'

export type SitemapEntry = {
  loc: string
  changefreq: 'weekly' | 'monthly'
  priority: number
}

/** Те же URL, что раньше в `app/sitemap.ts` (канонические, со слэшем). */
export function getSitemapEntries(): SitemapEntry[] {
  const cities = getCitySlugs()

  const cityPages: SitemapEntry[] = cities.flatMap(slug => [
    { loc: `${BASE}/${slug}/`, changefreq: 'weekly', priority: 0.9 },
    { loc: `${BASE}/${slug}/vyvod-iz-zapoya/`, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE}/${slug}/narkolog-na-dom/`, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE}/${slug}/stacionar/`, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE}/${slug}/kodirovanie/`, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE}/${slug}/reabilitaciya/`, changefreq: 'monthly', priority: 0.6 },
  ])

  return [{ loc: `${BASE}/`, changefreq: 'weekly', priority: 1.0 }, ...cityPages]
}
