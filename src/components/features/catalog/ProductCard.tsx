import Link from 'next/link'
import { AddToListButton } from './AddToListButton'
import { SafeImage } from './SafeImage'

interface ProductCardProps {
  id: string
  name: string
  sku: string
  description?: string | null
  images?: string[] | null
  categoryName?: string | null
  /** Slug used for the public URL — falls back to SKU */
  slug?: string
  isAuthenticated?: boolean
}

export function ProductCard({
  id,
  name,
  sku,
  images,
  categoryName,
  slug,
  isAuthenticated = false,
}: ProductCardProps) {
  const href = `/catalogo/${encodeURIComponent(slug ?? sku)}`
  const firstImage = images?.[0]

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-sm bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={href} className="block shrink-0">
        <div className="relative aspect-square overflow-hidden bg-white">
          <SafeImage
            src={firstImage}
            alt={firstImage ? name : `${name} — imagen ilustrativa`}
            className="object-contain p-3"
          />
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1 px-3 pb-3 pt-2">
        {categoryName && (
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#737373]">
            {categoryName}
          </p>
        )}
        <Link href={href} className="line-clamp-2 min-h-[2.5rem] text-sm leading-snug text-[#333] hover:text-black">
          {name}
        </Link>
        <p className="truncate font-mono text-[11px] text-[#737373]" title={sku}>
          {sku}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Link href={href} className="text-xs font-semibold text-[#3483fa] hover:underline">
            Ver detalle
          </Link>
          <AddToListButton
            productId={id}
            isAuthenticated={isAuthenticated}
            returnUrl="/catalogo"
          />
        </div>
      </div>
    </article>
  )
}
