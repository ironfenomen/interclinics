import type { ReactNode } from 'react'

/**
 * Стили мокапа нужны всем маршрутам сегмента [city] (лендинг + услуги):
 * Header/Footer/MobileBar используют классы .header, .topbar, .brand, .c из mockup-literal.css.
 * Раньше CSS импортировался только в CityLanding — на /[city]/vyvod-iz-zapoya/ и др. шапка рендерилась без этих правил.
 * Корень «/» этот layout не использует — глобальные стили мокапа на главную-хаб не подмешиваются при первом заходе.
 */
import '@/styles/mockup-literal.css'

export default function CitySegmentLayout({ children }: { children: ReactNode }) {
  return children
}
