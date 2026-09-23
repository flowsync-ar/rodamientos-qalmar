import { Search } from 'lucide-react'

export function HeaderSearch() {
  return (
    <form action="/catalogo" method="get" className="min-w-0 flex-1">
      <div className="flex overflow-hidden rounded-sm bg-white shadow-sm">
        <input
          name="q"
          type="search"
          placeholder="Buscar productos, marcas y más…"
          className="h-10 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-[#333] outline-none placeholder:text-[#999]"
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="grid size-10 shrink-0 place-items-center text-[#333] hover:bg-black/5"
        >
          <Search className="size-4" />
        </button>
      </div>
    </form>
  )
}
