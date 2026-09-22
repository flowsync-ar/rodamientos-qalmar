'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { UploadCloud, FileText, Download } from 'lucide-react'
import { importProductsFromCSV } from './actions'
import { parseProductCsv, type ProductCsvRow } from '@/lib/products/csv'

const TEMPLATE_CSV = `name,sku,category_slug,description,active
Rodamiento de Bola 6205-2RS,6205-2RS,rodamiento-de-ruedas,Rodamiento rígido de bolas con dos sellos de caucho,true
Rodamiento Cónico 30207,30207,rodamientos-diferencial,Rodamiento cónico para cargas axiales y radiales,true
`

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'productos-template.csv'
  link.click()
  URL.revokeObjectURL(url)
}

const REQUEST_BATCH = 250
const PREVIEW_ROWS = 50

export default function ImportarPage() {
  const [rows, setRows] = useState<ProductCsvRow[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [result, setResult] = useState<{ created: number; updated: number; errors: string[] } | null>(
    null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function loadFile(file: File) {
    const text = await file.text()
    setFileName(file.name)
    setRows(parseProductCsv(text))
    setResult(null)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    loadFile(file)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) loadFile(file)
  }

  async function handleImport() {
    const validRows = rows.filter((r) => !r.error)
    if (validRows.length === 0) return
    setImporting(true)
    setResult(null)
    setProgress({ done: 0, total: validRows.length })

    let created = 0
    let updated = 0
    const errors: string[] = []
    try {
      for (let i = 0; i < validRows.length; i += REQUEST_BATCH) {
        const chunk = validRows.slice(i, i + REQUEST_BATCH)
        setProgress({ done: i, total: validRows.length })
        const fd = new FormData()
        fd.append('rows', JSON.stringify(chunk))
        const res = await importProductsFromCSV(fd)
        created += res.created
        updated += res.updated
        errors.push(...res.errors)
        setProgress({
          done: Math.min(i + chunk.length, validRows.length),
          total: validRows.length,
        })
      }
      setResult({ created, updated, errors })
    } catch (err) {
      errors.push(err instanceof Error ? err.message : 'Error al importar. Probá de nuevo.')
      setResult({ created, updated, errors })
    } finally {
      setImporting(false)
      setProgress(null)
    }
  }

  const validCount = rows.filter((r) => !r.error).length
  const errorCount = rows.filter((r) => r.error).length

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Importar Productos (CSV)</h1>
          <p className="text-sm text-muted-foreground">
            Columnas: <code className="font-mono text-xs">name, sku, category_slug, description, active</code>
            . Archivos grandes (miles de filas) se cargan en lotes. Si el SKU ya existe, se actualiza;
            no se tocan fotos ni stock.
          </p>
        </div>
        <Button variant="outline" onClick={downloadTemplate} className="shrink-0 gap-2">
          <Download className="h-4 w-4" />
          Exportar template
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Archivo CSV</Label>
        <input
          ref={fileInputRef}
          id="csv"
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            dragActive ? 'border-primary bg-muted/50' : 'border-input hover:bg-muted/30'
          }`}
        >
          {fileName ? (
            <>
              <FileText className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">{fileName}</p>
              <p className="text-xs text-muted-foreground">Hacé clic para elegir otro archivo</p>
            </>
          ) : (
            <>
              <UploadCloud className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Hacé clic para elegir un archivo CSV</p>
              <p className="text-xs text-muted-foreground">o arrastralo y soltalo acá</p>
            </>
          )}
        </div>
      </div>

      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="default">{validCount} válidos</Badge>
            {errorCount > 0 && <Badge variant="secondary">{errorCount} errores</Badge>}
            {validCount > REQUEST_BATCH && (
              <Badge variant="secondary">Se procesa de a {REQUEST_BATCH}</Badge>
            )}
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-3 py-2 text-left font-medium">Nombre</th>
                  <th className="px-3 py-2 text-left font-medium">SKU</th>
                  <th className="px-3 py-2 text-left font-medium">Categoría</th>
                  <th className="px-3 py-2 text-left font-medium">Activo</th>
                  <th className="px-3 py-2 text-left font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, PREVIEW_ROWS).map((row, i) => (
                  <tr key={i} className={row.error ? 'bg-destructive/5' : ''}>
                    <td className="px-3 py-2">{row.name || <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-3 py-2 font-mono text-xs">{row.sku || <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-3 py-2 text-xs">{row.categorySlug || '—'}</td>
                    <td className="px-3 py-2 text-xs">{row.active ? 'Sí' : 'No'}</td>
                    <td className="px-3 py-2">
                      {row.error ? (
                        <Badge variant="secondary" className="text-destructive">{row.error}</Badge>
                      ) : (
                        <Badge variant="default">OK</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > PREVIEW_ROWS && (
            <p className="text-xs text-muted-foreground">
              Mostrando {PREVIEW_ROWS} de {rows.length}. Se importan o actualizan todos los válidos.
            </p>
          )}

          <Button onClick={handleImport} disabled={importing || validCount === 0}>
            {importing
              ? `Procesando ${progress?.done ?? 0} / ${progress?.total ?? validCount}…`
              : `Cargar / actualizar ${validCount} producto${validCount !== 1 ? 's' : ''}`}
          </Button>
        </div>
      )}

      {result && (
        <div className="rounded-lg border p-4 space-y-2">
          <p className="font-medium">
            {result.created} nuevo{result.created !== 1 ? 's' : ''}, {result.updated} actualizado
            {result.updated !== 1 ? 's' : ''}
          </p>
          {result.errors.length > 0 && (
            <ul className="text-sm text-destructive space-y-1">
              {result.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
