// data/cities.ts
// ============================================================
// ГОРОДА — центральный файл. Добавить город = добавить объект.
// Все страницы генерируются автоматически из этого массива.
// ============================================================

import { SITE_PHONE_DISPLAY, SITE_PHONE_E164, SITE_WHATSAPP_WA_ME_DIGITS } from '@/lib/site-phone'

/** Переопределение владельца сайта в юрблоке футера мокапа (редко). */
export interface CityFooterSiteOwner {
  name: string
  inn: string
  ogrn: string
}

/** Переопределение основного мед. исполнителя в юрблоке футера мокапа (редко). */
export interface CityFooterMedicalExecutor {
  /** Краткое имя для текста, напр. «клиника „Амадея“» */
  clinicBrand: string
  legalName: string
  inn: string
  ogrn: string
  license: string
  licenseDate: string
}

export interface City {
  slug: string            // URL: /stavropol/
  name: string            // Ставрополь
  namePrep: string        // в Ставрополе
  nameGen: string         // Ставрополя
  nameDat: string         // Ставрополю
  nameAdj: string         // ставропольский
  region: string          // Ставропольский край
  phone: string           // SITE_PHONE_E164 — см. lib/site-phone.ts
  phoneDisplay: string    // SITE_PHONE_DISPLAY
  /** Дублирует SITE_WHATSAPP_WA_ME_DIGITS; href для мессенджеров — SITE_WHATSAPP_HREF в lib/site-phone.ts */
  whatsapp: string
  /** Зарезервировано под редкий per-city override; ссылки в UI — SITE_TELEGRAM_HREF в lib/site-phone.ts */
  telegram?: string

  // Партнёр / своя клиника
  partnerName: string     // ООО «ИнтерКлиник»
  partnerInn: string
  partnerOgrn: string
  partnerLicense: string
  partnerLicenseDate: string
  partnerAddress: string
  lat: number
  lng: number
  isOwn: boolean          // true = своя клиника, false = партнёр

  // Цены (подстановка на лендинги)
  priceVyvodFrom: number // вывод из запоя, лечение алкоголизма — карточки «от»
  priceBase: number       // базовый пакет выезда на дом («Стандартная» в прайсе)
  priceEnhanced: number   // усиленная
  priceMax: number        // максимальная
  priceNarkolog: number   // вызов нарколога
  priceCoding: number     // кодирование от

  // ★ Стационар (v3)
  hasStacionar: boolean
  stacionarAddress?: string
  stacionarLat?: number
  stacionarLng?: number
  priceStacionarDay: number
  priceStacionarDetox: number
  priceStacionarStandard: number
  priceStacionarFull: number
  stacionarBeds?: number
  nearestStacionarSlug?: string
  nearestStacionarDistance?: number

  // ★ Реабилитация (v3)
  hasRehab: boolean
  rehabAddress?: string
  priceRehabDay: number
  priceRehab28: number
  priceRehab90: number
  priceRehab6Mo: number
  rehabProgram?: string

  // Локальный контент
  arrivalTime: number     // минут до приезда
  teamsAvailable: number  // «бригад свободно»
  districts: string[]     // районы обслуживания
  /** Локальный абзац в блоке логистики (посадки vyvod / narkolog-na-dom и др.): один тон, без «км до клиники» вне честного контекста Ставрополя. */
  localText?: string

  /** Юрблок футера мокапа: без полей — см. дефолты в lib/footer-legal-mockup.ts */
  footerSiteOwner?: CityFooterSiteOwner
  footerMedicalExecutor?: CityFooterMedicalExecutor

  active: boolean
}

