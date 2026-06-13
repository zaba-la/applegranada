import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn('[email] SMTP no configurado — email no enviado:', { to, subject });
    return;
  }
  await transporter.sendMail({
    from: `"AppleGranada Soporte" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

export function ticketCreatedEmailHtml(params: {
  customerName: string;
  ticketCode: string;
  ticketTitle: string;
  serviceMode: 'REMOTE' | 'ON_SITE';
  hourlyRate: number;
}) {
  const { customerName, ticketCode, ticketTitle, serviceMode, hourlyRate } = params;
  const modeLabel = serviceMode === 'REMOTE' ? 'Soporte Remoto' : 'Soporte Presencial';
  const minLabel =
    serviceMode === 'REMOTE'
      ? `${hourlyRate}€/hora · mínimo 1 hora`
      : `${hourlyRate}€/hora · mínimo 2 horas (${hourlyRate * 2}€)`;

  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
        <!-- Header -->
        <tr>
          <td style="background:#000;padding:24px 32px;">
            <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">
              <strong>Apple</strong>Granada
            </p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;color:#111;font-size:20px;font-weight:700;">
              Ticket abierto — acción requerida
            </p>
            <p style="margin:0 0 24px;color:#666;font-size:15px;">
              Hola ${customerName}, hemos registrado tu solicitud de soporte técnico.
              Para procesarla necesitamos confirmar el pago antes de iniciar la sesión.
            </p>

            <!-- Ticket card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border:1px solid #e5e5e5;border-radius:8px;margin-bottom:24px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 4px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:.5px;">Código de ticket</p>
                  <p style="margin:0 0 16px;color:#111;font-size:22px;font-weight:700;letter-spacing:1px;">${ticketCode}</p>
                  <p style="margin:0 0 4px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:.5px;">Asunto</p>
                  <p style="margin:0 0 16px;color:#111;font-size:15px;">${ticketTitle}</p>
                  <p style="margin:0 0 4px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:.5px;">Modalidad</p>
                  <p style="margin:0;color:#111;font-size:15px;">${modeLabel} · ${minLabel}</p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 16px;color:#444;font-size:15px;">
              Para confirmar y reservar tu sesión, realiza el pago del importe mínimo
              correspondiente a la modalidad elegida. Una vez verificado el pago,
              nuestro equipo se pondrá en contacto contigo para coordinar la sesión.
            </p>
            <p style="margin:0 0 24px;color:#444;font-size:15px;">
              Si tienes alguna pregunta, responde a este correo o escríbenos por WhatsApp.
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#000;border-radius:8px;padding:12px 24px;">
                  <a href="https://wa.me/34644411252?text=Hola%2C+tengo+el+ticket+${ticketCode}"
                     style="color:#fff;text-decoration:none;font-size:15px;font-weight:600;">
                    Contactar por WhatsApp
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #f0f0f0;">
            <p style="margin:0;color:#999;font-size:12px;">
              soporte@applegranada.com · +34 644 411 252 · Granada<br>
              © ${new Date().getFullYear()} AppleGranada. Todos los derechos reservados.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function ticketResponseEmailHtml(params: {
  customerName: string;
  ticketCode: string;
  ticketTitle: string;
  adminMessage: string;
  newStatus?: string;
}) {
  const { customerName, ticketCode, ticketTitle, adminMessage, newStatus } = params;

  const statusLabel: Record<string, string> = {
    OPEN: 'Abierto',
    IN_PROGRESS: 'En progreso',
    WAITING_CUSTOMER: 'Esperando tu respuesta',
    RESOLVED: 'Resuelto',
    CLOSED: 'Cerrado',
  };

  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
        <tr>
          <td style="background:#000;padding:24px 32px;">
            <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">
              <strong>Apple</strong>Granada
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;color:#111;font-size:20px;font-weight:700;">
              Actualización en tu ticket
            </p>
            <p style="margin:0 0 24px;color:#666;font-size:15px;">
              Hola ${customerName}, hemos añadido una actualización a tu solicitud de soporte.
            </p>

            <!-- Ticket info -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border:1px solid #e5e5e5;border-radius:8px;margin-bottom:20px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 4px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:.5px;">Ticket</p>
                  <p style="margin:0 0 12px;color:#111;font-size:18px;font-weight:700;letter-spacing:1px;">${ticketCode}</p>
                  <p style="margin:0;color:#555;font-size:14px;">${ticketTitle}</p>
                  ${newStatus ? `<p style="margin:8px 0 0;color:#999;font-size:12px;">Estado: <strong style="color:#111;">${statusLabel[newStatus] ?? newStatus}</strong></p>` : ''}
                </td>
              </tr>
            </table>

            <!-- Admin message -->
            <p style="margin:0 0 8px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:.5px;">Mensaje del técnico</p>
            <div style="padding:16px 20px;background:#f0f0f0;border-radius:8px;margin-bottom:24px;font-size:14px;color:#333;line-height:1.6;">
              ${adminMessage}
            </div>

            <p style="margin:0 0 24px;color:#444;font-size:14px;">
              Si tienes dudas o quieres responder, contáctanos por WhatsApp o responde a este correo.
            </p>

            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#000;border-radius:8px;padding:12px 24px;">
                  <a href="https://wa.me/34644411252?text=Hola%2C+soy+${encodeURIComponent(customerName)}+y+tengo+el+ticket+${ticketCode}"
                     style="color:#fff;text-decoration:none;font-size:15px;font-weight:600;">
                    Responder por WhatsApp
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #f0f0f0;">
            <p style="margin:0;color:#999;font-size:12px;">
              soporte@applegranada.com · +34 644 411 252 · Granada<br>
              © ${new Date().getFullYear()} AppleGranada. Todos los derechos reservados.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
