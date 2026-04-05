import { isStavropolCity, type City } from '@/data/cities'
import { Reveal } from '../effects/reveal'
import { CallbackButton } from '../ui/callback-button'
import { HeroFormPanel } from './hero-form-panel'

export function LandingHero({ city }: { city: City }) {
  return (
    <section className="landing-hero-dots relative overflow-hidden bg-[radial-gradient(circle_at_12%_16%,rgba(215,180,105,.16),transparent_18%),radial-gradient(circle_at_88%_14%,rgba(16,185,129,.16),transparent_20%),radial-gradient(circle_at_80%_85%,rgba(255,255,255,.06),transparent_26%),linear-gradient(180deg,#061120_0%,#0B1D35_52%,#143252_100%)] pt-[56px] pb-[26px] max-md:pt-[38px] max-md:pb-5">
      <div className="mockup-container relative z-[1] grid w-full grid-cols-[minmax(0,1.12fr)_minmax(390px,0.88fr)] items-center gap-[34px] max-[1180px]:grid-cols-1 max-md:gap-[22px]">
        <Reveal>
          <div className="py-8 max-md:py-3">
            <div className="mb-[22px] flex flex-wrap gap-[10px]">
              {[
                isStavropolCity(city) ? 'Выезд в течение 30 минут' : 'Координация выезда на дом',
                'Подходит под мультигородскую архитектуру',
                'Сделано под Яндекс Директ',
              ].map(t => (
                <div
                  key={t}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.08)] px-[14px] py-[9px] text-[12px] font-extrabold text-white"
                >
                  <span className="h-2 w-2 rounded-full bg-gold" />
                  {t}
                </div>
              ))}
            </div>

            <h1 className="max-w-[760px] text-balance break-words text-[34px] font-extrabold leading-[1.01] tracking-[-0.055em] text-white min-[769px]:text-[44px] min-[1025px]:text-[50px] min-[1181px]:text-[60px] max-[380px]:text-[28px]">
              <span className="text-gold">Экстренная наркологическая помощь</span>, кодирование и реабилитация{' '}
              <em className="not-italic text-[#dffcef]">в {city.namePrep}</em> — premium performance prototype
            </h1>

            <p className="mt-[18px] max-w-[640px] text-[18px] font-normal leading-[1.78] text-[rgba(255,255,255,0.76)] max-md:text-base">
              Здесь уже собран не просто красивый медицинский экран, а прототип платформы, которая умеет разделять горячий
              вызов, домашний выезд врача, кодирование и длинный цикл восстановления. Логика страницы выстроена под
              стрессовый спрос, быстрый захват, доверие и масштабирование по городам.
            </p>

            <div className="mt-[22px] flex flex-wrap gap-[10px]">
              {['Вывод из запоя', 'Нарколог на дом', 'Кодирование', 'Реабилитация'].map(l => (
                <a
                  key={l}
                  href="#services"
                  className="rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.08)] px-[14px] py-[10px] text-[13px] font-bold text-white"
                >
                  {l}
                </a>
              ))}
            </div>

            <div className="mt-[28px] flex flex-wrap gap-[12px]">
              <a className="btn-primary-mock" href={`tel:${city.phone}`}>
                Позвонить сейчас
              </a>
              <CallbackButton className="btn-dark-mock">Получить консультацию</CallbackButton>
            </div>

            <div className="mt-[32px] grid max-w-[760px] grid-cols-3 gap-[14px] max-md:grid-cols-1">
              {[
                { t: '1 поле', d: 'Форма не создает трения и подходит для стрессового интента' },
                { t: '4 сценария', d: 'Экстренная помощь, кодирование, лечение зависимости, реабилитация' },
                { t: '2 уровня CTA', d: 'Прямой звонок для горячих и обратный звонок для сомневающихся' },
              ].map(x => (
                <div
                  key={x.t}
                  className="rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] p-[16px] backdrop-blur-[8px]"
                >
                  <strong className="block text-[20px] font-extrabold leading-none text-white">{x.t}</strong>
                  <span className="mt-[5px] block text-[13px] font-semibold leading-[1.45] text-[rgba(255,255,255,0.6)]">
                    {x.d}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <HeroFormPanel city={city} />
        </Reveal>
      </div>
    </section>
  )
}
