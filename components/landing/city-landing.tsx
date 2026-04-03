import type { City } from '@/data/cities'
import { getMockupHtml } from './mockup-literal/get-mockup-html'
import { MockupLiteralShell } from './mockup-literal/mockup-literal-shell'

/** Лендинг: буквальный HTML/CSS из interclinics-mockup-100-final.html + подстановки города. */
export function CityLanding({ city }: { city: City }) {
  const html = getMockupHtml(city)
  return <MockupLiteralShell html={html} />
}
