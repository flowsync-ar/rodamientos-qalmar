'use server'

import { db } from '@/db'
import { appConfig } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/get-user'
import type { ActionResult } from '@/lib/types/action-result'
import { getWatiSettings, WATI_CONFIG_KEY, type WatiSettings } from './settings'

export async function saveWatiSettings(formData: FormData): Promise<ActionResult<void>> {
  try {
    const user = await requireAdmin()
    const current = await getWatiSettings()

    const token = (formData.get('token') as string | null)?.trim() ?? ''
    const webhookSecret = (formData.get('webhookSecret') as string | null)?.trim() ?? ''

    const settings: WatiSettings = {
      apiUrl: ((formData.get('apiUrl') as string | null)?.trim() ?? '').replace(/\/$/, ''),
      token: token || current.token,
      channelNumber: (formData.get('channelNumber') as string | null)?.trim() ?? '',
      webhookSecret: webhookSecret || current.webhookSecret,
    }

    await db
      .insert(appConfig)
      .values({ key: WATI_CONFIG_KEY, value: settings, updatedBy: user.id })
      .onConflictDoUpdate({
        target: appConfig.key,
        set: { value: settings, updatedAt: new Date(), updatedBy: user.id },
      })

    revalidatePath('/admin/settings/wati')
    return { success: true, data: undefined }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'No se pudo guardar Wati',
    }
  }
}