export const cities: City[] = [
  // ============================================================
  // СТАВРОПОЛЬ — свой город
  // ============================================================
  {
    slug: 'stavropol',
    name: 'Ставрополь',
    namePrep: 'Ставрополе',
    nameGen: 'Ставрополя',
    nameDat: 'Ставрополю',
    nameAdj: 'ставропольский',
    region: 'Ставропольский край',
    phone: SITE_PHONE_E164,
    phoneDisplay: SITE_PHONE_DISPLAY,
    whatsapp: SITE_WHATSAPP_WA_ME_DIGITS,

    partnerName: 'ООО «ИнтерКлиник»',
    partnerInn: 'ХХХХХХХХХХ',
    partnerOgrn: 'ХХХХХХХХХХХХХ',
    partnerLicense: 'Л041-01197-26/00327766',
    partnerLicenseDate: '10.08.2021',
    partnerAddress: 'г. Ставрополь, пер. Каховский, 26а',
    lat: 45.0428,
    lng: 41.9734,
    isOwn: true,

    priceVyvodFrom: 4900,
    priceBase: 7900,
    priceEnhanced: 11900,
    priceMax: 14990,
    priceNarkolog: 7900,
    priceCoding: 9900,

    hasStacionar: true,
    stacionarAddress: 'г. Ставрополь, пер. Каховский, 26а',
    stacionarLat: 45.0428,
    stacionarLng: 41.9734,
    priceStacionarDay: 7900,
    priceStacionarDetox: 36000,
    priceStacionarStandard: 90000,
    priceStacionarFull: 190000,
    stacionarBeds: 20,

    hasRehab: true,
    priceRehabDay: 2000,
    priceRehab28: 60000,
    priceRehab90: 150000,
    priceRehab6Mo: 280000,
    rehabProgram: '12 шагов',

    arrivalTime: 30,
    teamsAvailable: 4,
    districts: [
      'Центр', 'Юго-Запад', 'Северо-Запад',
      'пр. Кулакова', 'ул. Доваторцев', 'ул. 50 лет ВЛКСМ',
      'Ботаника', 'Осетинка', 'Ташла'
    ],
    localText:
      'Выезжаем по всему городу и ближайшим населённым пунктам — в том числе Михайловск, Шпаковское, Надежда, Татарка. База выезда в Ставрополе; в удалённые районы закладывайте до 40 минут в пути — точнее уточняем на линии по адресу.',

    active: true,
  },

  // ============================================================
  // ПЯТИГОРСК
  // ============================================================
  {
    slug: 'pyatigorsk',
    name: 'Пятигорск',
    namePrep: 'Пятигорске',
    nameGen: 'Пятигорска',
    nameDat: 'Пятигорску',
    nameAdj: 'пятигорский',
    region: 'Ставропольский край',
    phone: SITE_PHONE_E164,
    phoneDisplay: SITE_PHONE_DISPLAY,
    whatsapp: SITE_WHATSAPP_WA_ME_DIGITS,

    partnerName: 'ООО «ИнтерКлиник»',
    partnerInn: 'ХХХХХХХХХХ',
    partnerOgrn: 'ХХХХХХХХХХХХХ',
    partnerLicense: 'Л041-01197-26/00327766',
    partnerLicenseDate: '10.08.2021',
    partnerAddress: 'г. Пятигорск, ул. XXXXXXX, д. XX',
    lat: 44.0486,
    lng: 43.0594,
    isOwn: false,

    priceVyvodFrom: 4900,
    priceBase: 7900,
    priceEnhanced: 11900,
    priceMax: 14990,
    priceNarkolog: 7900,
    priceCoding: 9900,

    hasStacionar: false,
    nearestStacionarSlug: 'stavropol',
    nearestStacionarDistance: 45,
    priceStacionarDay: 7900,
    priceStacionarDetox: 36000,
    priceStacionarStandard: 90000,
    priceStacionarFull: 190000,

    hasRehab: false,
    priceRehabDay: 2000,
    priceRehab28: 60000,
    priceRehab90: 150000,
    priceRehab6Mo: 280000,

    arrivalTime: 35,
    teamsAvailable: 3,
    districts: ['Центр', 'Белая Ромашка', 'Новопятигорск', 'Горячеводский', 'Свободы'],
    localText:
      'В Пятигорске — выезд в черте города и по согласованию на линии для отдельных адресов и прилегающих зон. Время и маршрут уточняют с учётом района и дороги — без фиксированных обещаний до звонка.',

    active: true,
  },

  // ============================================================
  // КИСЛОВОДСК
  // ============================================================
  {
    slug: 'kislovodsk',
    name: 'Кисловодск',
    namePrep: 'Кисловодске',
    nameGen: 'Кисловодска',
    nameDat: 'Кисловодску',
    nameAdj: 'кисловодский',
    region: 'Ставропольский край',
    phone: SITE_PHONE_E164,
    phoneDisplay: SITE_PHONE_DISPLAY,
    whatsapp: SITE_WHATSAPP_WA_ME_DIGITS,

    partnerName: 'ООО «ИнтерКлиник»',
    partnerInn: 'ХХХХХХХХХХ',
    partnerOgrn: 'ХХХХХХХХХХХХХ',
    partnerLicense: 'Л041-01197-26/00327766',
    partnerLicenseDate: '10.08.2021',
    partnerAddress: 'г. Кисловодск, ул. XXXXXXX, д. XX',
    lat: 43.9133,
    lng: 42.7208,
    isOwn: false,

    priceVyvodFrom: 4900,
    priceBase: 7900,
    priceEnhanced: 11900,
    priceMax: 14990,
    priceNarkolog: 7900,
    priceCoding: 9900,

    hasStacionar: false,
    nearestStacionarSlug: 'stavropol',
    nearestStacionarDistance: 50,
    priceStacionarDay: 7900,
    priceStacionarDetox: 36000,
    priceStacionarStandard: 90000,
    priceStacionarFull: 190000,

    hasRehab: false,
    priceRehabDay: 2000,
    priceRehab28: 60000,
    priceRehab90: 150000,
    priceRehab6Mo: 280000,

    arrivalTime: 40,
    teamsAvailable: 2,
    districts: ['Центр', 'Курортный район', 'Заводской', 'Жуковского'],
    localText:
      'В Кисловодске — выезд по городу и по согласованию на линии, в том числе курортная часть и прилегающие зоны. Порядок и срок согласуют по адресу; без универсального сценария «для всех точек».',

    active: true,
  },

  // ============================================================
  // ЕССЕНТУКИ
  // ============================================================
  {
    slug: 'essentuki',
    name: 'Ессентуки',
    namePrep: 'Ессентуках',
    nameGen: 'Ессентуков',
    nameDat: 'Ессентукам',
    nameAdj: 'ессентукский',
    region: 'Ставропольский край',
    phone: SITE_PHONE_E164,
    phoneDisplay: SITE_PHONE_DISPLAY,
    whatsapp: SITE_WHATSAPP_WA_ME_DIGITS,

    partnerName: 'ООО «ИнтерКлиник»',
    partnerInn: 'ХХХХХХХХХХ',
    partnerOgrn: 'ХХХХХХХХХХХХХ',
    partnerLicense: 'Л041-01197-26/00327766',
    partnerLicenseDate: '10.08.2021',
    partnerAddress: 'г. Ессентуки, ул. XXXXXXX, д. XX',
    lat: 44.0449,
    lng: 42.8606,
    isOwn: false,

    priceVyvodFrom: 4900,
    priceBase: 7900,
    priceEnhanced: 11900,
    priceMax: 14990,
    priceNarkolog: 7900,
    priceCoding: 9900,

    hasStacionar: false,
    nearestStacionarSlug: 'stavropol',
    nearestStacionarDistance: 40,
    priceStacionarDay: 7900,
    priceStacionarDetox: 36000,
    priceStacionarStandard: 90000,
    priceStacionarFull: 190000,

    hasRehab: false,
    priceRehabDay: 2000,
    priceRehab28: 60000,
    priceRehab90: 150000,
    priceRehab6Mo: 280000,

    arrivalTime: 35,
    teamsAvailable: 2,
    districts: ['Центр', 'Курортная зона', 'Новый микрорайон'],
    localText:
      'В Ессентуках — курортная застройка и разные форматы адресов: маршрут и порядок выезда согласуют на линии по конкретному месту — без одного шаблона на все точки. Детали — при записи.',

    active: true,
  },

  // ============================================================
  // НЕВИННОМЫССК
  // ============================================================
  {
    slug: 'nevinnomyssk',
    name: 'Невинномысск',
    namePrep: 'Невинномысске',
    nameGen: 'Невинномысска',
    nameDat: 'Невинномысску',
    nameAdj: 'невинномысский',
    region: 'Ставропольский край',
    phone: SITE_PHONE_E164,
    phoneDisplay: SITE_PHONE_DISPLAY,
    whatsapp: SITE_WHATSAPP_WA_ME_DIGITS,

    partnerName: 'ООО «ИнтерКлиник»',
    partnerInn: 'ХХХХХХХХХХ',
    partnerOgrn: 'ХХХХХХХХХХХХХ',
    partnerLicense: 'Л041-01197-26/00327766',
    partnerLicenseDate: '10.08.2021',
    partnerAddress: 'г. Невинномысск, ул. XXXXXXX, д. XX',
    lat: 44.6310,
    lng: 41.9414,
    isOwn: false,

    priceVyvodFrom: 4900,
    priceBase: 7900,
    priceEnhanced: 11900,
    priceMax: 14990,
    priceNarkolog: 7900,
    priceCoding: 9900,

    hasStacionar: false,
    nearestStacionarSlug: 'stavropol',
    nearestStacionarDistance: 110,
    priceStacionarDay: 7900,
    priceStacionarDetox: 36000,
    priceStacionarStandard: 90000,
    priceStacionarFull: 190000,

    hasRehab: false,
    priceRehabDay: 2000,
    priceRehab28: 60000,
    priceRehab90: 150000,
    priceRehab6Mo: 280000,

    arrivalTime: 35,
    teamsAvailable: 2,
    districts: ['Центр', 'Низки', 'Головное'],
    localText:
      'В Невинномысске — крупный город: при согласовании выезда учитывают район и загрузку линии. Условия уточняют на линии по вашему адресу — без фиксированных обещаний до разговора.',

    active: true,
  },

  // ============================================================
  // МИНЕРАЛЬНЫЕ ВОДЫ
  // ============================================================
  {
    slug: 'mineralnye-vody',
    name: 'Минеральные Воды',
    namePrep: 'Минеральных Водах',
    nameGen: 'Минеральных Вод',
    nameDat: 'Минеральным Водам',
    nameAdj: 'минераловодский',
    region: 'Ставропольский край',
    phone: SITE_PHONE_E164,
    phoneDisplay: SITE_PHONE_DISPLAY,
    whatsapp: SITE_WHATSAPP_WA_ME_DIGITS,

    partnerName: 'ООО «ИнтерКлиник»',
    partnerInn: 'ХХХХХХХХХХ',
    partnerOgrn: 'ХХХХХХХХХХХХХ',
    partnerLicense: 'Л041-01197-26/00327766',
    partnerLicenseDate: '10.08.2021',
    partnerAddress: 'г. Минеральные Воды, ул. XXXXXXX, д. XX',
    lat: 44.2192,
    lng: 43.1350,
    isOwn: false,

    priceVyvodFrom: 4900,
    priceBase: 7900,
    priceEnhanced: 11900,
    priceMax: 14990,
    priceNarkolog: 7900,
    priceCoding: 9900,

    hasStacionar: false,
    nearestStacionarSlug: 'stavropol',
    nearestStacionarDistance: 25,
    priceStacionarDay: 7900,
    priceStacionarDetox: 36000,
    priceStacionarStandard: 90000,
    priceStacionarFull: 190000,

    hasRehab: false,
    priceRehabDay: 2000,
    priceRehab28: 60000,
    priceRehab90: 150000,
    priceRehab6Mo: 280000,

    arrivalTime: 30,
    teamsAvailable: 2,
    districts: ['Центр', 'Привокзальная', 'Змейка'],
    localText:
      'Выезд в Минеральных Водах и по согласованию на линии — с учётом района, маршрута и загрузки. Детали по конкретному адресу при записи, без универсальных обещаний.',

    active: true,
  },

  // ============================================================
  // МИХАЙЛОВСК
  // ============================================================
  {
    slug: 'mikhaylovsk',
    name: 'Михайловск',
    namePrep: 'Михайловске',
    nameGen: 'Михайловска',
    nameDat: 'Михайловску',
    nameAdj: 'михайловский',
    region: 'Ставропольский край',
    phone: SITE_PHONE_E164,
    phoneDisplay: SITE_PHONE_DISPLAY,
    whatsapp: SITE_WHATSAPP_WA_ME_DIGITS,

    partnerName: 'ООО «ИнтерКлиник»',
    partnerInn: 'ХХХХХХХХХХ',
    partnerOgrn: 'ХХХХХХХХХХХХХ',
    partnerLicense: 'Л041-01197-26/00327766',
    partnerLicenseDate: '10.08.2021',
    partnerAddress: 'г. Михайловск, ул. XXXXXXX, д. XX',
    lat: 45.1286,
    lng: 42.0253,
    isOwn: false,

    priceVyvodFrom: 4900,
    priceBase: 7900,
    priceEnhanced: 11900,
    priceMax: 14990,
    priceNarkolog: 7900,
    priceCoding: 9900,

    hasStacionar: false,
    nearestStacionarSlug: 'stavropol',
    nearestStacionarDistance: 20,
    priceStacionarDay: 7900,
    priceStacionarDetox: 36000,
    priceStacionarStandard: 90000,
    priceStacionarFull: 190000,

    hasRehab: false,
    priceRehabDay: 2000,
    priceRehab28: 60000,
    priceRehab90: 150000,
    priceRehab6Mo: 280000,

    arrivalTime: 25,
    teamsAvailable: 3,
    districts: ['Центр', 'Новый город', 'Шпаковское'],
    localText:
      'Выезд в Михайловске и по согласованию на линии для смежных адресов. Порядок и срок — с учётом района и загрузки; без шаблонных обещаний до разговора.',

    active: true,
  },

  // ============================================================
  // ГЕОРГИЕВСК
  // ============================================================
  {
    slug: 'georgievsk',
    name: 'Георгиевск',
    namePrep: 'Георгиевске',
    nameGen: 'Георгиевска',
    nameDat: 'Георгиевску',
    nameAdj: 'георгиевский',
    region: 'Ставропольский край',
    phone: SITE_PHONE_E164,
    phoneDisplay: SITE_PHONE_DISPLAY,
    whatsapp: SITE_WHATSAPP_WA_ME_DIGITS,

    partnerName: 'ООО «ИнтерКлиник»',
    partnerInn: 'ХХХХХХХХХХ',
    partnerOgrn: 'ХХХХХХХХХХХХХ',
    partnerLicense: 'Л041-01197-26/00327766',
    partnerLicenseDate: '10.08.2021',
    partnerAddress: 'г. Георгиевск, ул. XXXXXXX, д. XX',
    lat: 44.1531,
    lng: 43.4700,
    isOwn: false,

    priceVyvodFrom: 4900,
    priceBase: 7900,
    priceEnhanced: 11900,
    priceMax: 14990,
    priceNarkolog: 7900,
    priceCoding: 9900,

    hasStacionar: false,
    nearestStacionarSlug: 'stavropol',
    nearestStacionarDistance: 95,
    priceStacionarDay: 7900,
    priceStacionarDetox: 36000,
    priceStacionarStandard: 90000,
    priceStacionarFull: 190000,

    hasRehab: false,
    priceRehabDay: 2000,
    priceRehab28: 60000,
    priceRehab90: 150000,
    priceRehab6Mo: 280000,

    arrivalTime: 40,
    teamsAvailable: 2,
    districts: ['Центр', 'Привокзальная'],
    localText:
      'Выезд в черте Георгиевска и по согласованию на линии для дополнительных направлений. Условия подбирают под адрес и ситуацию — без шаблонных обещаний для всех.',

    active: true,
  },
]

