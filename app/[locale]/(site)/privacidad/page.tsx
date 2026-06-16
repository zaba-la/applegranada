import { unstable_setRequestLocale } from 'next-intl/server';

export async function generateMetadata() {
  return { title: 'Política de Privacidad' };
}

export default function PrivacidadPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
      <p className="text-sm text-muted-foreground mb-10">Última actualización: junio de 2026</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold mb-3">1. Responsable del tratamiento</h2>
          <p>
            El responsable del tratamiento de los datos personales recogidos a través de{' '}
            <strong>soportegranada.com</strong> es Soporte Granada, con domicilio en Granada (España).
            Contacto: <a href="mailto:soporte@soportegranada.com" className="underline">soporte@soportegranada.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">2. Datos que recopilamos</h2>
          <p>Recopilamos únicamente los datos necesarios para la prestación del servicio:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Datos de registro:</strong> nombre completo, dirección de correo electrónico y contraseña cifrada.</li>
            <li><strong>Datos de contacto opcionales:</strong> número de teléfono y dirección postal.</li>
            <li><strong>Datos de uso:</strong> tickets de soporte, mensajes e historial de interacciones con el servicio.</li>
            <li><strong>Datos técnicos:</strong> dirección IP, tipo de dispositivo y navegador (recogidos automáticamente por razones de seguridad y rendimiento).</li>
          </ul>
          <p className="mt-2">No recopilamos datos especialmente protegidos (salud, ideología, religión, etc.).</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">3. Finalidad y base jurídica del tratamiento</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse mt-2">
              <thead>
                <tr className="bg-muted">
                  <th className="border px-3 py-2 text-left font-semibold">Finalidad</th>
                  <th className="border px-3 py-2 text-left font-semibold">Base jurídica</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-3 py-2">Gestión de la cuenta de usuario</td>
                  <td className="border px-3 py-2">Ejecución de contrato (art. 6.1.b RGPD)</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2">Prestación de servicios de soporte técnico</td>
                  <td className="border px-3 py-2">Ejecución de contrato (art. 6.1.b RGPD)</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2">Comunicaciones relacionadas con el servicio</td>
                  <td className="border px-3 py-2">Interés legítimo (art. 6.1.f RGPD)</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2">Cumplimiento de obligaciones legales y fiscales</td>
                  <td className="border px-3 py-2">Obligación legal (art. 6.1.c RGPD)</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2">Envío de comunicaciones comerciales (si es aceptado)</td>
                  <td className="border px-3 py-2">Consentimiento (art. 6.1.a RGPD)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">4. Conservación de los datos</h2>
          <p>
            Los datos se conservarán durante el tiempo que el usuario mantenga su cuenta activa y,
            una vez cancelada, durante los plazos legalmente exigidos (hasta 5 años para obligaciones
            fiscales y mercantiles). Transcurrido dicho plazo, los datos serán eliminados o anonimizados.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">5. Comunicación a terceros</h2>
          <p>
            Los datos no serán cedidos a terceros salvo obligación legal o en los siguientes supuestos
            estrictamente necesarios para la prestación del servicio:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Proveedores de pago</strong> (Stripe, PayPal): para procesar los pagos de forma segura.</li>
            <li><strong>Proveedor de hosting</strong> (Vercel, Neon): para alojar la plataforma y la base de datos.</li>
            <li><strong>Proveedor de correo electrónico</strong>: para el envío de notificaciones transaccionales.</li>
          </ul>
          <p className="mt-2">
            Todos los proveedores actúan como encargados del tratamiento bajo las garantías del RGPD.
            No se realizan transferencias internacionales de datos fuera del Espacio Económico Europeo
            sin las salvaguardas adecuadas.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">6. Derechos del interesado</h2>
          <p>
            De acuerdo con el RGPD (UE) 2016/679 y la LOPDGDD (Ley Orgánica 3/2018), el usuario puede
            ejercer en cualquier momento los siguientes derechos enviando un correo a{' '}
            <a href="mailto:soporte@soportegranada.com" className="underline">soporte@soportegranada.com</a>:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Acceso:</strong> obtener confirmación de si se tratan datos y acceder a ellos.</li>
            <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
            <li><strong>Supresión:</strong> solicitar la eliminación de los datos («derecho al olvido»).</li>
            <li><strong>Limitación:</strong> restringir el tratamiento en determinadas circunstancias.</li>
            <li><strong>Portabilidad:</strong> recibir los datos en formato estructurado y de uso común.</li>
            <li><strong>Oposición:</strong> oponerse al tratamiento basado en interés legítimo.</li>
          </ul>
          <p className="mt-2">
            El usuario tiene derecho a presentar una reclamación ante la{' '}
            <strong>Agencia Española de Protección de Datos (AEPD)</strong> en{' '}
            <a href="https://www.aepd.es" className="underline" target="_blank" rel="noreferrer">www.aepd.es</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">7. Seguridad</h2>
          <p>
            Soporte Granada aplica medidas técnicas y organizativas apropiadas para garantizar un nivel de
            seguridad adecuado al riesgo: cifrado de contraseñas mediante bcrypt, comunicaciones
            cifradas mediante TLS/HTTPS y acceso restringido a los datos de producción.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">8. Cookies</h2>
          <p>
            Este sitio utiliza cookies estrictamente necesarias para el funcionamiento de la sesión de
            usuario (autenticación). No se utilizan cookies de rastreo o publicidad de terceros.
            Para más información puede consultar nuestra{' '}
            <a href="mailto:soporte@soportegranada.com" className="underline">política de cookies</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">9. Modificaciones</h2>
          <p>
            Soporte Granada puede actualizar esta Política de Privacidad para adaptarla a cambios
            legislativos o del servicio. Se notificará a los usuarios registrados cualquier cambio
            sustancial con al menos 15 días de antelación por correo electrónico.
          </p>
        </section>

      </div>
    </div>
  );
}
