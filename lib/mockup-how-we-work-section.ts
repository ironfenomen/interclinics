/**
 * Единственный источник разметки секции «Как мы работаем» в HTML-мокапе.
 * Не содержит маркеров вида __TOKEN__ — иначе replaceAll в getMockupHtml может повредить текст.
 */
export const MOCKUP_HOW_WE_WORK_SECTION_INNER = `
  <div class="c">
    <div class="section-title section-title--route-steps reveal">
      <span>Как мы работаем</span>
      <h2>От звонка до стационара — понятный порядок шагов</h2>
      <p>Разбираться во всём самостоятельно не нужно: уточним ситуацию, подскажем оптимальный формат — выезд на дом, приём в клинике, при показаниях <strong>стационар 24/7</strong>, затем при необходимости кодирование и программа восстановления.</p>
    </div>

    <div class="route-steps route-steps--four reveal">
      <div class="route-step">
        <b class="num" aria-hidden="true">01</b>
        <div>
          <h4>Первый контакт</h4>
          <p>Позвоните круглосуточно или оставьте номер в форме — коротко опишите, что происходит.</p>
        </div>
      </div>
      <div class="route-step">
        <b class="num" aria-hidden="true">02</b>
        <div>
          <h4>Быстрый ответ</h4>
          <p>Свяжемся сразу или перезвоним в согласованное время, зададим вопросы по симптомам и срочности.</p>
        </div>
      </div>
      <div class="route-step route-step--key">
        <b class="num" aria-hidden="true">03</b>
        <div>
          <h4>Формат помощи</h4>
          <p>Нарколог предлагает шаг: выезд на дом, очный приём или <strong>стационар 24/7</strong> — с наблюдением и терапией при показаниях.</p>
        </div>
      </div>
      <div class="route-step">
        <b class="num" aria-hidden="true">04</b>
        <div>
          <h4>Дальнейший план</h4>
          <p>Начинаем помощь в выбранном формате. После стабилизации — по решению врача: кодирование и программа восстановления.</p>
        </div>
      </div>
    </div>

    <div class="route-cta route-cta--steps reveal">
      <div>
        <strong>Свяжитесь, когда будете готовы</strong>
        <p>Расскажем спокойно, с чего начать в вашей ситуации — без навязанных решений.</p>
      </div>
      <button type="button" class="btn btn-primary" onclick="openModal()">Заказать звонок</button>
    </div>
  </div>
`.trim()
