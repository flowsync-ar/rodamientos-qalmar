export type ProductCsvRow = {
  name: string
  sku: string
  categorySlug: string
  description: string
  active: boolean
  error?: string
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cur = ''
  let inQuotes = false
  const s = text.replace(/^\uFEFF/, '')

  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (inQuotes) {
      if (ch === '"') {
        if (s[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cur += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      row.push(cur.trim())
      cur = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && s[i + 1] === '\n') i++
      row.push(cur.trim())
      cur = ''
      if (row.some((c) => c !== '')) rows.push(row)
      row = []
    } else {
      cur += ch
    }
  }

  if (cur.length || row.length) {
    row.push(cur.trim())
    if (row.some((c) => c !== '')) rows.push(row)
  }

  return rows
}

export function parseProductCsv(text: string): ProductCsvRow[] {
  const table = parseCsv(text)
  if (table.length < 2) return []

  const headers = table[0].map((h) => h.toLowerCase())
  const nameIdx = headers.indexOf('name')
  const skuIdx = headers.indexOf('sku')
  const categoryIdx = headers.indexOf('category_slug')
  const descIdx = headers.indexOf('description')
  const activeIdx = headers.indexOf('active')

  return table.slice(1).map((cols) => {
    const name = nameIdx >= 0 ? (cols[nameIdx] ?? '') : ''
    const sku = skuIdx >= 0 ? (cols[skuIdx] ?? '') : ''
    const error = !name ? 'Falta nombre' : !sku ? 'Falta SKU' : undefined
    const activeRaw = activeIdx >= 0 ? (cols[activeIdx] ?? '') : 'true'

    return {
      name,
      sku,
      categorySlug: categoryIdx >= 0 ? (cols[categoryIdx] ?? '') : '',
      description: descIdx >= 0 ? (cols[descIdx] ?? '') : '',
      active: activeRaw.toLowerCase() !== 'false',
      error,
    }
  })
}

export function titleFromSlug(slug: string): string {
  const s = slug.replace(/-/g, ' ').trim()
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : slug
}
