// app/page.tsx
// ============================================================
// ГЛАВНАЯ INTERCLINICS.RU — SEO-ХАБ + ГЕО-ОПРЕДЕЛЕНИЕ
//
// Яндекс Директ → трафик на /stavropol/vyvod-iz-zapoya/ напрямую
// Эта страница для: прямых заходов, SEO-индексации, перелинковки
// ============================================================

import { Metadata } from 'next'
import { getActiveCities } from '@/data/cities'
import CitySelector from '@/components/CitySelector'
import { SITE_PHONE_DISPLAY, SITE_PHONE_E164 } from '@/lib/site-phone'

const ALL_SERVICES = [
  { slug: 'vyvod-iz-zapoya', name: 'Вывод из запоя' },
  { slug: 'narkolog-na-dom', name: 'Нарколог на дом' },
  { slug: 'kodirovanie', name: 'Кодирование' },
  { slug: 'stacionar', name: 'Стационар 24/7' },
  // { slug: 'reabilitaciya', name: 'Реабилитация' },
]

export const metadata: Metadata = {
  title: 'InterClinics — сеть наркологических клиник | Ставропольский край',
  description:
    `Наркологическая помощь в Ставрополе, Пятигорске, Кисловодске, Ессентуках, Невинномысске, Минеральных Водах, Михайловске, Георгиевске. Вывод из запоя, стационар 24/7, кодирование, реабилитация. Анонимно, круглосуточно. ${SITE_PHONE_DISPLAY}`,
  alternates: { canonical: 'https://interclinics.ru/' },
  openGraph: {
    title: 'InterClinics — наркологическая помощь в Ставропольском крае',
    description: 'Вывод из запоя, стационар 24/7, кодирование, реабилитация. 8 городов.',
    url: 'https://interclinics.ru/',
    locale: 'ru_RU',
    type: 'website',
  },
}

export default function HomePage() {
  const active = getActiveCities()
  const cityData = active.map((c: any) => ({
    slug: c.slug,
    name: c.name,
    namePrep: c.namePrep ?? c.name,
    region: c.region ?? 'Ставропольский край',
    priceBase: c.priceBase,
    arrivalTime: c.arrivalTime,
    districts: c.districts ?? [],
    hasStacionar: !!c.hasStacionar,
    phoneDisplay: c.phoneDisplay,
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalOrganization',
            name: 'InterClinics',
            url: 'https://interclinics.ru/',
            telephone: SITE_PHONE_E164,
            areaServed: active.map((c: any) => ({ '@type': 'City', name: c.name })),
            medicalSpecialty: 'Наркология',
          }),
        }}
      />
      <CitySelector cities={cityData} services={ALL_SERVICES} />
    </>
  )
}
