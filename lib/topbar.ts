import type { City } from '@/data/cities'

/**
 * Тексты верхней полосы (topbar) — city-aware, без SEO-спама, укладываются в модерацию Директа.
 * Единая точка для HTML-мокапа и React-обвязки.
 */

/** Склонение для фразы «N …» в live-индикаторе (клиническая бригада / бригады / бригад). */
export function brigadePluralPhrase(n: number): string {
  const k = Math.abs(Math.floor(Number(n))) % 100
  const m = k % 10
  if (k >= 11 && k <= 14) return 'клинических бригад'
  if (m === 1) return 'клиническая бригада'
  if (m >= 2 && m <= 4) return 'клинические бригады'
  return 'клинических бригад'
}

/** Центральная строка: география + режим + конфиденциальность + легитимность. city.name — номинатив. */
export function topbarTrustLine(city: City): string {
  return `${city.name} · 24/7 · анонимное обращение · лицензированная медицинская помощь`
}

/** Краткий медицинский дисклеймер (верхняя зона, не доминирует). */
export const TOPBAR_DISCLAIMER_SHORT =
  'Имеются противопоказания. Нужна консультация специалиста.'

/**
 * Спокойная навигация в контент: снижает трение для горячего интента сильнее, чем FAQ в этой полосе.
 */
export const TOPBAR_MICRO_LINK = {
  href: '#how',
  label: 'Как это работает',
} as const
