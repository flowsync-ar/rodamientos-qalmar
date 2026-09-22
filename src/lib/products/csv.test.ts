import { describe, expect, it } from 'vitest'
import { parseProductCsv, titleFromSlug } from './csv'

describe('parseProductCsv', () => {
  it('parses the Qalmar header and a simple row', () => {
    const rows = parseProductCsv(
      'name,sku,category_slug,description,active\n607 ZZ - ZKL,607-ZZ-ZKL,rodamientos-de-una-hilera-de-bolas-miniatura,RODAMIENTOS MINIATURA,true\n'
    )
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      name: '607 ZZ - ZKL',
      sku: '607-ZZ-ZKL',
      categorySlug: 'rodamientos-de-una-hilera-de-bolas-miniatura',
      active: true,
    })
  })

  it('keeps commas inside quoted name and description', () => {
    const rows = parseProductCsv(
      'name,sku,category_slug,description,active\n"6201 ZZ 12,7 - NTN",6201-ZZ-12-7-NTN,rodamientos-de-una-hilera-de-bolas-rigidos,"Código: 6201 ZZ 12,7. Marca: NTN",true\n'
    )
    expect(rows).toHaveLength(1)
    expect(rows[0].name).toBe('6201 ZZ 12,7 - NTN')
    expect(rows[0].sku).toBe('6201-ZZ-12-7-NTN')
    expect(rows[0].description).toBe('Código: 6201 ZZ 12,7. Marca: NTN')
    expect(rows[0].error).toBeUndefined()
  })

  it('flags missing sku', () => {
    const rows = parseProductCsv('name,sku,category_slug,description,active\nSolo nombre,,,,true\n')
    expect(rows[0].error).toBe('Falta SKU')
  })
})

describe('titleFromSlug', () => {
  it('humanizes a category slug', () => {
    expect(titleFromSlug('rodamientos-de-una-hilera-de-bolas-miniatura')).toBe(
      'Rodamientos de una hilera de bolas miniatura'
    )
  })
})
