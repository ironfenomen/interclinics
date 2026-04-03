import { Reveal } from '../effects/reveal'
import { CallbackButton } from '../ui/callback-button'

export function LandingRouteSection() {
  return (
    <section id="how" className="pb-[94px] pt-[34px] max-md:pb-[76px]">
      <div className="mockup-container grid w-full grid-cols-[1.08fr_0.92fr] gap-[18px] max-[1180px]:grid-cols-1">
        <Reveal>
          <div className="rounded-[24px] border border-[rgba(220,230,241,.9)] bg-[rgba(255,255,255,.88)] p-[26px] shadow-landing">
            <div className="section-title mb-0 max-w-none text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(16,185,129,.12)] px-3.5 py-[7px] text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-2">
                <span className="h-2 w-2 rounded-full bg-gradient-to-br from-gold to-emerald" />
                Как мы ведём пользователя
              </span>
              <h2 className="mt-4 text-[38px] font-extrabold leading-tight tracking-tight text-deep-2 max-md:text-[30px]">
                Сначала снимаем тревогу, потом объясняем путь, потом показываем цену
              </h2>
              <p className="mt-3.5 text-[17px] leading-[1.75] text-ink-muted">
                Именно поэтому блок процесса стоит до прайса: человеку в стрессе нужно понять, что произойдёт после звонка,
                иначе даже хорошая цена не дожмёт заявку.
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                {
                  n: '1',
                  t: 'Звонок или заявка',
                  p: 'Пользователь может действовать сразу: звонок для горячих, форма для тех, кто не готов говорить, и мессенджеры для менее прямого контакта.',
                },
                {
                  n: '2',
                  t: 'Квалификация за минуты, а не за «потом перезвоним»',
                  p: 'Для лидгена под наркологию принципиально важно обещать и визуально подтверждать быстрый отклик: здесь прототип опирается на urgent-first логику.',
                },
                {
                  n: '3',
                  t: 'Выезд, лечение, дальнейший маршрут',
                  p: 'После острой помощи пользователь может быть переведён в сценарий кодирования, лечения зависимости или реабилитации, не ломая общий бренд и UX.',
                },
              ].map(s => (
                <div
                  key={s.n}
                  className="grid grid-cols-[54px_1fr] items-start gap-4 rounded-[18px] border border-line bg-surface-bg p-4"
                >
                  <b className="flex h-[54px] w-[54px] items-center justify-center rounded-[18px] bg-gradient-to-b from-deep-2 to-deep-3 text-[22px] font-extrabold text-white shadow-[0_16px_30px_rgba(11,29,53,.14)]">
                    {s.n}
                  </b>
                  <div>
                    <h4 className="text-lg font-extrabold tracking-[-0.03em] text-deep-2">{s.t}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{s.p}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-[18px] flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-line bg-gradient-to-br from-[#F7FBFF] to-white px-5 py-[18px]">
              <div>
                <strong className="block text-lg font-extrabold tracking-[-0.03em] text-deep-2">
                  Быстрый захват после объяснения процесса
                </strong>
                <p className="mt-1 text-sm text-ink-muted">
                  Пользователь уже понял механику и готов к следующему решению — это идеальный момент повторить CTA.
                </p>
              </div>
              <CallbackButton className="btn-primary-mock shrink-0">Получить звонок</CallbackButton>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-[24px] border border-[rgba(220,230,241,.9)] bg-[rgba(255,255,255,.88)] p-[26px] shadow-landing">
            <div className="section-title mb-0 max-w-none text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(16,185,129,.12)] px-3.5 py-[7px] text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-2">
                <span className="h-2 w-2 rounded-full bg-gradient-to-br from-gold to-emerald" />
                Почему эта логика сильная
              </span>
              <h2 className="mt-4 text-[34px] font-extrabold leading-tight tracking-tight text-deep-2 max-md:text-[30px]">
                Внутри прототипа уже нет «мертвых экранов»
              </h2>
              <p className="mt-3.5 text-[17px] leading-[1.75] text-ink-muted">
                Между первым захватом и финальным CTA не должно быть длинной пустой зоны без возможности действия. Здесь каждый
                крупный этап либо усиливает доверие,
                либо даёт новый повод связаться.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
              {[
                ['+1 CTA', 'после процесса, когда человек уже понимает, как всё проходит'],
                ['3 режима', 'горячий, тёплый и сомневающийся пользователь ведутся разными дорожками'],
                ['1 логика', 'от острой услуги к более длинному лечению без ощущения склейки'],
                ['0 хаоса', 'нет ощущения случайного набора красивых секций ради дизайна'],
              ].map(([a, b]) => (
                <div key={a} className="rounded-[20px] border border-line bg-gradient-to-b from-white to-[#F8FBFF] p-[18px]">
                  <strong className="block text-3xl tracking-tight text-deep-2">{a}</strong>
                  <span className="mt-2 block text-[13px] font-bold leading-snug text-ink-muted">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
