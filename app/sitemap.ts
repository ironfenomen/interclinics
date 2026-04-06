import type { MetadataRoute } from 'next'
import { getCitySlugs } from '@/data/cities'

const BASE = 'https://interclinics.ru'

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = getCitySlugs()

  const cityPages: MetadataRoute.Sitemap = cities.flatMap(slug => [
    { url: `${BASE}/${slug}/`,                    changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/${slug}/vyvod-iz-zapoya/`,    changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/${slug}/narkolog-na-dom/`,    changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/${slug}/stacionar/`,          changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/${slug}/kodirovanie/`,        changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/${slug}/reabilitaciya/`,      changeFrequency: 'monthly', priority: 0.6 },
  ])

  return [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1.0 },
    ...cityPages,
  ]
}
