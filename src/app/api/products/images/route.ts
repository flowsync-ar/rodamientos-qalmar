import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  PRODUCT_IMAGE_MAX_BYTES,
  extensionForImage,
  isSupabaseStorageConfigured,
} from '@/lib/products/image-file'

export const runtime = 'nodejs'

async function saveLocally(buffer: Buffer, filename: string): Promise<string> {
  const dir = path.join(process.cwd(), 'public', 'uploads', 'products')
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, filename), buffer)
  return `/uploads/products/${filename}`
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
  }

  const ext = extensionForImage(file)
  if (!ext) {
    return NextResponse.json(
      { error: 'Usá una imagen JPG, PNG, WEBP o AVIF.' },
      { status: 400 }
    )
  }

  if (file.size > PRODUCT_IMAGE_MAX_BYTES) {
    return NextResponse.json({ error: 'La imagen no puede superar 8 MB.' }, { status: 400 })
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  if (isSupabaseStorageConfigured()) {
    const supabase = createAdminClient()
    const { error } = await supabase.storage
      .from('product-images')
      .upload(filename, buffer, { contentType: file.type || `image/${ext}`, upsert: false })

    if (!error) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(filename)
      return NextResponse.json({ url: data.publicUrl })
    }

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  const url = await saveLocally(buffer, filename)
  return NextResponse.json({ url })
}
