export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getActiveProducts } from '@/lib/products/queries'
import { getAllCategories } from '@/lib/categories/queries'
import { ProductCard } from '@/components/features/catalog/ProductCard'
import { CategoryCard } from '@/components/features/catalog/CategoryCard'
import { ProductGrid } from '@/components/features/catalog/ProductGrid'
import { HeroCarousel } from '@/components/features/catalog/HeroCarousel'
import { BrandsMarquee } from '@/components/features/catalog/BrandsMarquee'
import { buttonVariants } from '@/components/ui/button'

const CATEGORY_IMAGES: Record<string, string> = {
  'rodamiento-de-ruedas':    '/categorias/rodamiento-ruedas.png',
  'rodamientos-de-cajas':    '/categorias/rodamiento-cajas.png',
  'rodamientos-diferencial': '/categorias/rodamiento-diferencial.png',
  'rodamientos-agricolas':   '/categorias/agricola.png',
  'rodamiento-de-usos':      '/categorias/multiples-usos.png',
  'crapodinas-de-embrague':  '/categorias/crapodina%20de%20embrague.png',
}

export default async function CatalogHomePage() {
  let recentProducts: Awaited<ReturnType<typeof getActiveProducts>> = []
  let categories: Awaited<ReturnType<typeof getAllCategories>> = []

  try {
    ;[recentProducts, categories] = await Promise.all([
      getActiveProducts(8),
      getAllCategories(),
    ])
  } catch (error) {
    console.error('[CatalogHomePage] failed to load catalog data', error)
  }

  return (
    <div className="space-y-6">
      <HeroCarousel />

      <section className="flex flex-col items-start justify-between gap-4 rounded-sm bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Rodamientos y componentes industriales
          </h1>
          <p className="mt-1 text-sm text-[#666]">
            Buscá por código o marca y armá tu lista para pedir presupuesto.
          </p>
        </div>
        <Link href="/catalogo" className={buttonVariants({ size: 'lg' })}>
          Ver catálogo
        </Link>
      </section>

      {categories.length > 0 && (
        <section className="space-y-3 rounded-sm bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold">Categorías</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.slice(0, 8).map((cat) => (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                slug={cat.slug}
                image={CATEGORY_IMAGES[cat.slug]}
                productCount={cat.productCount}
              />
            ))}
          </div>
        </section>
      )}

      {recentProducts.length > 0 && (
        <section className="space-y-3 rounded-sm bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Inspirado en el catálogo</h2>
            <Link href="/catalogo" className="text-sm font-medium text-[#3483fa] hover:underline">
              Ver todos
            </Link>
          </div>
          <ProductGrid>
            {recentProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                sku={p.sku}
                images={p.images}
                categoryName={p.categoryName}
                slug={p.sku}
              />
            ))}
          </ProductGrid>
        </section>
      )}
      <BrandsMarquee />
    </div>
  )
}
