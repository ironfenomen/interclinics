import dynamic from 'next/dynamic'
import type { City } from '@/data/cities'
import { getMockupHtml } from './mockup-literal/get-mockup-html'

const MockupLiteralInit = dynamic(
  () => import('./mockup-literal/mockup-literal-init').then(m => ({ default: m.MockupLiteralInit })),
  { ssr: false },
)

/**
 * Лендинг: HTML рендерится на сервере (RSC), клиентский бандл не несёт 200KB html-строки.
 * MockupLiteralInit — отдельный чанк после первой отрисовки (PSI: меньше initial JS).
 */
export function CityLanding({ city }: { city: City }) {
  const html = getMockupHtml(city)
  return (
    <div className="ic-mockup-shell min-h-[100dvh]">
      <div
        className="ic-mockup-root min-h-[100dvh]"
        dangerouslySetInnerHTML={{ __html: html }}
        suppressHydrationWarning
      />
      <MockupLiteralInit />
    </div>
  )
}
