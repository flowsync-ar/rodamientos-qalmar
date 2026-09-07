import { WHATSAPP_DISPLAY, whatsappHref } from '@/lib/company/queries'

export default function ContactoPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Contacto</h1>
        <p className="text-foreground/80 mt-2">
          Completá el formulario y te respondemos a la brevedad.
        </p>
      </div>

      <form className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="nombre" className="flex h-5 items-center text-sm font-medium">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              placeholder="Tu nombre"
              className="w-full rounded-lg border border-foreground/20 bg-white px-3 py-2 text-sm outline-none placeholder:text-foreground/45 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="empresa" className="flex h-5 items-center gap-1 whitespace-nowrap text-sm font-medium">
              Empresa <span className="font-normal text-foreground/55">(opcional)</span>
            </label>
            <input
              id="empresa"
              name="empresa"
              type="text"
              placeholder="Nombre de tu empresa"
              className="w-full rounded-lg border border-foreground/20 bg-white px-3 py-2 text-sm outline-none placeholder:text-foreground/45 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="flex h-5 items-center text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              className="w-full rounded-lg border border-foreground/20 bg-white px-3 py-2 text-sm outline-none placeholder:text-foreground/45 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="telefono" className="flex h-5 items-center gap-1 whitespace-nowrap text-sm font-medium">
              Teléfono <span className="font-normal text-foreground/55">(opcional)</span>
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              placeholder="+54 11 0000-0000"
              className="w-full rounded-lg border border-foreground/20 bg-white px-3 py-2 text-sm outline-none placeholder:text-foreground/45 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="asunto" className="text-sm font-medium">
            Asunto
          </label>
          <input
            id="asunto"
            name="asunto"
            type="text"
            required
            placeholder="ej. Consulta sobre rodamientos industriales"
            className="w-full rounded-lg border border-foreground/20 bg-white px-3 py-2 text-sm outline-none placeholder:text-foreground/45 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="mensaje" className="text-sm font-medium">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            required
            rows={5}
            placeholder="Contanos en qué podemos ayudarte..."
            className="w-full resize-y rounded-lg border border-foreground/20 bg-white px-3 py-2 text-sm outline-none placeholder:text-foreground/45 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Enviar mensaje
        </button>
      </form>

      <div className="border-t pt-6 space-y-4 text-sm text-foreground/75">
        <div>
          <p className="font-semibold text-foreground text-base">Qalmar</p>
          <p>Nombre de fantasía</p>
          <p className="mt-2 font-medium text-foreground">
            GONCALVEZ DELGADO RODOLFO NICOLAS ALEJANDRO
          </p>
          <p>CUIT 20-29565129-7</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="font-medium text-foreground mb-1">Dirección</p>
            <p>Don Bosco 2417</p>
            <p>Bahía Blanca, Buenos Aires, Argentina</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">WhatsApp</p>
            <a
              href={whatsappHref('Hola, quiero hacer una consulta')}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {WHATSAPP_DISPLAY}
            </a>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Horario</p>
            <p>Lunes a viernes</p>
            <p>9:00 – 18:00 hs</p>
          </div>
        </div>
      </div>
    </div>
  )
}
