import type { ReactNode } from 'react'

interface ProductGridProps {
  children: ReactNode
  className?: string
}

export function ProductGrid({ children, className }: ProductGridProps) {
  return (
    <div
      className={[
        'grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
