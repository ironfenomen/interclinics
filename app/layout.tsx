import '@/styles/globals.css'
/* Мокап-стили в root layout: всегда в одном графе с globals — не зависят от code-split страницы / не «теряются» при сбое чанков dev */
import '@/styles/mockup-literal.css'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext', 'cyrillic-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'InterClinics — сеть наркологических клиник',
  description:
    'Вывод из запоя, кодирование, лечение алкоголизма и наркомании. Анонимно, круглосуточно, с лицензией.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={plusJakarta.variable}>
      <body
        className={`${plusJakarta.className} text-[#162334] antialiased`}
      >
        {children}

        {/* Яндекс.Метрика — вставить ID */}
        {/* <script dangerouslySetInnerHTML={{ __html: `...` }} /> */}
      </body>
    </html>
  )
}
