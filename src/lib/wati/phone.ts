/** WATI / WhatsApp expect digits only, country code included, no +. */
export function toWhatsappNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('549') && digits.length >= 12) return digits
  if (digits.startsWith('54') && digits.length >= 11) return digits
  if (digits.startsWith('9') && digits.length >= 11) return `54${digits}`
  if (digits.length === 10) return `549${digits}`
  return digits
}
