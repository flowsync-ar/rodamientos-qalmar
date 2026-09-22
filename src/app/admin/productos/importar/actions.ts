'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { products, categories } from '@/db/schema'
import { inArray, sql } from 'drizzle-orm'
import { titleFromSlug } from '@/lib/products/csv'

interface CSVRow {
  name: string
  sku: string
  categorySlug: string
  description: string
  active: boolean
}

export type ImportCsvResult = {
  created: number
  updated: number
  errors: string[]
}

const INSERT_BATCH = 250

function toValues(rows: CSVRow[], slugMap: Map<string, string>) {
  return rows.map((row) => ({
    name: row.name,
    sku: row.sku,
    description: row.description || null,
    categoryId: row.categorySlug ? (slugMap.get(row.categorySlug) ?? null) : null,
    active: row.active,
  }))
}

function pushError(errors: string[], message: string) {
  if (errors.length < 50) errors.push(message)
}

async function resolveCategoryIds(slugs: string[]): Promise<Map<string, string>> {
  const slugMap = new Map<string, string>()
  if (slugs.length === 0) return slugMap

  const existing = await db
    .select({ id: categories.id, slug: categories.slug })
    .from(categories)
    .where(inArray(categories.slug, slugs))
  for (const row of existing) slugMap.set(row.slug, row.id)

  const missing = slugs.filter((slug) => !slugMap.has(slug))
  if (missing.length > 0) {
    await db
      .insert(categories)
      .values(missing.map((slug, i) => ({ name: titleFromSlug(slug), slug, sortOrder: 1000 + i })))
      .onConflictDoNothing()

    const created = await db
      .select({ id: categories.id, slug: categories.slug })
      .from(categories)
      .where(inArray(categories.slug, missing))
    for (const row of created) slugMap.set(row.slug, row.id)
  }

  return slugMap
}

async function upsertChunk(
  chunk: CSVRow[],
  slugMap: Map<string, string>
): Promise<{ created: number; updated: number }> {
  const skus = chunk.map((r) => r.sku)
  const existing = await db
    .select({ sku: products.sku })
    .from(products)
    .where(inArray(products.sku, skus))
  const existingSet = new Set(existing.map((r) => r.sku))

  await db
    .insert(products)
    .values(toValues(chunk, slugMap))
    .onConflictDoUpdate({
      target: products.sku,
      set: {
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        categoryId: sql`excluded.category_id`,
        active: sql`excluded.active`,
        updatedAt: sql`now()`,
      },
    })

  const updated = chunk.filter((r) => existingSet.has(r.sku)).length
  return { created: chunk.length - updated, updated }
}

export async function importProductsFromCSV(formData: FormData): Promise<ImportCsvResult> {
  let rows: CSVRow[] = []
  try {
    rows = JSON.parse(formData.get('rows') as string) as CSVRow[]
  } catch {
    return { created: 0, updated: 0, errors: ['Datos de importación inválidos'] }
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    return { created: 0, updated: 0, errors: [] }
  }

  let created = 0
  let updated = 0
  const errors: string[] = []

  const uniqueSlugs = [...new Set(rows.map((r) => r.categorySlug).filter(Boolean))]
  const slugMap = await resolveCategoryIds(uniqueSlugs)

  const seen = new Set<string>()
  const uniqueRows: CSVRow[] = []
  for (const row of rows) {
    const sku = row.sku.trim()
    if (!sku || seen.has(sku)) continue
    seen.add(sku)
    uniqueRows.push({ ...row, sku })
  }

  // ponytail: skip embeddings on bulk CSV (16k fetches would timeout/bill); generate later.
  for (let i = 0; i < uniqueRows.length; i += INSERT_BATCH) {
    const chunk = uniqueRows.slice(i, i + INSERT_BATCH)
    try {
      const res = await upsertChunk(chunk, slugMap)
      created += res.created
      updated += res.updated
    } catch (err) {
      for (const row of chunk) {
        try {
          const res = await upsertChunk([row], slugMap)
          created += res.created
          updated += res.updated
        } catch (rowErr) {
          pushError(
            errors,
            `SKU ${row.sku}: ${rowErr instanceof Error ? rowErr.message : 'error'}`
          )
        }
      }
      pushError(errors, err instanceof Error ? err.message : 'error en lote')
    }
  }

  revalidatePath('/admin/productos')
  revalidatePath('/catalogo')
  return { created, updated, errors }
}
