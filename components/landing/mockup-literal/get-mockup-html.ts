import fs from 'node:fs'
import path from 'node:path'

import { getActiveCities, getCityBySlug, type City } from '@/data/cities'
import { buildMockupFooterLegalHtml } from '@/lib/footer-legal-mockup'
import {
  brigadePluralPhrase,
  TOPBAR_DISCLAIMER_SHORT,
  TOPBAR_MICRO_LINK,
  topbarTrustLine,
} from '@/lib/topbar'
import { MOCKUP_HOW_WE_WORK_SECTION_INNER } from '@/lib/mockup-how-we-work-section'

let cachedTemplate: string | null = null

function loadTemplate(): string {
  if (cachedTemplate) return cachedTemplate
  const p = path.join(process.cwd(), 'components/landing/mockup-literal/mockup-body.template.html')
  cachedTemplate = fs.readFileSync(p, 'utf8')
  return cachedTemplate
}

function fmt(n: number): string {
  return new Intl.NumberFormat('ru-RU').format(n)
}

/** Подпись к счётчику городов («1 город в сети» / «8 городов в сети»). */
function trustCitiesUnit(count: number): string {
  const k = Math.abs(Math.floor(count)) % 100
  const m = k % 10
  if (k >= 11 && k <= 14) return 'городов в сети'
  if (m === 1) return 'город в сети'
  if (m >= 2 && m <= 4) return 'города в сети'
  return 'городов в сети'
}

function districtsHtml(city: City): string {
  return city.districts.map(d => `<span>${d}</span>`).join('')
}

/** Верхняя граница «дальней» зоны для подписи на схеме (минуты). */
function arrivalMaxMinutes(city: City): number {
  return Math.min(60, Math.max(45, city.arrivalTime + 15))
}

/** Адреса: локальная точка → стационар в городе → стационар в другом городе → отдельный адрес приёма. */
function coverageAddressHtml(city: City): string {
  const blocks: string[] = []
  const partner = city.partnerAddress?.trim() ?? ''
  const st = city.stacionarAddress?.trim() ?? ''

  if (!city.hasStacionar && partner) {
    blocks.push(`<div class="coverage-address coverage-address--local">
      <div class="coverage-address__title">Очной приём в городе</div>
      <p class="coverage-address__text">${partner}</p>
      <p class="coverage-address__hint">Здесь согласуют визит, консультацию и маршрут помощи, в том числе при необходимости стационара в другом пункте сети.</p>
    </div>`)
  }

  if (city.hasStacionar && st) {
    const beds =
      typeof city.stacionarBeds === 'number'
        ? ` Коечный фонд — до ${city.stacionarBeds} мест.`
        : ''
    blocks.push(`<div class="coverage-address coverage-address--primary">
      <div class="coverage-address__title">Стационар и круглосуточный приём</div>
      <p class="coverage-address__text">${st}</p>
      <p class="coverage-address__hint">Госпитализация и наблюдение — по показаниям, после оценки врача или в остром случае.${beds}</p>
    </div>`)
  }

  if (!city.hasStacionar && city.nearestStacionarSlug) {
    const n = getCityBySlug(city.nearestStacionarSlug)
    const km =
      typeof city.nearestStacionarDistance === 'number'
        ? ` Расстояние ориентировочно около ${city.nearestStacionarDistance} км.`
        : ''
    if (n) {
      blocks.push(`<div class="coverage-address coverage-address--network">
        <div class="coverage-address__title">Стационар сети</div>
        <p class="coverage-address__text">Стационарное лечение для жителей ${city.nameGen} организуем в ${n.namePrep}.${km}</p>
        <p class="coverage-address__hint">Направление и перевозка — по решению врача и договорённости с семьёй.</p>
      </div>`)
    }
  }

  if (city.hasStacionar && partner && partner !== st) {
    blocks.push(`<div class="coverage-address coverage-address--secondary">
      <div class="coverage-address__title">Очной приём и администрация</div>
      <p class="coverage-address__text">${partner}</p>
      <p class="coverage-address__hint">Запись, консультации и согласование формата помощи — по договорённости.</p>
    </div>`)
  }

  if (blocks.length === 0 && partner) {
    blocks.push(`<div class="coverage-address">
      <div class="coverage-address__title">Приём и связь</div>
      <p class="coverage-address__text">${partner}</p>
    </div>`)
  }

  return blocks.join('')
}

function coverageLocalHtml(city: City): string {
  const t = city.localText?.trim()
  if (!t) return ''
  return `<p class="coverage-local">${t}</p>`
}

function waHref(city: City): string {
  const digits = city.whatsapp.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : '#'
}

function tgHref(city: City): string {
  const t = city.telegram?.trim()
  if (!t) return '#'
  return t.startsWith('http') ? t : `https://t.me/${t.replace(/^@/, '')}`
}

/** Адрес / ближайший центр для блока стационара на лендинге. */
function stacionarMetaHtml(city: City): string {
  if (city.hasStacionar && city.stacionarAddress) {
    const beds =
      typeof city.stacionarBeds === 'number' ? ` · коечный фонд до ${city.stacionarBeds}` : ''
    return `<p class="stacionar-meta">${city.stacionarAddress}${beds}</p>`
  }
  if (!city.hasStacionar && city.nearestStacionarSlug) {
    const n = getCityBySlug(city.nearestStacionarSlug)
    if (n) {
      const km =
        typeof city.nearestStacionarDistance === 'number'
          ? ` · ориентир ${city.nearestStacionarDistance} км`
          : ''
      return `<p class="stacionar-meta stacionar-meta--nearest">Стационарное лечение для пациентов из ${city.name} организуем в клинике в ${n.namePrep}${km}. Программы и стоимость ниже — для этого центра.</p>`
    }
  }
  return ''
}

