/**
 * Конфиг тревоги: кого тегать в группе и кому дублировать в личку.
 *
 * TG_ALARM_GROUP_USER_IDS — id через запятую (упоминание через tg://user?id=…).
 * TG_ALARM_GROUP_USERNAMES — username без @, через запятую (текстовые @mention).
 * TG_ALARM_DM_USER_IDS — id для личного дубля (бот может писать только после /start у пользователя).
 * TG_ALARM_KEY_DM_USER_IDS — опционально отдельный список «ключевых»; если пусто, используется TG_ALARM_DM_USER_IDS.
 */

function parseIds(raw: string | undefined): number[] {
  if (!raw?.trim()) return []
  return raw
    .split(/[,;\s]+/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => Number(s))
    .filter(n => Number.isFinite(n) && n > 0)
}

function parseUsernames(raw: string | undefined): string[] {
  if (!raw?.trim()) return []
  return raw
    .split(/[,;\s]+/)
    .map(s => s.trim().replace(/^@/, ''))
    .filter(Boolean)
}

export type LeadAlarmConfig = {
  /** Упоминания в группе по numeric id */
  groupMentionUserIds: number[]
  /** @username в тексте группы */
  groupMentionUsernames: string[]
  /** Личный дубль всем этим id */
  dmUserIds: number[]
  /** Подмножество «ключевых» для лога (если задано отдельно) */
  keyDmUserIds: number[]
}

export function getLeadAlarmConfig(): LeadAlarmConfig {
  const groupIds = parseIds(process.env.TG_ALARM_GROUP_USER_IDS)
  const groupNames = parseUsernames(process.env.TG_ALARM_GROUP_USERNAMES)
  const dmIds = parseIds(process.env.TG_ALARM_DM_USER_IDS)
  const keyIds = parseIds(process.env.TG_ALARM_KEY_DM_USER_IDS)
  const dmUserIds = [...new Set([...dmIds, ...keyIds])]
  return {
    groupMentionUserIds: groupIds,
    groupMentionUsernames: groupNames,
    dmUserIds,
    keyDmUserIds: keyIds.length > 0 ? keyIds : dmIds,
  }
}
