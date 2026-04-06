import '@/styles/mockup-literal.css'
import type { City } from '@/data/cities'
import { getMockupHtml } from './mockup-literal/get-mockup-html'
import { MockupLiteralInit } from './mockup-literal/mockup-literal-init'

/**
 * Лендинг: HTML рендерится на сервере (RSC), клиентский бандл не несёт 200KB html-строки.
 * MockupLiteralInit — тонкий 'use client' без пропов, цепляется через document.querySelector.
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
