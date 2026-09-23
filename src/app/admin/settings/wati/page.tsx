export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getWatiSettings, isWatiReady } from '@/lib/wati/settings'
import { saveWatiSettings } from '@/lib/wati/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function WatiSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>
}) {
  const { saved } = await searchParams
  const settings = await getWatiSettings()
  const ready = isWatiReady(settings)
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.qalmar.com.ar').replace(/\/$/, '')
  const webhookUrl = settings.webhookSecret
    ? `${appUrl}/api/webhooks/wati?token=${encodeURIComponent(settings.webhookSecret)}`
    : `${appUrl}/api/webhooks/wati?token=TU_CLAVE`

  async function handleSave(formData: FormData) {
    'use server'
    const result = await saveWatiSettings(formData)
    if (result.success) redirect('/admin/settings/wati?saved=1')
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Wati / WhatsApp</h1>
        <p className="text-sm text-muted-foreground">
          Cuando Wati esté activo, cargá acá los datos del panel. No hace tocar otra cosa del servidor.
        </p>
        <p className="mt-2 text-sm">
          Estado:{' '}
          <span className={ready ? 'font-medium text-green-700' : 'font-medium text-amber-700'}>
            {ready ? 'Listo para enviar' : 'Faltan URL o token'}
          </span>
        </p>
      </div>

      {saved && (
        <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm">Datos guardados.</p>
      )}

      <form action={handleSave} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="apiUrl">URL de la API</Label>
          <Input
            id="apiUrl"
            name="apiUrl"
            defaultValue={settings.apiUrl}
            placeholder="https://live-mt-server.wati.io"
          />
          <p className="text-xs text-muted-foreground">Está en el dashboard de Wati, junto al token.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="token">Access token</Label>
          <Input
            id="token"
            name="token"
            type="password"
            autoComplete="off"
            placeholder={settings.token ? '••••••••  (dejar vacío para no cambiar)' : 'Bearer token de Wati'}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="channelNumber">Número de canal (WhatsApp)</Label>
          <Input
            id="channelNumber"
            name="channelNumber"
            defaultValue={settings.channelNumber}
            placeholder="5492914020624"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="webhookSecret">Clave del webhook</Label>
          <Input
            id="webhookSecret"
            name="webhookSecret"
            type="password"
            autoComplete="off"
            placeholder={settings.webhookSecret ? '••••••••  (dejar vacío para no cambiar)' : 'Elegí una clave'}
          />
          <p className="text-xs text-muted-foreground">
            En Wati → Connectors → Webhooks pegá esta URL:
          </p>
          <code className="block break-all rounded-md bg-muted px-3 py-2 text-xs">{webhookUrl}</code>
        </div>

        <Button type="submit">Guardar</Button>
      </form>
    </div>
  )
}