function rehabProgramNoteHtml(city: City): string {
  if (!city.rehabProgram?.trim()) return ''
  return `<p class="rehab-program-note">В групповой части используем формат <strong>«${city.rehabProgram}»</strong> наряду с индивидуальной поддержкой.</p>`
}

function escSwitcherText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Премиальный переключатель города в шапке: список из getActiveCities(). */
function citySwitcherHtml(current: City): string {
  const list = getActiveCities()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  const items = list
    .map(c => {
      const name = escSwitcherText(c.name)
      const isCurrent = c.slug === current.slug
      const check = isCurrent
        ? `<span class="city-switcher__check" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>`
        : `<span class="city-switcher__check city-switcher__check--spacer" aria-hidden="true"></span>`
      if (isCurrent) {
        return `<span class="city-switcher__item city-switcher__item--current" role="option" aria-selected="true" aria-current="true">${check}<span class="city-switcher__item-label">${name}</span></span>`
      }
      return `<a class="city-switcher__item" role="option" href="/${escSwitcherText(c.slug)}/" aria-selected="false">${check}<span class="city-switcher__item-label">${name}</span></a>`
    })
    .join('')

  const curName = escSwitcherText(current.name)

  return `<div class="city-switcher" data-city-switcher>
  <button type="button" class="city-chip city-chip--trigger" data-city-switcher-trigger aria-expanded="false" aria-haspopup="listbox" aria-controls="city-switcher-panel" id="city-switcher-btn">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    <span class="city-chip__label">${curName}</span>
    <svg class="city-chip__chevron" width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  </button>
  <div class="city-switcher__panel" id="city-switcher-panel" data-city-switcher-panel role="listbox" aria-labelledby="city-switcher-btn" hidden>
    <div class="city-switcher__title">Выберите город</div>
    <div class="city-switcher__list">${items}</div>
  </div>
</div>`
}

/** HTML тела страницы — буквальный мокап + подстановки города (без изменения визуала макета). */
export function getMockupHtml(city: City): string {
  const t = loadTemplate()
  return t
    .replaceAll('__HOW_WE_WORK_SECTION__', MOCKUP_HOW_WE_WORK_SECTION_INNER)
    .replaceAll('__PHONE__', city.phone.replace(/\s/g, ''))
    .replaceAll('__PHONE_DISPLAY__', city.phoneDisplay)
    .replaceAll('__CITY_NAME__', city.name)
    .replaceAll('__CITY_SWITCHER__', citySwitcherHtml(city))
    .replaceAll('__TOPBAR_BRIGADE_WORDS__', brigadePluralPhrase(city.teamsAvailable))
    .replaceAll('__TOPBAR_TRUST_LINE__', topbarTrustLine(city))
    .replaceAll('__TOPBAR_DISCLAIMER__', TOPBAR_DISCLAIMER_SHORT)
    .replaceAll('__TOPBAR_LINK_HREF__', TOPBAR_MICRO_LINK.href)
    .replaceAll('__TOPBAR_LINK_LABEL__', TOPBAR_MICRO_LINK.label)
    .replaceAll('__CITY_PREP__', city.namePrep)
    .replaceAll('__ARRIVAL__', String(city.arrivalTime))
    .replaceAll('__TEAMS__', String(city.teamsAvailable))
    .replaceAll('__P_BASE__', fmt(city.priceBase))
    .replaceAll('__P_VYVOD_FROM__', fmt(city.priceVyvodFrom))
    .replaceAll('__P_NARK__', fmt(city.priceNarkolog))
    .replaceAll('__P_CODE__', fmt(city.priceCoding))
    .replaceAll('__P_ENH__', fmt(city.priceEnhanced))
    .replaceAll('__P_MAX__', fmt(city.priceMax))
    .replaceAll('__DISTRICTS__', districtsHtml(city))
    .replaceAll('__COVERAGE_ADDRESS_HTML__', coverageAddressHtml(city))
    .replaceAll('__COVERAGE_LOCAL_HTML__', coverageLocalHtml(city))
    .replaceAll('__ARRIVAL_MAX__', String(arrivalMaxMinutes(city)))
    .replaceAll('__FOOTER_LEGAL__', buildMockupFooterLegalHtml(city))
    .replaceAll('__HOME_HREF__', `/${city.slug}/`)
    .replaceAll('__TRUST_ACTIVE_CITIES__', String(getActiveCities().length))
    .replaceAll('__TRUST_CITIES_UNIT__', trustCitiesUnit(getActiveCities().length))
    .replaceAll('__CITY_SLUG__', city.slug)
    .replaceAll('__PRICE_STACIONAR_DAY__', fmt(city.priceStacionarDay))
    .replaceAll('__P_STAC_DETOX__', fmt(city.priceStacionarDetox))
    .replaceAll('__P_STAC_STANDARD__', fmt(city.priceStacionarStandard))
    .replaceAll('__P_STAC_FULL__', fmt(city.priceStacionarFull))
    .replaceAll('__STACIONAR_META_HTML__', stacionarMetaHtml(city))
    .replaceAll('__P_REHAB_DAY__', fmt(city.priceRehabDay))
    .replaceAll('__P_REHAB_28__', fmt(city.priceRehab28))
    .replaceAll('__P_REHAB_90__', fmt(city.priceRehab90))
    .replaceAll('__P_REHAB_6MO__', fmt(city.priceRehab6Mo))
    .replaceAll('__REHAB_PROGRAM_NOTE_HTML__', rehabProgramNoteHtml(city))
    .replaceAll('__WA_HREF__', waHref(city))
    .replaceAll('__TG_HREF__', tgHref(city))
}
