'use client'

import Link from 'next/link'
import { BRAND_DISPLAY_NAME } from '@/lib/brand-display'

/**
 * Граница ошибок сегмента (дети root layout).
 * Без useEffect: в dev после обновления зависимостей редко ломается диспетчер React на границе ошибки.
 * https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  if (typeof console !== 'undefined' && error) {
    const msg = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    console.error(
      '[error.tsx]',
      msg,
      error.digest ? `digest=${error.digest}` : '',
      stack ?? '',
      error,
    )
  }

  const isDev = process.env.NODE_ENV === 'development'
  const devMessage = error instanceof Error ? error.message : String(error ?? '')

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-[#F8FAFC] px-6 py-16 text-center">
      <div className="max-w-md space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">
          {BRAND_DISPLAY_NAME}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[#0B1D35] md:text-3xl">
          Не удалось загрузить страницу
        </h1>
        <p className="text-[15px] leading-relaxed text-[#64748B]">
          Произошла техническая ошибка. Попробуйте обновить страницу или вернуться на главную.
        </p>
        {isDev && (
          <pre className="mt-4 max-h-40 overflow-auto rounded-lg border border-[#E2E8F0] bg-white p-3 text-left text-xs text-[#64748B]">
            {devMessage}
            {error.digest ? `\ndigest: ${error.digest}` : ''}
          </pre>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-[48px] min-w-[160px] items-center justify-center rounded-xl bg-[#10B981] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d9668] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]"
        >
          Попробовать снова
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[48px] min-w-[160px] items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-5 text-sm font-semibold text-[#0B1D35] transition hover:border-[#94A3B8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1D35]"
        >
          На главную
        </Link>
      </div>
    </main>
  )
}
