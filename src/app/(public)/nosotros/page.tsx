import { WHATSAPP_DISPLAY, whatsappHref } from '@/lib/company/queries'

export default function NosotrosPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-3xl font-bold">La Empresa</h1>
        <p className="text-muted-foreground mt-2">Qalmar</p>
      </div>

      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Qalmar es una empresa enfocada en la importación y distribución de rodamientos.
          Distribuimos una gran variedad de marcas: <strong className="text-foreground">FAG, TIMKEN, INA, FERSA, NTN, KOYO, STEYR, SKF, EBI, KG, ZNL y CFC ITALY</strong>.
          Todas sinónimo de calidad y durabilidad, características indispensables para tu negocio.
        </p>
        <p>
          Cubrimos todos los segmentos: rodamientos para el sector automotor liviano y pesado, para la industria y el agro.
          Realizamos envíos a todo el país.
        </p>
        <p>
          Con más de <strong className="text-foreground">15 años de trayectoria</strong> en el mercado, Qalmar no solo se ha posicionado como referente del sector,
          sino que brinda soluciones específicas de acuerdo a las necesidades particulares de cada cliente.
        </p>
      </div>

      <div className="border-t pt-6 text-sm text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">Qalmar</p>
        <p>GONCALVEZ DELGADO RODOLFO NICOLAS ALEJANDRO</p>
        <p>CUIT 20-29565129-7</p>
        <p>Don Bosco 872, Bahía Blanca, Buenos Aires, Argentina</p>
        <p>
          <a
            href={whatsappHref('Hola, quiero hacer una consulta')}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            WhatsApp: {WHATSAPP_DISPLAY}
          </a>
        </p>
      </div>
    </div>
  )
}
