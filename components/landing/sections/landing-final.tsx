import type { City } from '@/data/cities'
import { Reveal } from '../effects/reveal'
import { FinalLeadForm } from './final-lead-form'

export function LandingFinalSection({ city }: { city: City }) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_18%_82%,rgba(16,185,129,.15),transparent_18%),radial-gradient(circle_at_78%_24%,rgba(215,180,105,.14),transparent_22%),linear-gradient(180deg,#061120,#0B1D35_60%,#102A48)] py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.06)_1px,transparent_1px)] bg-[length:26px_26px] [mask-image:linear-gradient(180deg,rgba(0,0,0,.96),transparent_100%)]" />

      <div className="mockup-container relative z-[1] w-full text-center">
        <Reveal>
          <h2 className="mx-auto max-w-[900px] text-[52px] font-extrabold leading-tight tracking-tight text-white max-md:text-[30px]">
            Финальный экран не просто «закрывает страницу», а даёт ещё один сильный шанс на заявку
          </h2>
          <p className="mx-auto mt-4 max-w-[720px] text-lg leading-[1.78] text-[rgba(255,255,255,0.72)]">
            Если пользователь дочитал до конца, значит он уже серьёзно рассматривает обращение. Здесь не нужен новый
            креатив — нужен ясный последний шаг: телефон, простая форма и последние маркеры доверия.
          </p>
          <a
            className="mt-[26px] inline-block text-[44px] font-extrabold tracking-tight text-white max-md:text-[34px]"
            href={`tel:${city.phone}`}
          >
            {city.phoneDisplay}
          </a>
          <FinalLeadForm city={city} />
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            {['Подходит под поисковый трафик', 'Подходит под мультигород', 'Подходит под urgent и trust'].map(t => (
              <span
                key={t}
                className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)] px-3.5 py-2.5 text-[13px] font-bold text-white"
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
