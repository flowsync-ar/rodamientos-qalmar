export const PRODUCT_IMAGE_MAX_BYTES = 8 * 1024 * 1024

export function extensionForImage(file: { name: string; type: string }): string | null {
  const type = file.type.toLowerCase()
  if (type === 'image/jpeg') return 'jpg'
  if (type === 'image/png') return 'png'
  if (type === 'image/webp') return 'webp'
  if (type === 'image/gif') return 'gif'
  if (type === 'image/avif') return 'avif'

  const name = file.name.toLowerCase()
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'jpg'
  if (name.endsWith('.png')) return 'png'
  if (name.endsWith('.webp')) return 'webp'
  if (name.endsWith('.gif')) return 'gif'
  if (name.endsWith('.avif')) return 'avif'
  return null
}

export function isSupabaseStorageConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  return (
    url.startsWith('https://') &&
    !url.includes('placeholder') &&
    key.length > 20 &&
    key !== 'placeholder'
  )
}
