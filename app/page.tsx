// app/page.tsx
// ============================================================
// ГЛАВНАЯ INTERCLINICS.RU — SEO-ХАБ + ГЕО-ОПРЕДЕЛЕНИЕ
//
// ЗАЧЕМ ЭТА СТРАНИЦА:
// Яндекс Директ → трафик идёт на /stavropol/vyvod-iz-zapoya/ напрямую.
// Эта страница нужна для:
// 1. Прямых заходов на interclinics.ru (бренд, сарафан, визитка)
// 2. SEO: индексируемый хаб со ссылками на ВСЕ города × услуги × районы
// 3. Гео-определение: cookie ic_city → мгновенный редирект при повторном визите
//
// НЕ ТРОГАЕТ: структуру городских страниц, компоненты, стили
// ============================================================

import { Metadata } from 'next'
import { getActiveCities } from '@/data/cities'
import { services } from '@/data/services'
import CitySelector from '@/components/CitySelector'

// --- SEO мета ---
export const metadata: Metadata = {
  title: 'InterClinics — сеть наркологических клиник | Ставропольский край',
  description:
    'Наркологическая помощь в Ставрополе, Пятигорске, Кисловодске, Ессентуках, Невинномысске, Минеральных Водах, Михайловске, Георгиевске. Вывод из запоя, нарколог на дом, стационар 24/7, кодирование, реабилитация. Анонимно, круглосуточно. ☎ 8 (800) 100-58-49',
  keywords:
    'наркологическая клиника Ставрополь, вывод из запоя Ставропольский край, нарколог на дом КМВ, стационар наркология Пятигорск, реабилитация Кисловодск, кодирование Ессентуки',
  alternates: { canonical: 'https://interclinics.ru/' },
  openGraph: {
    title: 'InterClinics — наркологическая помощь в Ставропольском крае',
    description:
      'Вывод из запоя, стационар 24/7, кодирование, реабилитация. 8 городов. Анонимно, круглосуточно.',
    url: 'https://interclinics.ru/',
    locale: 'ru_RU',
    type: 'website',
  },
}

export default function HomePage() {
  const activeCities = getActiveCities()

  return (
    <>
      {/* Schema.org — MedicalOrganization + areaServed */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalOrganization',
            name: 'InterClinics — сеть наркологических клиник',
            url: 'https://interclinics.ru/',
            telephone: '+78001005849',
            areaServed: activeCities.map((c) => ({
              '@type': 'City',
              name: c.name,
              containedInPlace: { '@type': 'AdministrativeArea', name: c.region },
            })),
            medicalSpecialty: 'Наркология',
            availableService: [
              { '@type': 'MedicalProcedure', name: 'Вывод из запоя на дому' },
              { '@type': 'MedicalProcedure', name: 'Кодирование от алкоголизма' },
              { '@type': 'MedicalProcedure', name: 'Вызов нарколога на дом' },
              { '@type': 'MedicalProcedure', name: 'Стационарное лечение' },
              { '@type': 'MedicalTherapy', name: 'Реабилитация' },
            ],
          }),
        }}
      />

      {/* Клиентский компонент: гео-определение + UI выбора города */}
      <CitySelector
        cities={activeCities.map((c) => ({
          slug: c.slug,
          name: c.name,
          region: c.region,
          priceBase: c.priceBase,
          arrivalTime: c.arrivalTime,
          districts: c.districts || [],
          hasStacionar: !!(c as any).hasStacionar,
          phone: c.phone,
          phoneDisplay: c.phoneDisplay,
        }))}
        services={services.map((s) => ({
          slug: s.slug,
          name: s.shortName || s.name,
        }))}
      />
    </>
  )
}
