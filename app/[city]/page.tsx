// app/[city]/page.tsx
// ============================================================
// ГОРОДСКОЙ ЛЕНДИНГ — макет interclinics-mockup-100-final (Next + Tailwind)
// ============================================================

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug, getCitySlugs, type City } from '@/data/cities'
import { LandingChrome } from '@/components/landing/landing-chrome'
import { CityLanding } from '@/components/landing/city-landing'

export async function generateStaticParams() {
  return getCitySlugs().map(slug => ({ city: slug }))
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityBySlug(params.city)
  if (!city) return { title: 'InterClinics' }

  return {
    title: `Наркологическая клиника в ${city.namePrep} — InterClinics | Выезд за ${city.arrivalTime} мин`,
    description: `Вывод из запоя, кодирование, лечение алкоголизма и наркомании в ${city.namePrep}. Анонимно. Круглосуточно. Лицензия. ☎ ${city.phoneDisplay}`,
    keywords: `вывод из запоя ${city.name}, нарколог на дом ${city.name}, кодирование от алкоголизма ${city.name}, наркологическая клиника ${city.name}`,
    alternates: {
      canonical: `https://interclinics.ru/${city.slug}/`,
    },
    openGraph: {
      title: `InterClinics — наркологическая помощь в ${city.namePrep}`,
      description: `Вывод из запоя, кодирование, лечение зависимости. Анонимно, круглосуточно.`,
      url: `https://interclinics.ru/${city.slug}/`,
      locale: 'ru_RU',
      type: 'website',
    },
  }
}

function MedicalJsonLd({ city }: { city: City }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: `InterClinics — наркологическая помощь в ${city.namePrep}`,
    url: `https://interclinics.ru/${city.slug}/`,
    telephone: city.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.region,
      addressCountry: 'RU',
      streetAddress: city.partnerAddress,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    priceRange: `от ${city.priceNarkolog}₽`,
    medicalSpecialty: 'Наркология',
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}

export default function CityPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()

  return (
    <>
      <MedicalJsonLd city={city} />
      <LandingChrome>
        <CityLanding city={city} />
      </LandingChrome>
    </>
  )
}
