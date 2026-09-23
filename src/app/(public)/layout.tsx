import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User } from 'lucide-react'
import { getUser } from '@/lib/auth/get-user'
import { getClientIdByProfileId, getCartItemCount } from '@/lib/interest-lists/queries'
import { isCliente, isAdmin, isVendedor } from '@/lib/auth/roles'
import { signOut } from '@/lib/auth/actions'
import { whatsappHref } from '@/lib/company/queries'
import { HeaderSearch } from '@/components/features/catalog/HeaderSearch'

const topLink =
  'whitespace-nowrap text-sm font-medium text-[#333] hover:opacity-70 transition-opacity'
const subLink =
  'whitespace-nowrap text-sm text-[#333] hover:text-black transition-colors'

async function getCartCount(): Promise<number> {
  try {
    const user = await getUser()
    if (!user) return 0
    const clientId = await getClientIdByProfileId(user.id)
    if (!clientId) return 0
    return await getCartItemCount(clientId)
  } catch {
    return 0
  }
}

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [cartCount, user] = await Promise.all([getCartCount(), getUser()])

  const isClienteUser = user && isCliente(user.role)
  const isStaffUser = user && (isAdmin(user.role) || isVendedor(user.role))

  return (
    <div className="storefront min-h-screen">
      <header className="relative z-20 bg-[var(--brand-yellow)]">
        <div className="relative mx-auto max-w-6xl px-4">
          <Link
            href="/"
            className="absolute left-4 top-0 z-30 block h-20 w-20 drop-shadow-sm"
          >
            <Image
              src="/logo1.png"
              alt="Qalmar"
              fill
              sizes="80px"
              priority
              className="object-contain"
            />
          </Link>

          <div className="flex flex-wrap items-center gap-3 py-2 pl-[6.75rem]">
          <HeaderSearch />

          <div className="ml-auto flex items-center gap-4">
            {isClienteUser ? (
              <>
                <Link href="/mi-cuenta" className={`${topLink} hidden sm:inline-flex items-center gap-1.5`}>
                  <User className="size-4" />
                  Mi cuenta
                </Link>
                <Link href="/mis-presupuestos" className={`${topLink} hidden md:inline`}>
                  Presupuestos
                </Link>
                <Link href="/mis-compras" className={`${topLink} hidden md:inline`}>
                  Compras
                </Link>
                <form action={signOut}>
                  <button type="submit" className={topLink}>
                    Salir
                  </button>
                </form>
              </>
            ) : isStaffUser ? (
              <>
                <Link href="/admin/dashboard" className={topLink}>
                  Panel admin
                </Link>
                <form action={signOut}>
                  <button type="submit" className={topLink}>
                    Salir
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" className={`${topLink} inline-flex items-center gap-1.5`}>
                <User className="size-4" />
                Ingresá
              </Link>
            )}

            <Link href="/mi-lista" className="relative flex items-center" aria-label="Mi lista">
              <ShoppingCart className="h-5 w-5 text-[#333]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#333] px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
          </div>
        </div>
      </header>

      <nav className="relative z-10 border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-5 overflow-x-auto px-4 py-2 pl-[6.75rem]">
          <Link href="/" className={subLink}>
            Inicio
          </Link>
          <Link href="/catalogo" className={subLink}>
            Productos
          </Link>
          <Link href="/nosotros" className={subLink}>
            La empresa
          </Link>
          <Link href="/envio" className={subLink}>
            Envíos
          </Link>
          <Link href="/contacto" className={subLink}>
            Contacto
          </Link>
          {isClienteUser && (
            <Link href="/mi-cuenta" className={`${subLink} sm:hidden`}>
              Mi cuenta
            </Link>
          )}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

      <footer className="mt-10 border-t border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-8 text-sm text-[#666] sm:flex-row sm:items-center">
          <nav className="flex flex-wrap gap-6">
            <Link href="/nosotros" className="hover:text-[#333]">
              La Empresa
            </Link>
            <Link href="/envio" className="hover:text-[#333]">
              Información de Envío
            </Link>
            <Link href="/contacto" className="hover:text-[#333]">
              Contacto
            </Link>
          </nav>
          <div className="space-y-1 text-xs sm:text-right">
            <p>© {new Date().getFullYear()} Qalmar</p>
            <p>
              Desarrollado por{' '}
              <a
                href="https://www.flowsync.com.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:opacity-80"
              >
                <strong style={{ color: '#128A5C' }}>FlowSync</strong> Core
              </a>
            </p>
          </div>
        </div>
      </footer>

      <a
        href={whatsappHref('Estoy en su tienda, necesito asesoramiento')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-20 right-6 z-[9998] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110"
        style={{ backgroundColor: '#25D366' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="30"
          height="30"
          fill="white"
        >
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.823.737 5.473 2.027 7.774L0 32l8.426-2.01A15.938 15.938 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.77-1.852l-.485-.29-5.003 1.194 1.228-4.877-.317-.5A13.268 13.268 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.878c-.398-.2-2.354-1.162-2.719-1.294-.365-.133-.631-.2-.898.2-.266.398-1.031 1.294-1.264 1.56-.232.266-.465.3-.863.1-.398-.2-1.682-.62-3.203-1.977-1.184-1.056-1.983-2.36-2.215-2.758-.232-.398-.025-.613.175-.812.18-.179.398-.465.598-.697.2-.232.266-.398.398-.664.133-.266.067-.498-.033-.697-.1-.2-.898-2.164-1.23-2.962-.324-.778-.654-.673-.898-.685l-.764-.013c-.266 0-.697.1-.1063.498-.365.398-1.397 1.364-1.397 3.327 0 1.963 1.43 3.86 1.629 4.126.2.266 2.815 4.296 6.821 6.025.953.412 1.696.658 2.276.842.956.305 1.826.262 2.515.159.767-.115 2.354-.963 2.686-1.893.332-.93.332-1.728.232-1.893-.1-.166-.365-.266-.764-.465z" />
        </svg>
      </a>
    </div>
  )
}
