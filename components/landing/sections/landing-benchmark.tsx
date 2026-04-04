import { BRAND_DISPLAY_NAME } from '@/lib/brand-display'
import { Reveal } from '../effects/reveal'

const usItems = [
  ['Интент', 'Сценарии разделены уже в hero и не перемешаны на одном уровне восприятия.'],
  ['Путь', 'Пользователь понимает, что делать дальше, практически на каждом экране.'],
  ['Цена', 'Прайс не спрятан слишком далеко и не вывален без контекста процесса.'],
  ['Доверие', 'География, врачи, кейсы, отзывы и FAQ работают как единая система, а не случайный набор блоков.'],
  ['Рост', 'Основа годится для city/service модели и performance-запусков в разных гео.'],
] as const

const clinicItems = [
  ['Проблема', 'Слишком общая главная, где всё смешано: услуги, лицензии, статьи, врачи, новости и акции.'],
  ['Проблема', 'Цена либо спрятана, либо дана без структуры и не помогает принять решение.'],
  ['Проблема', 'Мало промежуточных CTA и плохой ритм между секциями.'],
  ['Проблема', 'Доверие чаще подаётся декларациями, а не маршрутом и интерфейсом.'],
] as const

const aggItems = [
  ['Проблема', 'Слабая принадлежность к городу и ощущение неясного исполнителя услуги.'],
  ['Проблема', 'Путь к заявке есть, но доверие не держит тяжёлый медицинский.'],
  ['Проблема', 'Визуально может быть ярко, но логика выбора и ответственности размыта.'],
  ['Проблема', 'Плохо подходит под долгий цикл реабилитации и сложные семейные решения.'],
] as const

export function LandingBenchmarkSection() {
  return (
    <section id="benchmark" className="bg-gradient-to-b from-white to-[#F7FAFD] pb-[94px] max-md:pb-[76px]">
      <div className="mockup-container w-full">
        <Reveal>
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-b from-[#0A1727] to-[#10253D] p-[26px] text-white shadow-landingLg before:pointer-events-none before:absolute before:-bottom-[120px] before:-right-[140px] before:h-[340px] before:w-[340px] before:rounded-full before:bg-[radial-gradient(circle,rgba(215,180,105,.22),transparent_66%)]">
            <div className="relative z-[1] mb-[22px] flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-[760px]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,.08)] px-3.5 py-[7px] text-xs font-extrabold text-white">
                  Почему это уже уровень выше среднего рынка
                </span>
                <h3 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight max-md:text-[30px]">
                  Прототип сравнивает себя не с «идеалом в голове», а с тем, что пользователь реально видит на рынке:
                  шаблонные сайты и агрегаторную кашу
                </h3>
              </div>
              <p className="max-w-[430px] text-[15px] leading-[1.75] text-[rgba(255,255,255,0.68)]">
                Самый жёсткий вопрос для оценки: почему человек должен остаться именно здесь? Ответ должен быть
                архитектурным, а не только визуальным.
              </p>
            </div>

            <div className="relative z-[1] grid grid-cols-[1.15fr_0.85fr_0.85fr] gap-3.5 max-lg:grid-cols-1">
              <div className="rounded-[24px] border border-[rgba(16,185,129,0.32)] bg-gradient-to-b from-[rgba(16,185,129,.18)] to-[rgba(255,255,255,.08)] p-[22px] backdrop-blur-[8px]">
                <h4 className="text-lg font-extrabold tracking-tight">{BRAND_DISPLAY_NAME} / premium performance prototype</h4>
                <p className="mt-2 text-[13px] leading-relaxed text-[rgba(255,255,255,0.64)]">
                  Собран как управляемая конверсионная система: горячий вызов, product split, доверие, mid-CTA, география,
                  сравнение и мультигородская масштабируемость.
                </p>
                <ul className="mt-[18px] grid list-none gap-3">
                  {usItems.map(([b, t]) => (
                    <li
                      key={b}
                      className="rounded-2xl bg-[rgba(255,255,255,0.09)] px-3.5 py-3 text-[13px] font-bold leading-relaxed"
                    >
                      <b className="mb-1 block text-xs font-extrabold uppercase tracking-[0.11em] text-white">{b}</b>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[24px] border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,.06)] p-[22px] backdrop-blur-[8px]">
                <h4 className="text-lg font-extrabold tracking-tight">Типичный сайт клиники</h4>
                <p className="mt-2 text-[13px] leading-relaxed text-[rgba(255,255,255,0.64)]">
                  Часто выглядит прилично, но думает не о срочном спросе, а о «присутствии в интернете». Отсюда слабая
                  лидогенерация в горячей нише.
                </p>
                <ul className="mt-[18px] grid list-none gap-3">
                  {clinicItems.map(([b, t]) => (
                    <li key={t} className="rounded-2xl bg-[rgba(255,255,255,.06)] px-3.5 py-3 text-[13px] font-bold leading-relaxed">
                      <b className="mb-1 block text-xs font-extrabold uppercase tracking-[0.11em] text-white">{b}</b>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[24px] border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,.06)] p-[22px] backdrop-blur-[8px]">
                <h4 className="text-lg font-extrabold tracking-tight">Агрегатор / псевдосеть</h4>
                <p className="mt-2 text-[13px] leading-relaxed text-[rgba(255,255,255,0.64)]">
                  Может перехватывать трафик, но редко создаёт ощущение надёжного маршрута. Часто пользователь чувствует
                  «меня сейчас куда-то перекинут».
                </p>
                <ul className="mt-[18px] grid list-none gap-3">
                  {aggItems.map(([b, t]) => (
                    <li key={t} className="rounded-2xl bg-[rgba(255,255,255,.06)] px-3.5 py-3 text-[13px] font-bold leading-relaxed">
                      <b className="mb-1 block text-xs font-extrabold uppercase tracking-[0.11em] text-white">{b}</b>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative z-[1] mt-[18px] flex flex-wrap gap-3">
              {[
                'Сильный urgent-first UX',
                'Понятное отличие от шаблонных сайтов',
                'Масштабируется по гео и услугам',
                'Выглядит дорого без потери конверсии',
              ].map(t => (
                <div
                  key={t}
                  className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,.08)] px-3.5 py-2.5 text-xs font-extrabold text-white"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
