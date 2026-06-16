'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/fade-in';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface FAQ {
  q: string;
  a: string;
}

interface Category {
  title: string;
  faqs: FAQ[];
}

const categories: Category[] = [
  {
    title: 'Soporte general y servicio',
    faqs: [
      {
        q: '¿Qué cubre exactamente el soporte de Soporte Granada?',
        a: 'Cubrimos software de los ecosistemas Apple y Microsoft: macOS, iPadOS, iOS y Windows. Incluye mantenimiento preventivo, resolución de problemas, configuraciones, migraciones, recuperación de datos y formación básica en el uso de tus dispositivos.',
      },
      {
        q: '¿Reparan hardware (pantallas, baterías, puertos)?',
        a: 'No. Somos un servicio técnico de software. Si tienes un problema de hardware te orientamos hacia el servicio técnico oficial de Apple o un centro autorizado.',
      },
      {
        q: '¿Cómo funciona el proceso de solicitud de soporte?',
        a: 'Creas una cuenta, abres un ticket indicando qué le ocurre a tu equipo y realizas el pago correspondiente (19€/h remoto o 39€/h presencial, mínimo 2h presencial). Una vez confirmado el pago, te contactamos en menos de 24 horas para coordinar la sesión.',
      },
      {
        q: '¿El pago es obligatorio antes de comenzar?',
        a: 'Sí. El soporte no comienza hasta confirmar el pago. Esto garantiza disponibilidad inmediata del técnico. El pago se realiza por las horas estimadas y ajustamos si el trabajo lleva más o menos tiempo.',
      },
      {
        q: '¿Qué ocurre si no se resuelve el problema?',
        a: 'Si tras la sesión el problema persiste tal cual, lo analizamos juntos y buscamos una solución alternativa. Valoramos cada caso de forma individual. No hacemos promesas genéricas, pero sí nos comprometemos con la calidad del trabajo.',
      },
      {
        q: '¿Cuánto tarda en responderse un ticket?',
        a: 'Respondemos en un plazo máximo de 24 horas laborables una vez confirmado el pago. En la mayoría de los casos la respuesta es el mismo día.',
      },
    ],
  },
  {
    title: 'Soporte remoto',
    faqs: [
      {
        q: '¿Qué necesito para el soporte remoto?',
        a: 'Solo necesitas que tu Mac, iPad o iPhone esté encendido y conectado a internet. Usamos TeamViewer, que puedes descargar de forma gratuita desde teamviewer.com.',
      },
      {
        q: '¿Por qué TeamViewer y no FaceTime u otras opciones?',
        a: 'TeamViewer nos permite tomar control del equipo de forma segura para diagnosticar y resolver el problema de manera eficiente. FaceTime solo permite ver la pantalla, lo que limita enormemente lo que podemos hacer.',
      },
      {
        q: '¿Es seguro dar acceso remoto a mi equipo?',
        a: 'Sí. TeamViewer cifra la conexión de extremo a extremo. Tú puedes ver en tiempo real todo lo que hace el técnico en tu pantalla. La sesión termina en cuanto tú lo decides. El ID y contraseña de sesión cambian cada vez que abres TeamViewer.',
      },
      {
        q: '¿El soporte remoto funciona con iPad e iPhone?',
        a: 'Sí, pero con limitaciones. Para iOS/iPadOS el soporte remoto sirve principalmente para orientación visual y configuración guiada. La toma de control completa solo está disponible en Mac.',
      },
      {
        q: '¿Qué pasa si mi equipo no arranca y no puedo abrir TeamViewer?',
        a: 'En ese caso el soporte remoto no es viable. Te recomendamos el soporte presencial, donde el técnico puede acceder al equipo directamente aunque no arranque normalmente.',
      },
    ],
  },
  {
    title: 'macOS',
    faqs: [
      {
        q: '¿Puedo actualizar a la última versión de macOS sin riesgos?',
        a: 'Depende de tu equipo y las apps que uses. Antes de actualizar te recomendamos verificar la compatibilidad de tu Mac y hacer una copia de seguridad completa. Podemos acompañarte en el proceso para que la actualización sea segura.',
      },
      {
        q: '¿Por qué mi Mac va tan lento?',
        a: 'Las causas más comunes son: disco casi lleno, demasiadas apps en el inicio, software antiguo, o procesos consumiendo recursos en segundo plano. En una sesión de diagnóstico identificamos la causa exacta y la resolvemos.',
      },
      {
        q: '¿Qué hago si mi Mac se reinicia solo o se congela?',
        a: 'Puede ser un problema de software o de compatibilidad con una app reciente. Antes de traerlo a soporte, anota cuándo ocurre (al abrir una app, al arrancar, etc.) para que el diagnóstico sea más rápido.',
      },
      {
        q: '¿Pueden recuperar datos de un Mac que no arranca?',
        a: 'En muchos casos sí, si el problema es de software. Usamos el Modo de Recuperación y herramientas específicas de macOS. Si el problema es hardware (disco dañado físicamente), necesitarías un servicio especializado en recuperación de datos.',
      },
      {
        q: '¿Pueden limpiar mi Mac de virus o adware?',
        a: 'Sí. Aunque macOS es más seguro que otros sistemas, los Macs pueden tener adware (publicidad no deseada) o software no solicitado. Lo eliminamos completamente y reforzamos la configuración de seguridad.',
      },
    ],
  },
  {
    title: 'Windows',
    faqs: [
      {
        q: '¿Por qué mi PC con Windows va tan lento?',
        a: 'Las causas más comunes son: disco casi lleno, demasiados programas abriéndose al inicio, una instalación con años de archivos temporales, o malware consumiendo recursos sin que lo notes. En una sesión de diagnóstico identificamos la causa exacta y la resolvemos.',
      },
      {
        q: 'Mi PC tiene Windows 10, ¿qué hago ahora?',
        a: 'Windows 10 dejó de recibir soporte de seguridad en octubre de 2025. Valoramos si tu equipo admite Windows 11 y planificamos la actualización segura con copia de seguridad previa; si no es compatible, te damos alternativas claras y sin presión comercial.',
      },
      {
        q: '¿Necesito instalar un antivirus de pago en Windows 11?',
        a: 'Para la mayoría de usuarios domésticos, no. Windows 11 incluye Microsoft Defender, una protección sólida y gratuita. Lo importante es mantener Windows actualizado, no duplicar antivirus y tener cuidado con correos y enlaces. Si tu equipo ya está infectado, lo limpiamos a fondo.',
      },
      {
        q: '¿Qué hago si mi PC tiene pantallazos azules (BSOD) o no arranca?',
        a: 'Puede ser un problema de drivers, una actualización reciente o errores de disco. Antes de traerlo a soporte, anota cuándo ocurre (al abrir una app, al arrancar, etc.) para que el diagnóstico sea más rápido; en muchos casos se resuelve sin perder datos.',
      },
      {
        q: '¿Pueden gestionar varios PCs de mi empresa con Microsoft Intune?',
        a: 'Sí. Implantamos y administramos Microsoft Intune para gestionar, proteger (cifrado BitLocker) y actualizar todos los equipos de tu empresa desde un único panel, con un punto de contacto único.',
      },
    ],
  },
  {
    title: 'iPadOS e iPhone',
    faqs: [
      {
        q: '¿Qué tipo de problemas de iPad o iPhone resuelven?',
        a: 'Problemas de software: actualizaciones, configuración de cuentas, iCloud, sincronización, apps que no funcionan, recuperación de acceso, configuración de correo y ajustes de privacidad y seguridad.',
      },
      {
        q: '¿Pueden hacer la configuración inicial de un iPad o iPhone nuevo?',
        a: 'Sí. Hacemos la configuración completa: transferencia de datos del equipo antiguo, configuración de iCloud, correo, aplicaciones habituales y ajustes de privacidad. Ideal si no quieres perderte nada en el cambio.',
      },
      {
        q: '¿Qué hago si olvidé el código del iPad o iPhone?',
        a: 'Si el equipo está vinculado a tu Apple ID podemos restaurarlo de forma segura a través de iCloud o iTunes conservando tus datos. Si no recuerdas el Apple ID también hay opciones, aunque más limitadas.',
      },
      {
        q: '¿Pueden configurar parental controls para los equipos de mis hijos?',
        a: 'Sí. Configuramos el Tiempo de Pantalla de Apple con restricciones, límites de apps, control de contenido y comunicación. Ideal para familias.',
      },
    ],
  },
  {
    title: 'iCloud',
    faqs: [
      {
        q: '¿Por qué mis fotos o archivos no sincronizan con iCloud?',
        a: 'Lo más habitual es falta de espacio en iCloud, sesión cerrada, o conflicto de configuración entre dispositivos. Lo revisamos y lo dejamos funcionando correctamente.',
      },
      {
        q: '¿Puedo recuperar fotos o archivos borrados de iCloud?',
        a: 'iCloud guarda los elementos eliminados hasta 30 días en la papelera de iCloud. Pasado ese plazo, la recuperación es muy difícil. Si hay archivos importantes, te ayudamos a activar copias de seguridad adicionales para el futuro.',
      },
      {
        q: '¿Cómo comparto el almacenamiento de iCloud con mi familia?',
        a: 'Con iCloud+ puedes crear un Compartir en familia y repartir el almacenamiento entre hasta 5 miembros. Te ayudamos a configurarlo paso a paso.',
      },
      {
        q: '¿Qué pasa si lleno el almacenamiento de iCloud?',
        a: 'Cuando se llena, el equipo deja de hacer copias de seguridad y los archivos nuevos no sincronizan. Puedes ampliar el plan de almacenamiento o limpiar lo que ya no necesitas. Te orientamos en ambas opciones.',
      },
    ],
  },
  {
    title: 'Google Drive en Mac',
    faqs: [
      {
        q: '¿Por qué Google Drive consume tanta memoria en mi Mac?',
        a: 'La app "Drive para escritorio" de Google puede ser muy exigente. Hay configuraciones para limitar su impacto: sincronización selectiva, streaming en lugar de descarga local, y ajuste de los recursos que usa en segundo plano.',
      },
      {
        q: '¿Puedo usar Google Drive junto con iCloud en el mismo Mac?',
        a: 'Sí, no son incompatibles. Lo habitual es usar iCloud para las apps de Apple y Google Drive para el trabajo colaborativo. Te ayudamos a organizar ambos para evitar duplicidades y confusiones.',
      },
      {
        q: '¿Qué hago si Google Drive se desconecta o no sincroniza en Mac?',
        a: 'Suele ser un problema de credenciales caducadas, actualización pendiente de la app, o conflicto con permisos del sistema. En la mayoría de los casos se resuelve en menos de 15 minutos.',
      },
    ],
  },
  {
    title: 'Microsoft 365 (Office)',
    faqs: [
      {
        q: '¿Por qué Word, Excel o PowerPoint se cierran solos en mi Mac?',
        a: 'Puede ser una app desactualizada, conflicto con una extensión o un archivo corrupto de preferencias. Actualizamos la app, limpiamos las preferencias y comprobamos la licencia.',
      },
      {
        q: '¿Pueden instalar o activar Microsoft 365 en mi Mac?',
        a: 'Sí. Te ayudamos a instalar la suite completa de Office y a vincularla a tu cuenta de Microsoft correctamente. También gestionamos el traspaso de la licencia si cambias de equipo.',
      },
      {
        q: '¿OneDrive y SharePoint funcionan bien en Mac?',
        a: 'Generalmente sí, pero hay configuraciones que afectan al rendimiento. Te ayudamos a dejarlo sincronizando correctamente sin que ralentice el sistema.',
      },
      {
        q: '¿Pueden recuperar un documento de Word o Excel que no se guardó?',
        a: 'Office guarda versiones automáticas cada pocos minutos. En muchos casos podemos recuperar el archivo desde el historial de versiones o desde la carpeta de recuperación automática de Office.',
      },
    ],
  },
];

