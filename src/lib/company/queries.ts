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

export const WHATSAPP_DISPLAY = '+54 9 291 402-0624'
export const WHATSAPP_E164 = '5492914020624'

export function whatsappHref(text: string) {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(text)}`
}

const DEFAULTS: CompanySettings = {
  name: 'Qalmar',
  cuit: '20-29565129-7',
  phone: WHATSAPP_DISPLAY,
  email: '',
  address: 'Don Bosco 2417',
  city: 'Bahía Blanca',
  province: 'Buenos Aires',
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

  return { ...DEFAULTS, ...(rows[0].value as Partial<CompanySettings>) }
}
