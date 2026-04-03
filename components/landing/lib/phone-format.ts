export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '')
}

/** Маска как в мокапе: +7 (999) 999-99-99 */
export function formatRuPhoneInput(raw: string): string {
  let v = raw.replace(/\D/g, '').slice(0, 11)
  if (v[0] === '7' || v[0] === '8') v = v.slice(1)
  let out = '+7'
  if (v.length > 0) out += ' (' + v.slice(0, 3)
  if (v.length >= 3) out += ') ' + v.slice(3, 6)
  if (v.length >= 6) out += '-' + v.slice(6, 8)
  if (v.length >= 8) out += '-' + v.slice(8, 10)
  return out
}

export function isPhoneComplete(formatted: string): boolean {
  return digitsOnly(formatted).length >= 10
}