function AccordionItem({ faq, open, onToggle }: { faq: FAQ; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 py-4 text-left text-sm font-medium hover:text-foreground transition-colors"
        aria-expanded={open}
      >
        <span>{faq.q}</span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform mt-0.5', open && 'rotate-180')}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden text-sm text-muted-foreground leading-relaxed transition-all',
          open ? 'max-h-96 pb-4' : 'max-h-0',
        )}
      >
        {faq.a}
      </div>
    </div>
  );
}

export default function FaqPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="container mx-auto px-4 py-16">
      <FadeIn>
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold mb-4">Preguntas frecuentes</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Respuestas a las dudas más habituales sobre nuestro servicio y los ecosistemas Apple y Windows.
          </p>
        </div>
      </FadeIn>

      <div className="max-w-3xl mx-auto space-y-12">
        {categories.map((cat, ci) => (
          <FadeIn key={cat.title} delay={ci * 60}>
            <section>
              <h2 className="text-lg font-semibold mb-4 pb-3 border-b">{cat.title}</h2>
              <div className="divide-y rounded-lg border px-5">
                {cat.faqs.map((faq, fi) => {
                  const key = `${ci}-${fi}`;
                  return (
                    <AccordionItem
                      key={key}
                      faq={faq}
                      open={!!openItems[key]}
                      onToggle={() => toggle(key)}
                    />
                  );
                })}
              </div>
            </section>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={200}>
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">¿No encuentras respuesta a tu pregunta?</p>
          <Link
            href={`/${locale}/contacto`}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Escríbenos directamente
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
