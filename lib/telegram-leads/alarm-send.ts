import type { LeadRecord } from '@/lib/leads/types'
import { getLeadAlarmConfig } from '@/lib/telegram-leads/alarm-config'
import { sendHtmlMessage } from '@/lib/telegram-leads/telegram-client'

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const ZWSP = '\u200b'

export type AlarmBurstResult = {
  groupOk: boolean
  groupError?: string
  dm: Record<number, 'ok' | string>
}

/**
 * Групповое тревожное сообщение + личные дубли.
 * Повтор вызывается планировщиком каждые 30 с, пока лид в статусе new.
 */
export async function sendLeadAlarmBurst(
  lead: LeadRecord,
  phase: 'ingest' | 'tick',
  tickOrdinal: number,
): Promise<AlarmBurstResult> {
  const cfg = getLeadAlarmConfig()
  const chatId = process.env.TG_CHAT_ID?.trim()
  const dmResults: Record<number, 'ok' | string> = {}

  if (!chatId) {
    return { groupOk: false, groupError: 'TG_CHAT_ID missing', dm: dmResults }
  }

  const idMentions = cfg.groupMentionUserIds.map(
    id => `<a href="tg://user?id=${id}">${ZWSP}</a>`,
  )
  const nameMentions = cfg.groupMentionUsernames.map(u => `@${esc(u)}`).join(' ')

  const mentionLine = [idMentions.join(''), nameMentions].filter(Boolean).join(' ')

  if (
    cfg.groupMentionUserIds.length === 0 &&
    cfg.groupMentionUsernames.length === 0
  ) {
    console.warn(
      '[lead-alarm] нет TG_ALARM_GROUP_USER_IDS / TG_ALARM_GROUP_USERNAMES — групповой @-пинг пустой; задайте список в .env',
    )
  }

  const text = [
    `🚨 <b>ТРЕВОГА: заявка не принята в работу</b>`,
    phase === 'ingest' ? `<i>Первое уведомление (сайт)</i>` : `<i>Повтор #${tickOrdinal}</i>`,
    ``,
    `ID: <code>${esc(lead.public_id)}</code> · #${lead.id}`,
    `Телефон: <code>${esc(lead.phone_e164)}</code>`,
    `Город: ${esc(lead.city_label)}`,
    ``,
    mentionLine ? `${mentionLine}` : `<i>(настройте список упоминаний в env)</i>`,
    ``,
    `<b>Нужно:</b> нажать «Взять в работу» на карточке заявки.`,
  ].join('\n')

  let groupOk = false
  let groupError: string | undefined

  try {
    await sendHtmlMessage({ chatId, text })
    groupOk = true
  } catch (e) {
    groupError = e instanceof Error ? e.message : String(e)
    console.error(`[lead-alarm] group send failed lead=${lead.id}`, groupError)
  }

  const uniqDm = [...new Set(cfg.dmUserIds)]
  const plainDm = [
    `🚨 <b>Заявка не взята</b> · <code>${esc(lead.public_id)}</code>`,
    `Тел: <code>${esc(lead.phone_e164)}</code>`,
    `Город: ${esc(lead.city_label)}`,
    phase === 'tick' ? `Повтор #${tickOrdinal}` : `Новая заявка`,
    ``,
    `Откройте группу и нажмите «Взять в работу» на карточке.`,
  ].join('\n')

  for (const uid of uniqDm) {
    try {
      await sendHtmlMessage({ chatId: String(uid), text: plainDm })
      dmResults[uid] = 'ok'
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      dmResults[uid] = msg
      console.error(`[lead-alarm] dm failed lead=${lead.id} user=${uid}`, msg)
    }
  }

  console.log(
    `[lead-alarm] burst lead=${lead.id} public=${lead.public_id} phase=${phase} tick=${tickOrdinal} group=${groupOk ? 'ok' : 'fail'} dm=${JSON.stringify(dmResults)}`,
  )

  return { groupOk, groupError, dm: dmResults }
}

/**
 * Короткое подтверждение в группу после «Взять в работу».
 */
export async function sendLeadTakenAck(input: {
  groupChatId: string
  publicId: string
  leadId: number
  actorDisplay: string
}): Promise<void> {
  const text = [
    `✅ <b>Заявку взяли в работу</b>`,
    `ID: <code>${esc(input.publicId)}</code> · #${input.leadId}`,
    `Ответственный: ${esc(input.actorDisplay)}`,
  ].join('\n')
  try {
    await sendHtmlMessage({ chatId: input.groupChatId, text })
    console.log(
      `[lead-alarm] take_ack lead=${input.leadId} by=${input.actorDisplay}`,
    )
  } catch (e) {
    console.error(`[lead-alarm] take_ack failed lead=${input.leadId}`, e)
  }
}
