'use client'

import { useEffect } from 'react'

/** Локальная копия склонения «N бригад» — без импорта `@/lib/topbar`, чтобы клиентский бандл не тянул лишний модуль (избегаем сбоя webpack interop `__webpack_require__.n`). */
function brigadePluralPhrase(n: number): string {
  const k = Math.abs(Math.floor(Number(n))) % 100
  const m = k % 10
  if (k >= 11 && k <= 14) return 'клинических бригад'
  if (m === 1) return 'клиническая бригада'
  if (m >= 2 && m <= 4) return 'клинические бригады'
  return 'клинических бригад'
}

/** Клиентская обвязка: те же обработчики, что в <script> мокапа (scroll/header, reveal, FAQ, формы, cookie, exit). */
export function MockupLiteralShell({ html }: { html: string }) {
  useEffect(() => {
    const header = document.getElementById('header')

    const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 12)
    window.addEventListener('scroll', onScroll)

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.13 },
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

    const faqHandlers: Array<{ btn: Element; fn: (e: Event) => void }> = []
    document.querySelectorAll('.faq-accordion .faq-q').forEach(btn => {
      const fn = () => {
        const item = btn.closest('.faq-item')
        const accordion = btn.closest('.faq-accordion')
        if (!item || !accordion) return
        const wasOpen = item.classList.contains('open')
        accordion.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'))
        if (!wasOpen) item.classList.add('open')
      }
      btn.addEventListener('click', fn)
      faqHandlers.push({ btn, fn })
    })

    function phoneMask(input: HTMLInputElement) {
      const handler = () => {
        let v = input.value.replace(/\D/g, '').slice(0, 11)
        if (v[0] === '7' || v[0] === '8') v = v.slice(1)
        let out = '+7'
        if (v.length > 0) out += ' (' + v.slice(0, 3)
        if (v.length >= 3) out += ') ' + v.slice(3, 6)
        if (v.length >= 6) out += '-' + v.slice(6, 8)
        if (v.length >= 8) out += '-' + v.slice(8, 10)
        input.value = out
      }
      input.addEventListener('input', handler)
      return () => input.removeEventListener('input', handler)
    }
    const telCleanups = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="tel"]')).map(phoneMask)

    const consentCheckboxIds = ['heroConsentPd', 'finalConsentPd', 'modalConsentPd', 'exitConsentPd'] as const
    const consentClearHandlers = consentCheckboxIds.map(id => {
      const el = document.getElementById(id) as HTMLInputElement | null
      if (!el) return { el: null as HTMLInputElement | null, fn: () => {} }
      const fn = () => {
        el.closest('.form-consent-check')?.classList.remove('form-consent--invalid')
        el.removeAttribute('aria-invalid')
      }
      el.addEventListener('change', fn)
      return { el, fn }
    })

    function getDigits(id: string | null): string {
      const el = id ? document.getElementById(id) : null
      if (!el || !('value' in el)) return ''
      return (el as HTMLInputElement).value.replace(/\D/g, '')
    }

    function flagError(id: string) {
      const el = document.getElementById(id)
      if (!el) return
      el.classList.add('error')
      ;(el as HTMLInputElement).focus()
      setTimeout(() => el.classList.remove('error'), 1800)
    }

    function flagConsentError(checkboxId: string) {
      const cb = document.getElementById(checkboxId) as HTMLInputElement | null
      if (!cb) return
      const wrap = cb.closest('.form-consent-check')
      wrap?.classList.add('form-consent--invalid')
      cb.setAttribute('aria-invalid', 'true')
      cb.focus()
      setTimeout(() => {
        wrap?.classList.remove('form-consent--invalid')
        cb.removeAttribute('aria-invalid')
      }, 2200)
    }

    function resetConsentCheckbox(id: string | null) {
      if (!id) return
      const cb = document.getElementById(id) as HTMLInputElement | null
      if (cb) cb.checked = false
    }

    async function submitLead(
      phoneId: string,
      nameId: string | null,
      isModal = false,
      isExit = false,
      consentCheckboxId: string | null = null,
    ) {
      if (consentCheckboxId) {
        const consent = document.getElementById(consentCheckboxId) as HTMLInputElement | null
        if (!consent?.checked) {
          flagConsentError(consentCheckboxId)
          return
        }
      }
      const digits = getDigits(phoneId)
      if (digits.length < 10) {
        flagError(phoneId)
        return
      }
      const name = nameId ? (document.getElementById(nameId) as HTMLInputElement | null)?.value ?? '' : ''
      const slug = document.getElementById('ic-mockup-city')?.getAttribute('data-slug') ?? ''
      let leadType: string = 'general'
      let source = 'hero-mockup'
      if (isModal) {
        source = 'modal'
      } else if (isExit) {
        source = 'exit'
      } else {
        const active = document.querySelector('.scenario-btn.active') as HTMLElement | null
        const lt = active?.dataset?.leadtype
        if (lt === 'vyzov' || lt === 'stacionar' || lt === 'rehab') leadType = lt
        source = `hero-mockup:${active?.dataset?.leadtype ?? 'general'}`
      }
      try {
        await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: digits, city: slug, source, leadType }),
        })
      } catch {
        /* offline */
      }
      console.log('LEAD', { phone: digits, name, city: slug, source, leadType })

      resetConsentCheckbox(consentCheckboxId)

      const modalForm = document.getElementById('modalForm')
      const modalSuccess = document.getElementById('modalSuccess')

      if (isModal && modalForm && modalSuccess) {
        modalForm.style.display = 'none'
        modalSuccess.classList.add('show')
        setTimeout(closeModal, 2200)
      } else if (isExit) {
        closeExit()
        openModal()
        if (modalForm && modalSuccess) {
          modalForm.style.display = 'none'
          modalSuccess.classList.add('show')
          setTimeout(closeModal, 2200)
        }
      } else {
        const input = document.getElementById(phoneId) as HTMLInputElement | null
        if (input) {
          input.value = ''
          input.placeholder = '✓ Заявка отправлена'
          setTimeout(() => {
            input.placeholder = 'Ваш телефон *'
          }, 2200)
        }
      }
    }

    function openModal() {
      document.getElementById('leadModal')?.classList.add('open')
      document.body.style.overflow = 'hidden'
    }

    function closeModal() {
      document.getElementById('leadModal')?.classList.remove('open')
      document.body.style.overflow = ''
      const modalForm = document.getElementById('modalForm')
      const modalSuccess = document.getElementById('modalSuccess')
      if (modalForm) modalForm.style.display = ''
      modalSuccess?.classList.remove('show')
    }

    function scrollToSection(id: string) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    function acceptCookie() {
      localStorage.setItem('interclinics-cookie', '1')
      document.getElementById('cookie')?.classList.remove('show')
    }

    function declineCookie() {
      localStorage.setItem('interclinics-cookie', '0')
      document.getElementById('cookie')?.classList.remove('show')
    }

    function closeExit() {
      document.getElementById('exitPopup')?.classList.remove('open')
      document.body.style.overflow = ''
    }

    const w = window as unknown as Window &
      Record<
        'openModal' | 'closeModal' | 'closeExit' | 'acceptCookie' | 'declineCookie',
        () => void
      > &
      Record<'submitLead', typeof submitLead> &
      Record<'scrollToSection', typeof scrollToSection>
    w.openModal = openModal
    w.closeModal = closeModal
    w.closeExit = closeExit
    w.submitLead = submitLead
    w.scrollToSection = scrollToSection
    w.acceptCookie = acceptCookie
    w.declineCookie = declineCookie

    const leadModal = document.getElementById('leadModal')
    const leadModalBackdrop = (e: MouseEvent) => {
      if (e.target === leadModal) closeModal()
    }
    leadModal?.addEventListener('click', leadModalBackdrop)

    const scenarioButtons = document.querySelectorAll('.scenario-btn')
    const scenarioSub = document.getElementById('scenarioSub')
    const scenarioCta = document.getElementById('scenarioCta')
    const scenarioFns: Array<{ el: Element; fn: () => void }> = []
    scenarioButtons.forEach(btn => {
      const fn = () => {
        scenarioButtons.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        const t = btn as HTMLElement
        if (scenarioSub && t.dataset.sub) scenarioSub.textContent = t.dataset.sub
        if (scenarioCta && t.dataset.cta) scenarioCta.textContent = t.dataset.cta
      }
      btn.addEventListener('click', fn)
      scenarioFns.push({ el: btn, fn })
    })

    function updateTeams() {
      const n = Math.floor(Math.random() * 4) + 2
      const teamsLive = document.getElementById('teamsLive')
      const operatorsLive = document.getElementById('operatorsLive')
      const operatorsLiveLabel = document.getElementById('operatorsLiveLabel')
      if (teamsLive) teamsLive.textContent = String(n)
      if (operatorsLive) operatorsLive.textContent = String(n)
      if (operatorsLiveLabel) operatorsLiveLabel.textContent = brigadePluralPhrase(n)
    }
    const teamsTimer = window.setInterval(updateTeams, 42_000)

    let exitShown = false
    const onMouseOut = (e: MouseEvent) => {
      if (exitShown) return
      if (e.clientY <= 8) {
        exitShown = true
        document.getElementById('exitPopup')?.classList.add('open')
        document.body.style.overflow = 'hidden'
      }
    }
    document.addEventListener('mouseout', onMouseOut)

    let cookieTimer: ReturnType<typeof setTimeout> | null = null
    if (!localStorage.getItem('interclinics-cookie')) {
      cookieTimer = setTimeout(() => document.getElementById('cookie')?.classList.add('show'), 1800)
    }

    const reviewAudio = document.getElementById('reviewVoiceArtur') as HTMLAudioElement | null
    const reviewAudioWrap = document.querySelector('[data-review-audio-wrap]') as HTMLElement | null
    const reviewPlayBtn = reviewAudioWrap?.querySelector('[data-review-play]') as HTMLButtonElement | null
    const reviewTimeEl = document.getElementById('reviewVoiceArturTime')
    const reviewWave = reviewAudioWrap?.querySelector('[data-review-wave]') as HTMLElement | null
    const reviewScrub = reviewAudioWrap?.querySelector('[data-review-scrub]') as HTMLElement | null

    let reviewScrubbing = false

    function formatVoiceTime(sec: number) {
      if (!Number.isFinite(sec) || sec < 0) return '0:00'
      const m = Math.floor(sec / 60)
      const s = Math.floor(sec % 60)
      return `${m}:${String(s).padStart(2, '0')}`
    }

    function setReviewPlaying(playing: boolean) {
      reviewAudioWrap?.classList.toggle('is-playing', playing)
      reviewPlayBtn?.setAttribute('aria-label', playing ? 'Пауза' : 'Воспроизвести голосовой отзыв')
    }

    function updateReviewUi() {
      if (!reviewAudio || !reviewTimeEl || !reviewWave) return
      const d = reviewAudio.duration
      const t = reviewAudio.currentTime
      if (!Number.isFinite(d) || d <= 0) {
        reviewTimeEl.textContent = '0:00 / 0:00'
        reviewWave.style.setProperty('--review-audio-progress', '0%')
        reviewScrub?.setAttribute('aria-valuenow', '0')
        reviewScrub?.setAttribute('aria-valuetext', '0:00 из 0:00')
        return
      }
      const ratio = Math.min(1, Math.max(0, t / d))
      reviewWave.style.setProperty('--review-audio-progress', `${ratio * 100}%`)
      reviewTimeEl.textContent = `${formatVoiceTime(t)} / ${formatVoiceTime(d)}`
      const pct = Math.round(ratio * 100)
      reviewScrub?.setAttribute('aria-valuenow', String(pct))
      reviewScrub?.setAttribute('aria-valuetext', `${formatVoiceTime(t)} из ${formatVoiceTime(d)}`)
    }

    function seekFromClientX(clientX: number) {
      if (!reviewAudio || !reviewWave) return
      const d = reviewAudio.duration
      if (!Number.isFinite(d) || d <= 0) return
      const rect = reviewWave.getBoundingClientRect()
      const w = rect.width
      if (w <= 0) return
      const x = Math.min(rect.right, Math.max(rect.left, clientX))
      const ratio = (x - rect.left) / w
      reviewAudio.currentTime = ratio * d
      updateReviewUi()
    }

    function onScrubPointerDown(e: PointerEvent) {
      if (!reviewScrub || !reviewAudio) return
      const d = reviewAudio.duration
      if (!Number.isFinite(d) || d <= 0) return
      if (e.pointerType === 'mouse' && e.button !== 0) return
      reviewScrubbing = true
      reviewAudioWrap?.classList.add('is-scrubbing')
      seekFromClientX(e.clientX)
      try {
        reviewScrub.setPointerCapture(e.pointerId)
      } catch {
        /* capture failed */
      }
      e.preventDefault()
    }

    function onScrubPointerMove(e: PointerEvent) {
      if (!reviewScrubbing) return
      seekFromClientX(e.clientX)
    }

    function onScrubPointerUp(e: PointerEvent) {
      if (!reviewScrub || !reviewScrubbing) return
      reviewScrubbing = false
      reviewAudioWrap?.classList.remove('is-scrubbing')
      try {
        reviewScrub.releasePointerCapture(e.pointerId)
      } catch {
        /* not captured */
      }
    }

    function onScrubLostCapture() {
      reviewScrubbing = false
      reviewAudioWrap?.classList.remove('is-scrubbing')
    }

    function onScrubKeyDown(e: KeyboardEvent) {
      if (!reviewAudio) return
      if (e.key === ' ' || e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault()
        if (reviewAudio.paused) void reviewAudio.play().catch(() => {})
        else reviewAudio.pause()
        return
      }
      const d = reviewAudio.duration
      if (!Number.isFinite(d) || d <= 0) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        reviewAudio.currentTime = Math.max(0, reviewAudio.currentTime - 5)
        updateReviewUi()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        reviewAudio.currentTime = Math.min(d, reviewAudio.currentTime + 5)
        updateReviewUi()
      } else if (e.key === 'Home') {
        e.preventDefault()
        reviewAudio.currentTime = 0
        updateReviewUi()
      } else if (e.key === 'End') {
        e.preventDefault()
        reviewAudio.currentTime = d
        updateReviewUi()
      }
    }

    function onReviewPlayClick() {
      if (!reviewAudio) return
      if (reviewAudio.paused) void reviewAudio.play().catch(() => {})
      else reviewAudio.pause()
    }

    function onReviewTimeUpdate() {
      if (reviewScrubbing) return
      updateReviewUi()
    }

    function onReviewEnded() {
      if (reviewAudio) {
        reviewAudio.currentTime = 0
      }
      updateReviewUi()
    }

    function onReviewLoadedMeta() {
      updateReviewUi()
    }

    function onReviewPlaying() {
      setReviewPlaying(true)
    }

    function onReviewPauseEvent() {
      setReviewPlaying(false)
    }

    reviewPlayBtn?.addEventListener('click', onReviewPlayClick)
    reviewScrub?.addEventListener('pointerdown', onScrubPointerDown)
    reviewScrub?.addEventListener('pointermove', onScrubPointerMove)
    reviewScrub?.addEventListener('pointerup', onScrubPointerUp)
    reviewScrub?.addEventListener('pointercancel', onScrubPointerUp)
    reviewScrub?.addEventListener('lostpointercapture', onScrubLostCapture)
    reviewScrub?.addEventListener('keydown', onScrubKeyDown)
    reviewAudio?.addEventListener('playing', onReviewPlaying)
    reviewAudio?.addEventListener('pause', onReviewPauseEvent)
    reviewAudio?.addEventListener('timeupdate', onReviewTimeUpdate)
    reviewAudio?.addEventListener('ended', onReviewEnded)
    reviewAudio?.addEventListener('loadedmetadata', onReviewLoadedMeta)
    updateReviewUi()

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
      faqHandlers.forEach(({ btn, fn }) => btn.removeEventListener('click', fn))
      telCleanups.forEach(fn => fn())
      consentClearHandlers.forEach(({ el, fn }) => {
        if (el) el.removeEventListener('change', fn)
      })
      scenarioFns.forEach(({ el, fn }) => el.removeEventListener('click', fn))
      clearInterval(teamsTimer)
      document.removeEventListener('mouseout', onMouseOut)
      leadModal?.removeEventListener('click', leadModalBackdrop)
      if (cookieTimer) clearTimeout(cookieTimer)
      reviewPlayBtn?.removeEventListener('click', onReviewPlayClick)
      reviewScrub?.removeEventListener('pointerdown', onScrubPointerDown)
      reviewScrub?.removeEventListener('pointermove', onScrubPointerMove)
      reviewScrub?.removeEventListener('pointerup', onScrubPointerUp)
      reviewScrub?.removeEventListener('pointercancel', onScrubPointerUp)
      reviewScrub?.removeEventListener('lostpointercapture', onScrubLostCapture)
      reviewScrub?.removeEventListener('keydown', onScrubKeyDown)
      reviewAudio?.removeEventListener('playing', onReviewPlaying)
      reviewAudio?.removeEventListener('pause', onReviewPauseEvent)
      reviewAudio?.removeEventListener('timeupdate', onReviewTimeUpdate)
      reviewAudio?.removeEventListener('ended', onReviewEnded)
      reviewAudio?.removeEventListener('loadedmetadata', onReviewLoadedMeta)
      reviewAudio?.pause()
      delete (window as unknown as { openModal?: () => void }).openModal
      delete (window as unknown as { closeModal?: () => void }).closeModal
      delete (window as unknown as { submitLead?: typeof submitLead }).submitLead
      delete (window as unknown as { scrollToSection?: typeof scrollToSection }).scrollToSection
      delete (window as unknown as { acceptCookie?: () => void }).acceptCookie
      delete (window as unknown as { declineCookie?: () => void }).declineCookie
      delete (window as unknown as { closeExit?: () => void }).closeExit
    }
  }, [html])

  return <div className="ic-mockup-root min-h-screen" dangerouslySetInnerHTML={{ __html: html }} />
}
