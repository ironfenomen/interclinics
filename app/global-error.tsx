'use client'

import { BRAND_DISPLAY_NAME } from '@/lib/brand-display'

/**
 * Последняя линия защиты: ошибки в root layout.
 * Обязательны собственные теги html и body (без root layout).
 * Без хуков — стабильнее в dev при смене версий React/Next.
 * https://nextjs.org/docs/app/api-reference/file-conventions/global-error
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  if (typeof console !== 'undefined' && error) {
    console.error(error)
  }

  return (
    <html lang="ru">
      <body className="m-0 min-h-[100dvh] bg-[#F8FAFC] font-sans text-[#1E293B] antialiased">
        <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 py-16 text-center">
          <div className="max-w-md space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">
              {BRAND_DISPLAY_NAME}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-[#0B1D35]">
              Критическая ошибка
            </h1>
            <p className="text-[15px] leading-relaxed text-[#64748B]">
              Сайт временно недоступен. Обновите страницу или зайдите позже.
            </p>
          </div>
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-xl bg-[#10B981] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d9668] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]"
          >
            Обновить
          </button>
        </main>
      </body>
    </html>
  )
}
