import { db } from '@/db'
import { appConfig } from '@/db/schema'
import { eq } from 'drizzle-orm'

export interface CompanySettings {
  name: string
  cuit: string
  phone: string
  email: string
  address: string
  city: string
  province: string
  whatsapp: string
  instagram: string
  website: string
}

const COMPANY_KEY = 'company.settings'

export const WHATSAPP_DISPLAY = '+54 9 291 405-1085'
export const WHATSAPP_E164 = '5492914051085'
export const COMPANY_ADDRESS = 'Ingeniero Luiggi 872'
export const COMPANY_CITY = 'Bahía Blanca'
export const COMPANY_PROVINCE = 'Buenos Aires'

export function whatsappHref(text: string) {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(text)}`
}

const DEFAULTS: CompanySettings = {
  name: 'Qalmar',
  cuit: '20-29565129-7',
  phone: WHATSAPP_DISPLAY,
  email: '',
  address: COMPANY_ADDRESS,
  city: COMPANY_CITY,
  province: COMPANY_PROVINCE,
  whatsapp: WHATSAPP_DISPLAY,
  instagram: '',
  website: '',
}

export async function getCompanySettings(): Promise<CompanySettings> {
  const rows = await db
    .select({ value: appConfig.value })
    .from(appConfig)
    .where(eq(appConfig.key, COMPANY_KEY))
    .limit(1)

  if (!rows[0]) return DEFAULTS

  const merged = { ...DEFAULTS, ...(rows[0].value as Partial<CompanySettings>) }
  // Old saved rows still say Don Bosco — keep the public address in one place.
  if (/don bosco/i.test(merged.address)) {
    merged.address = COMPANY_ADDRESS
    merged.city = COMPANY_CITY
    merged.province = COMPANY_PROVINCE
  }
  return merged
}
