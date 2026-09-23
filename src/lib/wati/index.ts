import { db } from '@/db'
import { watiMessages } from '@/db/schema'
import { toWhatsappNumber } from './phone'
import { getWatiSettings, isWatiReady } from './settings'

export { toWhatsappNumber, getWatiSettings, isWatiReady }
export type { WatiSettings } from './settings'

export type WatiTemplateParams = Record<string, string>

export type WatiResult = {
  success: boolean
  messageId?: string
  error?: string
}

async function watiFetch(path: string, init: RequestInit): Promise<WatiResult> {
  const settings = await getWatiSettings()
  if (!isWatiReady(settings)) {
    return { success: false, error: 'Wati no está configurado. Cargá URL y token en Admin → Configuración → Wati.' }
  }

  const res = await fetch(`${settings.apiUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${settings.token}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })

  let body: { ok?: boolean; result?: string; message?: { whatsappMessageId?: string } } = {}
  try {
    body = (await res.json()) as typeof body
  } catch {
    body = {}
  }

  if (!res.ok || body.ok === false) {
    return { success: false, error: body.result ?? `WATI ${res.status}` }
  }

  return { success: true, messageId: body.message?.whatsappMessageId }
}

export const watiClient = {
  async sendMessage(to: string, message: string): Promise<WatiResult> {
    const number = toWhatsappNumber(to)
    const qs = new URLSearchParams({ messageText: message })
    return watiFetch(`/api/v1/sendSessionMessage/${number}?${qs}`, { method: 'POST' })
  },

  async sendTemplate(
    to: string,
    templateName: string,
    params: WatiTemplateParams,
    broadcastName = 'qalmar'
  ): Promise<WatiResult> {
    const settings = await getWatiSettings()
    const channel = settings.channelNumber.trim()
    if (!channel) {
      return { success: false, error: 'Falta el número de canal de Wati' }
    }

    return watiFetch('/api/v2/sendTemplateMessages', {
      method: 'POST',
      body: JSON.stringify({
        template_name: templateName,
        broadcast_name: broadcastName,
        channel_number: channel,
        receivers: [
          {
            whatsappNumber: toWhatsappNumber(to),
            localMessageId: crypto.randomUUID(),
            customParams: Object.entries(params).map(([name, value]) => ({ name, value })),
          },
        ],
      }),
    })
  },
}

export async function recordWatiEvent(input: {
  watiMessageId?: string | null
  direction: 'inbound' | 'outbound'
  fromNumber?: string | null
  toNumber?: string | null
  content?: string | null
  status?: string | null
}) {
  await db
    .insert(watiMessages)
    .values({
      watiMessageId: input.watiMessageId ?? null,
      direction: input.direction,
      fromNumber: input.fromNumber ?? null,
      toNumber: input.toNumber ?? null,
      content: input.content ?? null,
      status: input.status ?? null,
    })
    .onConflictDoNothing()
}
