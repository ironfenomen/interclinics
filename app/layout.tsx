import '@/styles/globals.css'
/* Мокап-стили в root layout: всегда в одном графе с globals — не зависят от code-split страницы / не «теряются» при сбое чанков dev */
import '@/styles/mockup-literal.css'
import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { BRAND_DISPLAY_NAME } from '@/lib/brand-display'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext', 'cyrillic-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: `${BRAND_DISPLAY_NAME} — сеть наркологических клиник`,
  description:
    'Вывод из запоя, кодирование, лечение алкоголизма и наркомании. Анонимно, круглосуточно, с лицензией.',
  icons: { icon: '/favicon.ico' },
}

/** viewport-fit=cover — env(safe-area-inset-*) на iPhone / edge-to-edge Android */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={plusJakarta.variable}>
      <body
        className={`${plusJakarta.className} min-h-[100dvh] overflow-x-clip text-[#162334] antialiased [text-size-adjust:100%]`}
      >
        {children}

        {/* Яндекс.Метрика — вставить ID */}
        {/* <script dangerouslySetInnerHTML={{ __html: `...` }} /> */}
      </body>
    </html>
  )
}
