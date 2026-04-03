import { landingFaqItems } from '@/data/faq-landing'
import { Reveal } from '../effects/reveal'
import { FaqAccordion } from './faq-accordion'

export function LandingFaqSection() {
  return (
    <section id="faq" className="pb-[94px] max-md:pb-[76px]">
      <div className="mockup-container w-full">
        <Reveal>
          <div className="landing-section-head">
            <span className="landing-section-eyebrow">
              <span className="landing-section-eyebrow-dot" aria-hidden />
              FAQ и снятие возражений
            </span>
            <h2>Финальный блок не просто отвечает на вопросы, а помогает дожать решение</h2>
            <p>
              FAQ здесь стоит перед последним CTA, потому что именно в этой точке пользователь обычно колеблется:
              анонимность, цена, скорость, законность и безопасность.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-[1fr_400px] items-start gap-[18px] max-[1180px]:grid-cols-1">
          <Reveal>
            <div className="rounded-[24px] border border-[rgba(220,230,241,.9)] bg-[rgba(255,255,255,.88)] shadow-landing">
              <FaqAccordion items={landingFaqItems} />
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-[24px] border border-[rgba(220,230,241,.9)] bg-[rgba(255,255,255,.88)] p-[26px] shadow-landing">
              <h3 className="text-[28px] font-extrabold leading-tight tracking-tight text-deep-2 max-md:text-[30px]">
                Что делает этот прототип близким к «100/100» именно как прототип
              </h3>
              <p className="mt-3 text-[15px] leading-[1.78] text-ink-muted">
                Не заглушки и не реальный контент — а то, что здесь уже правильно собраны архитектура, путь к действию,
                психология боли, бизнес-логика лидгена и премиальный визуальный язык.
              </p>
              <div className="mt-[18px] grid gap-3">
                {[
                  ['Сильный первый экран', 'Hero одновременно выглядит дорого и не теряет боевой коммерческий фокус.'],
                  ['Нет провалов между CTA', 'Захват есть наверху, после процесса, после цен и внизу страницы.'],
                  ['Разведены интенты', 'Экстренная помощь и длинный цикл лечения больше не конфликтуют между собой.'],
                  [
                    'Есть место под реальное доверие',
                    'Адрес, лицензия, география, исполнитель, врачи и карта встроены в нужные точки UX.',
                  ],
                ].map(([strong, span]) => (
                  <div key={strong} className="rounded-[18px] border border-line bg-surface-bg px-4 py-4">
                    <strong className="block text-[15px] font-extrabold tracking-tight text-deep-2">{strong}</strong>
                    <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-muted">{span}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
