import { NextRequest, NextResponse } from 'next/server'
import { getWatiSettings, recordWatiEvent } from '@/lib/wati'

function authorized(req: NextRequest, secret: string): boolean {
  if (!secret) return true
  const header = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  const query = req.nextUrl.searchParams.get('token')
  return header === secret || query === secret
}

export async function POST(req: NextRequest) {
  const settings = await getWatiSettings()
  if (!authorized(req, settings.webhookSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: Record<string, unknown> = {}
  try {
    payload = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: true })
  }

  const eventType = String(payload.eventType ?? payload.type ?? '')
  const text = typeof payload.text === 'string' ? payload.text : null
  const waId = typeof payload.waId === 'string' ? payload.waId : null
  const messageId =
    (typeof payload.whatsappMessageId === 'string' && payload.whatsappMessageId) ||
    (typeof payload.id === 'string' && payload.id) ||
    null
  const inbound = eventType.toLowerCase().includes('received') || payload.owner === false

  try {
    await recordWatiEvent({
      watiMessageId: messageId,
      direction: inbound ? 'inbound' : 'outbound',
      fromNumber: inbound ? waId : null,
      toNumber: inbound ? null : waId,
      content: text,
      status: typeof payload.statusString === 'string' ? payload.statusString : eventType,
    })
  } catch (err) {
    console.error('[wati webhook]', err)
  }

  return NextResponse.json({ ok: true })
}