// Хелпер: получить город по slug
export function getCityBySlug(slug: string): City | undefined {
  return cities.find(c => c.slug === slug && c.active)
}

/** Своя клиника со стационаром в Ставрополе — для копипаста про ориентир выезда/км допустимо только здесь. */
export function isStavropolCity(city: Pick<City, 'slug'>): boolean {
  return city.slug === 'stavropol'
}

/**
 * Город с отделением стационара сети для направления при показаниях, если в текущем городе нет своего стационара.
 * `nearestStacionarSlug` должен указывать на активный город из {@link cities}; иначе вернётся `null` (безопасный фолбэк в UI).
 */
export function getNearestStacionarCity(city: City): City | null {
  if (city.hasStacionar) return null
  if (!city.nearestStacionarSlug) return null
  return getCityBySlug(city.nearestStacionarSlug) ?? null
}

// Хелпер: все активные города
export function getActiveCities(): City[] {
  return cities.filter(c => c.active)
}

/**
 * Фиксированный порядок городов в переключателе (шапка / mobile dropdown) и везде,
 * где пользователь выбирает город из списка — не алфавит, не порядок объявления в массиве.
 */
export const CITY_SWITCHER_SLUG_ORDER: readonly string[] = [
  'stavropol',
  'mikhaylovsk',
  'nevinnomyssk',
  'mineralnye-vody',
  'pyatigorsk',
  'georgievsk',
  'kislovodsk',
  'essentuki',
]

/** Активные города в порядке {@link CITY_SWITCHER_SLUG_ORDER}; неизвестные slug — в конце. */
export function getCitiesInSwitcherOrder(): City[] {
  const active = getActiveCities()
  const bySlug = new Map(active.map(c => [c.slug, c]))
  const ordered: City[] = []
  const seen = new Set<string>()
  for (const slug of CITY_SWITCHER_SLUG_ORDER) {
    const c = bySlug.get(slug)
    if (c) {
      ordered.push(c)
      seen.add(slug)
    }
  }
  for (const c of active) {
    if (!seen.has(c.slug)) ordered.push(c)
  }
  return ordered
}

// Хелпер: все slug для generateStaticParams
export function getCitySlugs(): string[] {
  return cities.filter(c => c.active).map(c => c.slug)
}
