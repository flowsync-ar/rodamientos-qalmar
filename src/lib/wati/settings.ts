import { db } from '@/db'
import { appConfig } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const WATI_CONFIG_KEY = 'wati.settings'

export type WatiSettings = {
  apiUrl: string
  token: string
  channelNumber: string
  webhookSecret: string
}

const EMPTY: WatiSettings = {
  apiUrl: '',
  token: '',
  channelNumber: '',
  webhookSecret: '',
}

export async function getWatiSettings(): Promise<WatiSettings> {
  const rows = await db
    .select({ value: appConfig.value })
    .from(appConfig)
    .where(eq(appConfig.key, WATI_CONFIG_KEY))
    .limit(1)

  const stored = (rows[0]?.value ?? {}) as Partial<WatiSettings>
  return {
    apiUrl: (stored.apiUrl || process.env.WATI_API_URL || '').replace(/\/$/, ''),
    token: stored.token || process.env.WATI_API_TOKEN || '',
    channelNumber: stored.channelNumber || process.env.WATI_CHANNEL_NUMBER || '',
    webhookSecret: stored.webhookSecret || process.env.WATI_WEBHOOK_SECRET || '',
  }
}

export function isWatiReady(settings: WatiSettings): boolean {
  return Boolean(settings.apiUrl.trim() && settings.token.trim())
}
