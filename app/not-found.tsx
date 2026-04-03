import Link from 'next/link'

/**
 * Страница 404 (в т.ч. при notFound()).
 * https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-[#F8FAFC] px-6 py-16 text-center">
      <div className="max-w-md space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">
          InterClinics · 404
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[#0B1D35] md:text-3xl">
          Страница не найдена
        </h1>
        <p className="text-[15px] leading-relaxed text-[#64748B]">
          Адрес изменился или в ссылке опечатка. Выберите город на главной или воспользуйтесь меню.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-xl bg-[#10B981] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d9668] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]"
      >
        На главную
      </Link>
    </main>
  )
}
