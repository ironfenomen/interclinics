/** Префикс callback_data (лимит Telegram 64 байта). Формат: `ic:{publicId}:{action}` */

const PREFIX = 'ic'

export function buildCallbackData(publicId: string, action: string): string {
  return `${PREFIX}:${publicId}:${action}`
}

export function parseCallbackData(data: string): { publicId: string; action: string } | null {
  if (!data || !data.startsWith(`${PREFIX}:`)) return null
  const rest = data.slice(PREFIX.length + 1)
  const i = rest.indexOf(':')
  if (i <= 0 || i >= rest.length - 1) return null
  const publicId = rest.slice(0, i)
  const action = rest.slice(i + 1)
  if (!publicId || !action) return null
  return { publicId, action }
}
