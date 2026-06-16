import { unstable_setRequestLocale } from 'next-intl/server';

export async function generateMetadata() {
  return { title: 'Términos de Uso' };
}

export default function TerminosPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Términos de Uso</h1>
      <p className="text-sm text-muted-foreground mb-10">Última actualización: junio de 2026</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold mb-3">1. Identificación del prestador</h2>
          <p>
            El presente sitio web <strong>soportegranada.com</strong> es operado por Soporte Granada, con domicilio
            en Granada (España). Para cualquier consulta puede contactar en{' '}
            <a href="mailto:soporte@soportegranada.com" className="underline">soporte@soportegranada.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">2. Objeto y ámbito de aplicación</h2>
          <p>
            Estos Términos de Uso regulan el acceso y la utilización del sitio web y de la plataforma de
            gestión de tickets de soporte técnico para dispositivos Apple. Al crear una cuenta y utilizar
            los servicios, el usuario acepta íntegramente las presentes condiciones.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">3. Registro de cuenta</h2>
          <p>
            Para acceder a determinadas funcionalidades es necesario registrarse facilitando datos verídicos
            y actualizados. El usuario es responsable de mantener la confidencialidad de sus credenciales
            de acceso y de todas las actividades realizadas bajo su cuenta.
          </p>
          <p className="mt-2">
            Soporte Granada se reserva el derecho de suspender o cancelar cuentas en caso de uso fraudulento,
            facilitación de datos falsos o incumplimiento de los presentes Términos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">4. Servicios de soporte técnico</h2>
          <p>
            Soporte Granada presta servicios de asistencia técnica para dispositivos de la marca Apple en
            las modalidades de <strong>soporte remoto</strong> (a través de conexión segura vía TeamViewer)
            y <strong>soporte presencial</strong> (desplazamiento a domicilio u oficina en Granada y área
            metropolitana).
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>La tarifa de soporte remoto es de <strong>19 €/hora</strong>, sin mínimo de horas.</li>
            <li>La tarifa de soporte presencial es de <strong>39 €/hora</strong>, con un mínimo de 2 horas (78 €), desplazamiento incluido.</li>
            <li>El inicio de cualquier sesión de soporte queda supeditado a la confirmación del pago previo.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">5. Condiciones de pago</h2>
          <p>
            El pago es <strong>previo y obligatorio</strong> antes de iniciar la sesión de soporte. Una vez
            confirmado el pago, Soporte Granada contactará al usuario en un plazo máximo de 24 horas para
            coordinar la sesión. Los precios incluyen IVA salvo indicación expresa en contrario.
          </p>
          <p className="mt-2">
            Soporte Granada no se hace responsable de los tiempos de procesamiento de los proveedores de pago
            (Stripe, PayPal u otros).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">6. Limitación de responsabilidad</h2>
          <p>
            Soporte Granada empleará su mejor conocimiento técnico en la resolución de los problemas notificados,
            pero no garantiza la resolución total de ningún problema. En ningún caso Soporte Granada será
            responsable de la pérdida de datos del usuario; se recomienda realizar copias de seguridad
            antes de cualquier intervención técnica.
          </p>
          <p className="mt-2">
            La responsabilidad máxima de Soporte Granada frente al usuario estará limitada al importe
            efectivamente abonado por el servicio concreto en cuestión.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">7. Propiedad intelectual</h2>
          <p>
            Todos los contenidos del sitio web (textos, imágenes, logotipos, diseño y código) son propiedad
            de Soporte Granada o cuentan con la correspondiente licencia de uso. Queda prohibida su reproducción,
            distribución o modificación sin autorización expresa y por escrito.
          </p>
          <p className="mt-2 text-muted-foreground text-xs">
            Soporte Granada no tiene ninguna relación, asociación ni acreditación oficial con Apple Inc.
            El nombre hace referencia geográfica y no implica afiliación con la marca Apple.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">8. Legislación aplicable y jurisdicción</h2>
          <p>
            Los presentes Términos de Uso se rigen por la legislación española. Para cualquier controversia
            derivada de su interpretación o aplicación, ambas partes se someten, con renuncia expresa a
            cualquier otro fuero, a los Juzgados y Tribunales de Granada (España).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">9. Modificaciones</h2>
          <p>
            Soporte Granada se reserva el derecho a modificar estos Términos en cualquier momento. Los cambios
            serán comunicados a través del sitio web y, en caso de modificaciones sustanciales, por correo
            electrónico a los usuarios registrados. El uso continuado del servicio tras la publicación de
            los cambios implica la aceptación de los mismos.
          </p>
        </section>

      </div>
    </div>
  );
}
