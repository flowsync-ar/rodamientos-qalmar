import Link from 'next/link'
import Image from 'next/image'
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AddToListButton } from './AddToListButton'

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
    <Card className="flex h-full flex-col overflow-hidden transition-transform hover:-translate-y-1">
      <Link href={href} className="block shrink-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={firstImage ?? '/imagen_no_disponible.png'}
            alt={firstImage ? name : 'Imagen no disponible'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={firstImage ? 'object-cover' : 'object-contain'}
          />
        </div>
      </Link>

      <CardHeader className="min-w-0 flex-1 gap-1">
        {categoryName && (
          <p className="text-xs font-medium text-foreground/70">{categoryName}</p>
        )}
        <p
          className="truncate font-mono text-[11px] font-semibold tracking-wide text-foreground/60"
          title={sku}
        >
          {sku}
        </p>
        <CardTitle className="line-clamp-2 min-h-[2.5rem] text-sm">
          <Link href={href} className="hover:underline">{name}</Link>
        </CardTitle>
      </CardHeader>

      <CardFooter className="mt-auto flex shrink-0 items-center justify-between gap-2 border-t-0 bg-transparent">
        <Link href={href} className="text-xs font-bold text-foreground underline hover:opacity-70">
          Ver detalles
        </Link>
        <AddToListButton
          productId={id}
          isAuthenticated={isAuthenticated}
          returnUrl="/catalogo"
        />
      </CardFooter>
    </Card>
  )
}
