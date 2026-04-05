'use client'

// components/FAQ.tsx — variant="vyvod" | "stacionar" | "narkolog" | "kodirovanie" | "reabilitaciya"; иначе — общий набор для прочих посадочных
import { useState } from 'react'
import { City, isStavropolCity } from '@/data/cities'
import styles from './FAQ.module.css'

type FaqVariant = 'vyvod' | 'stacionar' | 'narkolog' | 'kodirovanie' | 'reabilitaciya' | undefined

export default function FAQ({ city, variant }: { city: City; variant?: FaqVariant }) {
  const [openIdx, setOpenIdx] = useState(0)

  if (variant === 'vyvod') {
    const items = [
      {
        q: 'Насколько конфиденциально обращение?',
        a: `Организация выезда — без рекламы на машине. Персональные данные обрабатываем в соответствии с политикой конфиденциальности; на линии можно спокойно уточнить, какие сведения вам важно минимизировать. Полные исключения для передачи данных возможны не во всех ситуациях — при экстренной угрозе жизни действуют правила медицинской помощи.`,
      },
      {
        q: 'Что входит в выезд и как формируется цена?',
        a: `В выезд входят осмотр врача‑нарколога, помощь по показаниям и рекомендации. Ориентир по стоимости на странице — от ${city.priceVyvodFrom.toLocaleString('ru')} ₽; итог согласуется после осмотра с учётом объёма помощи. Первичный контакт на линии — без оплаты за сам разговор.`,
      },
      {
        q: 'Сколько обычно длится помощь на дому?',
        a: `Зависит от состояния и выбранного формата: ориентир по времени на месте — от примерно часа до нескольких часов. Врач заранее пояснит, если потребуется дольше или если план нужно скорректировать по ходу осмотра.`,
      },
      {
        q: 'Когда помощь на дому уместна, а когда может понадобиться стационар?',
        a: `Решает врач по клинической картине: тяжесть состояния, риски, сопутствующие заболевания. На дому оказывают помощь, когда это безопасно и оправдано. При показаниях к круглосуточному наблюдению обсуждают госпитализацию — спокойно, без давления и без обещаний «всегда можно дома».`,
      },
      {
        q: 'Что делать, если состояние очень тяжёлое?',
        a: `При непосредственной угрозе жизни вызывайте скорую помощь (112). Если вы обращаетесь к нам, диспетчер и врач помогут оценить срочность и маршрут: выезд бригады или направление в стационар — в зависимости от ситуации.`,
      },
      {
        q: 'Бывают ли скрытые доплаты после приезда?',
        a: `Объём помощи и стоимость согласуются после осмотра, до продолжения лечебных действий. Если по ходу осмотра нужен иной объём, врач объяснит причину до того, как вы принимаете решение.`,
      },
      {
        q: 'Кто приезжает на вызов?',
        a: `На выезд направляется врач‑нарколог; при необходимости к нему присоединяется персонал по регламенту клиники. При записи уточняют адрес, время и сценарий обращения.`,
      },
      {
        q: 'Можно ли обратиться за взрослого близкого человека?',
        a: `Да, так часто и делают. Принудительного лечения взрослого без законных оснований нет; согласие на медицинское вмешательство — в рамках действующих правил. На линии подскажут, как корректно выстроить разговор и согласование.`,
      },
    ]

    return (
      <section className={styles.section} aria-labelledby="faq-vyvod-title">
        <div className="c">
          <div className={styles.inner}>
            <header className={styles.header}>
              <p className={styles.kicker}>Перед обращением</p>
              <h2 id="faq-vyvod-title" className={styles.title}>
                Вопросы про вывод из запоя на дому
              </h2>
              <p className={styles.subtitle}>
                Коротко о том, что волнует чаще всего: конфиденциальность, формат помощи, время, стационар и стоимость. Без обещаний «как у всех» — только честная логика маршрута.
              </p>
            </header>

            <div className={styles.list}>
              {items.map((it, i) => {
                const open = openIdx === i
                return (
                  <div key={i} className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
                    <button
                      type="button"
                      className={styles.trigger}
                      onClick={() => setOpenIdx(open ? -1 : i)}
                      aria-expanded={open}
                      aria-controls={`faq-vyvod-panel-${i}`}
                      id={`faq-vyvod-trigger-${i}`}
                    >
                      <span className={styles.question}>{it.q}</span>
                      <span
                        className={`${styles.iconWrap} ${open ? styles.iconWrapOpen : ''}`}
                        aria-hidden
                      >
                        <svg
                          className={`${styles.icon} ${open ? styles.iconOpen : ''}`}
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                    <div
                      className={`${styles.answerGrid} ${open ? styles.answerGridOpen : ''}`}
                      id={`faq-vyvod-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-vyvod-trigger-${i}`}
                    >
                      <div className={styles.answerInner}>
                        <p className={styles.answer}>{it.a}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'narkolog') {
    const items = [
      {
        q: 'Сколько стоит выезд нарколога?',
        a: `Ориентир — от ${city.priceNarkolog.toLocaleString('ru')} ₽ за выезд. Точную сумму согласуем после осмотра, с учётом объёма помощи и до продолжения процедур. У диспетчера при записи можно уточнить первичные условия.`,
      },
      {
        q: 'За какое время приезжает врач?',
        a: isStavropolCity(city)
          ? `В ${city.namePrep} ориентир — около ${city.arrivalTime} минут. Точнее будет при записи: учитывают район, дорогу и загрузку линии; названный интервал при необходимости обновляют.`
          : `В ${city.namePrep} срок приезда согласуют при записи: учитывают район, дорогу и загрузку линии — без универсальных цифр до звонка и без фиксированных «минут для всех» на странице.`,
      },
      {
        q: 'Что входит в выезд и как проходит визит?',
        a: `На месте — осмотр и оценка состояния, затем помощь по показаниям и рекомендации на ближайшее время. Объём определяет только очный осмотр.`,
      },
      {
        q: 'Как защищены персональные данные?',
        a: `Обрабатываем персональные данные в соответствии с законом и политикой конфиденциальности; сведения о помощи — в рамках врачебной тайны. Передачу третьим лицам допускаем только там, где это прямо предусмотрено законом. Формат выезда и границы сведений можно уточнить на линии.`,
      },
      {
        q: 'Когда на дому достаточно, а когда нужен стационар?',
        a: `Решение — после очного осмотра. На дому остаёмся, если это безопасно и соответствует показаниям. При необходимости круглосуточного наблюдения или при высоком риске обсудим госпитализацию и дальнейший маршрут — без давления и без обещаний, что «дома всегда достаточно».`,
      },
      {
        q: 'Кто приезжает на вызов?',
        a: `На выезд — врач‑нарколог; при необходимости к нему может присоединиться ещё один специалист — по сценарию и стандарту клиники. Сроки и адрес фиксируют при записи.`,
      },
      {
        q: 'Можно ли вызвать врача за взрослого близкого?',
        a: `Да, так обращаются часто. Принудительного лечения взрослого без законных оснований нет: вмешательство — с согласия пациента в порядке, установленном для медицинской помощи. На линии помогут согласовать визит и разговор с близким.`,
      },
      {
        q: 'Что делать при очень тяжёлом состоянии?',
        a: `При непосредственной угрозе жизни вызывайте скорую помощь (112). Если обращаетесь к нам, на линии оценят срочность и маршрут: выезд нарколога или госпитализация — по ситуации.`,
      },
    ]

    return (
      <section className={`${styles.section} ${styles.faqNarkolog} ic-faq-narkolog`} aria-labelledby="faq-narkolog-title">
        <div className="c">
          <div className={styles.inner}>
            <header className={styles.header}>
              <p className={styles.kicker}>Перед вызовом врача</p>
              <h2 id="faq-narkolog-title" className={styles.title}>
                Вопросы о выезде нарколога
              </h2>
              <p className={styles.subtitle}>
                Стоимость, срок приезда, организация выезда, конфиденциальность и критерии дома или стационара — кратко до разговора.
              </p>
            </header>

            <div className={styles.list}>
              {items.map((it, i) => {
                const open = openIdx === i
                return (
                  <div key={i} className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
                    <button
                      type="button"
                      className={styles.trigger}
                      onClick={() => setOpenIdx(open ? -1 : i)}
                      aria-expanded={open}
                      aria-controls={`faq-narkolog-panel-${i}`}
                      id={`faq-narkolog-trigger-${i}`}
                    >
                      <span className={styles.question}>{it.q}</span>
                      <span
                        className={`${styles.iconWrap} ${open ? styles.iconWrapOpen : ''}`}
                        aria-hidden="true"
                      >
                        <svg
                          className={`${styles.icon} ${open ? styles.iconOpen : ''}`}
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                    <div
                      className={`${styles.answerGrid} ${open ? styles.answerGridOpen : ''}`}
                      id={`faq-narkolog-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-narkolog-trigger-${i}`}
                    >
                      <div className={styles.answerInner}>
                        <p className={styles.answer}>{it.a}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'kodirovanie') {
    const items = [
      {
        q: 'Когда уместно кодирование?',
        a: `Сначала — снятие острой интоксикации и при необходимости детоксикация по показаниям, затем устойчивое трезвое состояние; достаточную длительность периода оценивает врач. Кодирование без очного осмотра и согласования плана не проводят — в том числе «на следующий день после запоя».`,
      },
      {
        q: 'Сколько держать трезвость перед процедурой?',
        a: `Частый ориентир — не менее 3–5 дней устойчивой трезвости; при иных показаниях срок может быть другим. Точное значение зависит от динамики, сопутствующих факторов и метода — его задают на очной консультации, а не в формате общих фраз по телефону.`,
      },
      {
        q: 'Как врач выбирает метод?',
        a: `По осмотру, анамнезу и вашим целям: показания, риски, переносимость, понимание режима после процедуры. Метод подбирают вместе с вами, индивидуально; без осмотра не выбирают «самый сильный» формат.`,
      },
      {
        q: 'Чем медикаментозное кодирование отличается от психотерапевтического?',
        a: `В медикаментозных форматах основа — препараты и наблюдение после введения; в психотерапевтических — работа с установками и мотивацией по выбранному методу. Иногда обсуждают сочетание. Ни один формат не заменяет дальнейшую поддержку и образ жизни: это этап плана, а не разовое «нажатие кнопки».`,
      },
      {
        q: 'Есть ли противопоказания?',
        a: `Да, их оценивает врач: тяжёлые соматические состояния, острые психические расстройства вне контроля, беременность и другие ситуации могут ограничивать вмешательство или стать поводом отложить процедуру. Полный перечень в одном ответе невозможен — окончательное решение после очной оценки.`,
      },
      {
        q: 'Как долго действует кодирование?',
        a: `Зависит от метода: у имплантов и инъекций — ориентир по периоду действия препарата; у курсов и психотерапевтических форматов — другой срок и план наблюдения. Цифры на сайте — ориентир; детали при изменении состояния обсуждают с врачом при планировании.`,
      },
      {
        q: 'Можно записаться на консультацию за взрослого близкого?',
        a: `Да, так часто делают. Взрослого без законных оснований к лечению не принуждают; согласие на медицинское вмешательство оформляют так, как это предусмотрено для такой помощи. На линии подскажут, как согласовать визит и разговор о консультации по кодированию.`,
      },
      {
        q: 'Если сначала нужны детоксикация или стационар?',
        a: `Если безопаснее сначала стабилизировать состояние в стационаре или пройти детоксикацию, врач объяснит последовательность: сначала этот этап, затем при показаниях — обсуждение кодирования. Важна безопасная пошаговая помощь, а не «успеть закодировать любой ценой».`,
      },
    ]

    return (
      <section
        className={`${styles.section} ${styles.faqKodirovanie} ic-faq-kodirovanie`}
        aria-labelledby="faq-kodirovanie-title"
      >
        <div className="c">
          <div className={styles.inner}>
            <header className={styles.header}>
              <p className={styles.kicker}>Перед консультацией по кодированию</p>
              <h2 id="faq-kodirovanie-title" className={styles.title}>
                Вопросы о кодировании
              </h2>
              <p className={styles.subtitle}>
                Сроки, методы и ограничения в {city.namePrep} — по делу, без обещаний «универсального» результата.
              </p>
            </header>

            <div className={styles.list}>
              {items.map((it, i) => {
                const open = openIdx === i
                return (
                  <div key={i} className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
                    <button
                      type="button"
                      className={styles.trigger}
                      onClick={() => setOpenIdx(open ? -1 : i)}
                      aria-expanded={open}
                      aria-controls={`faq-kodirovanie-panel-${i}`}
                      id={`faq-kodirovanie-trigger-${i}`}
                    >
                      <span className={styles.question}>{it.q}</span>
                      <span
                        className={`${styles.iconWrap} ${open ? styles.iconWrapOpen : ''}`}
                        aria-hidden="true"
                      >
                        <svg
                          className={`${styles.icon} ${open ? styles.iconOpen : ''}`}
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                    <div
                      className={`${styles.answerGrid} ${open ? styles.answerGridOpen : ''}`}
                      id={`faq-kodirovanie-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-kodirovanie-trigger-${i}`}
                    >
                      <div className={styles.answerInner}>
                        <p className={styles.answer}>{it.a}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'reabilitaciya') {
    const items = [
      {
        q: 'Кому обычно подходит программа?',
        a: `Тем, кто после стабилизации готов работать над устойчивостью: структура, сопровождение, группа и индивидуальная работа. Не «всем подряд» — уместность формата и ограничения обсуждают при записи; она не заменяет острую медицинскую помощь, если она ещё нужна.`,
      },
      {
        q: 'Когда логично переходить на реабилитацию после стационара?',
        a: `Когда состояние позволяет участвовать в программе осознанно: не в режиме постоянной угрозы для здоровья, а с пониманием, что дальше — длительная работа, а не только «выписка». Точный момент согласуют с врачом и координатором — без жёсткого шаблона «ровно через N дней».`,
      },
      {
        q: 'Можно ли начать с 28 дней?',
        a: `Да, часто так и делают: как вход в программу и проверку, подходит ли формат. Это не обещание «полного восстановления за месяц» — это стартовый цикл, после которого обсуждают продолжение или корректировку плана.`,
      },
      {
        q: 'Как участвует семья?',
        a: `По правилам программы: отдельные форматы для близких — про этапы, границы и поддержку без контроля и морализаторства. Участие согласуется с человеком в программе; цель — ясность для семьи, а не давление «исправить другого».`,
      },
      {
        q: 'Какие бывают ограничения?',
        a: `Бывают ситуации, когда формат небезопасен или неуместен — без подробного перечня на сайте. На линии сориентируют: нужен ли другой этап или специалист. Решение об очном формате и показаниях остаётся за очной службой; здесь — маршрут и ясность, без замены очного осмотра.`,
      },
      {
        q: 'Как обсуждается программа: срок, глубина, стоимость?',
        a: `Сначала — разговор: запрос, контекст, что уже было в лечении. Потом — ориентир по сроку и пакету, что входит, как устроен режим. Итог фиксируют без навязанных решений: до записи вы можете отказаться без санкций.`,
      },
      {
        q: 'Что после завершения программы?',
        a: `Обычно обсуждают «мост» домой: рекомендации, возможные форматы поддержки, контакты. Это не гарантия «навсегда» — это план следующего шага, который можно скорректировать по жизни.`,
      },
      {
        q: 'Чем реабилитация отличается от стационара?',
        a: `Стационар — про стабилизацию и наблюдение в острой фазе. Реабилитация здесь — про длительную психосоциальную работу, поведение и адаптацию. Оба этапа могут быть нужны по очереди; путают их задачи — не «вместо друг друга».`,
      },
    ]

    return (
      <section
        className={`${styles.section} ${styles.faqReabilitaciya} ic-faq-reabilitaciya`}
        aria-labelledby="faq-reabilitaciya-title"
      >
        <div className="c">
          <div className={styles.inner}>
            <header className={styles.header}>
              <p className={styles.kicker}>Уточнения по программе</p>
              <h2 id="faq-reabilitaciya-title" className={styles.title}>
                Вопросы о восстановлении и сопровождении
              </h2>
              <p className={styles.subtitle}>
                Срок, границы формата, семья и отличие от стационара — спокойно, без обещаний «излечения навсегда» и без срочного давления.
              </p>
            </header>

            <div className={styles.list}>
              {items.map((it, i) => {
                const open = openIdx === i
                return (
                  <div key={i} className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
                    <button
                      type="button"
                      className={styles.trigger}
                      onClick={() => setOpenIdx(open ? -1 : i)}
                      aria-expanded={open}
                      aria-controls={`faq-reabilitaciya-panel-${i}`}
                      id={`faq-reabilitaciya-trigger-${i}`}
                    >
                      <span className={styles.question}>{it.q}</span>
                      <span
                        className={`${styles.iconWrap} ${open ? styles.iconWrapOpen : ''}`}
                        aria-hidden="true"
                      >
                        <svg
                          className={`${styles.icon} ${open ? styles.iconOpen : ''}`}
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                    <div
                      className={`${styles.answerGrid} ${open ? styles.answerGridOpen : ''}`}
                      id={`faq-reabilitaciya-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-reabilitaciya-trigger-${i}`}
                    >
                      <div className={styles.answerInner}>
                        <p className={styles.answer}>{it.a}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'stacionar') {
    const items = [
      {
        q: 'Как устроен наркологический стационар: палаты и режим?',
        a: `Круглосуточное отделение: палаты, питание по режиму, назначения под наблюдением нарколога и персонала; терапию корректируют по динамике — в отличие от амбулаторного формата. Суточный ориентир — от ${city.priceStacionarDay.toLocaleString('ru')} ₽; полный срок, город поступления и итог — на линии и с врачом после осмотра.`,
      },
      {
        q: 'В каких случаях нужна госпитализация в наркологический стационар?',
        a: `Когда при очной оценке безопаснее круглосуточное наблюдение и стационарная терапия: тяжесть, риски, детокс и стабилизация под контролем врача. Решение — по клинической картине, не «по просьбе» и не «на всякий случай».`,
      },
      {
        q: 'Как проходит госпитализация: от звонка до размещения в стационаре?',
        a: `На линии — ситуация, места, время, маршрут. При приезде: оформление, осмотр, объём помощи и согласие; затем палата. Детали — под ваш случай при записи.`,
      },
      {
        q: 'Сколько длится лечение в стационаре и от чего зависит срок?',
        a: `От программы, динамики и ответа на терапию. На странице — ориентиры по срокам; итог после осмотра, с уточнением по ходу — без жёсткой «планки» без врача.`,
      },
      {
        q: 'Можно ли звонить и навещать близкого в стационаре?',
        a: `Да, в рамках режима: звонки и визиты — с лечащим врачом с учётом состояния и процесса. Семье объясняют порядок заранее — не изоляция, а предсказуемость.`,
      },
      {
        q: 'Как обрабатываются персональные данные и медицинская тайна?',
        a: `ПДн — по закону РФ и политике клиники; диагноз и лечение — врачебная тайна. Раскрытие третьим лицам или органам — только когда это прямо предусмотрено законом.`,
      },
      {
        q: 'Как подбирают программу стационарного лечения и срок?',
        a: `После осмотра врач задаёт план: терапия, процедуры, при показаниях психотерапия. Срок и объём — с учётом динамики; план уточняют открыто, без сценария «для всех».`,
      },
      {
        q: 'Чем наркологический стационар отличается от реабилитации?',
        a: `Стационар — медицинский этап: детокс, стабилизация, наблюдение и терапия в отделении. Реабилитация — длительнее, психосоциальное восстановление; не заменяет стационар и при уместности идёт после острой фазы.`,
      },
    ]

    return (
      <section
        className={`${styles.section} ${styles.sectionStacionar} ic-faq-service`}
        aria-labelledby="faq-stacionar-title"
      >
        <div className="c">
          <div className={styles.inner}>
            <header className={styles.header}>
              <p className={styles.kicker}>О стационаре и госпитализации</p>
              <h2 id="faq-stacionar-title" className={styles.title}>
                Вопросы о наркологическом стационаре
              </h2>
              <p className={styles.subtitle}>
                Поступление, сроки, палаты, связь с близкими, правовые рамки — по существу, без рекламных обещаний.
              </p>
            </header>

            <div className={styles.list}>
              {items.map((it, i) => {
                const open = openIdx === i
                return (
                  <div key={i} className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
                    <button
                      type="button"
                      className={styles.trigger}
                      onClick={() => setOpenIdx(open ? -1 : i)}
                      aria-expanded={open}
                      aria-controls={`faq-stacionar-panel-${i}`}
                      id={`faq-stacionar-trigger-${i}`}
                    >
                      <span className={styles.triggerBody}>
                        <span className={styles.qIndex} aria-hidden="true">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className={styles.question}>{it.q}</span>
                      </span>
                      <span
                        className={`${styles.iconWrap} ${styles.iconWrapStacionar} ${open ? styles.iconWrapOpen : ''}`}
                        aria-hidden="true"
                      >
                        <svg
                          className={`${styles.icon} ${styles.iconStacionar} ${open ? styles.iconOpen : ''}`}
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.85"
                          strokeLinecap="round"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                    <div
                      className={`${styles.answerGrid} ${styles.answerGridStacionar} ${open ? styles.answerGridOpen : ''}`}
                      id={`faq-stacionar-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-stacionar-trigger-${i}`}
                    >
                      <div className={styles.answerInner}>
                        <p className={`${styles.answer} ${styles.answerStacionar}`}>{it.a}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    )
  }

  const items = [
    {
      q: 'Сколько стоит вызов нарколога на дом?',
      a: `Стоимость начинается от ${city.priceNarkolog.toLocaleString('ru')} ₽. Окончательная цена зависит от состояния пациента. Консультация по телефону — бесплатная.`,
    },
    { q: 'Как обеспечивается анонимность?', a: 'Мы не передаём данные в государственные органы. Машины без маркировки. Возможно лечение под псевдонимом. Информация не влияет на трудоустройство и получение прав.' },
    {
      q: `Через какое время приедет врач?`,
      a: isStavropolCity(city)
        ? `Среднее время прибытия в ${city.namePrep} — ${city.arrivalTime} минут. В отдалённые районы — до 60 минут. Работаем круглосуточно.`
        : `Работаем круглосуточно. Сроки согласуют при звонке — с учётом района, загрузки линии и ситуации; без обещаний «одинаковых минут для всех» до разговора.`,
    },
    { q: 'Какие методы кодирования используете?', a: 'Медикаментозное (Эспераль, Торпедо, Вивитрол, Налтрексон), психотерапевтическое (Довженко, гипноз) и комбинированные методы. Выбор — индивидуально с врачом.' },
    { q: 'Можно ли вызвать врача без согласия пациента?', a: 'Принудительное лечение возможно только по решению суда. Но наши специалисты проводят мотивационную беседу для получения добровольного согласия.' },
    { q: 'Есть ли гарантия результата?', a: 'Мы гарантируем качество медицинской помощи в рамках договорённостей с врачом. Бесплатный повторный курс при рецидиве в гарантийный период.' },
    {
      q: 'Как устроен стационар?',
      a: `В стационаре пациент находится под круглосуточным наблюдением врача. Размещение в одно- или двухместных палатах. Питание 3 раза в день. Программа включает детоксикацию, медикаментозную терапию и психотерапию. Стоимость — от ${city.priceStacionarDay.toLocaleString('ru')} ₽/сутки.`,
    },
    {
      q: 'Чем реабилитация отличается от стационара?',
      a: 'Стационар — это медицинский этап: детоксикация и стабилизация состояния (3-21 день). Реабилитация — психосоциальное восстановление после стационара: психотерапия, группы поддержки, адаптация к трезвой жизни (28-90 дней). Рекомендуем проходить оба этапа последовательно.',
    },
  ]

  return (
    <section className="faq" style={{ padding: 'var(--ic-y-section, 88px) 0', background: 'var(--bg)' }}>
      <div className="c">
        <div className="shdr">
          <div className="shdr__label">Вопросы</div>
          <h2 className="shdr__title">Частые вопросы</h2>
        </div>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {items.map((it, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--b1)' }}>
              <button
                type="button"
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                style={{
                  width: '100%',
                  padding: '20px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: 'none',
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'var(--deep)',
                  textAlign: 'left' as const,
                  gap: 16,
                }}
              >
                {it.q}
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: openIdx === i ? 'var(--em)' : 'var(--b2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all .3s',
                    transform: openIdx === i ? 'rotate(45deg)' : 'none',
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke={openIdx === i ? '#fff' : 'var(--t3)'} strokeWidth="2" width="14" height="14">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              <div
                style={{
                  maxHeight: openIdx === i ? 420 : 0,
                  overflow: 'hidden',
                  transition: 'max-height .4s ease',
                  paddingBottom: openIdx === i ? 20 : 0,
                }}
              >
                <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.7 }}>{it.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
