/* eslint-disable */
// @ts-nocheck
/**
 * Notification service for sending emails and SMS
 */

import { NotificationType, NotificationChannel } from '@prisma/client';

export interface NotificationPayload {
  customerId: string;
  type: NotificationType;
  channel: NotificationChannel;
  subject?: string;
  message: string;
  ticketId?: string;
  invoiceId?: string;
  paymentId?: string;
  recipientEmail?: string;
  recipientPhone?: string;
}

/**
 * Email service configuration
 */
export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

/**
 * SMS service configuration
 */
export interface SMSConfig {
  apiKey: string;
  apiSecret: string;
  from: string; // Sender ID
}

/**
 * Email templates for different notification types
 */
export const EMAIL_TEMPLATES: Record<NotificationType, {
  subject: string;
  template: (data: any) => string;
}> = {
  TICKET_CREATED: {
    subject: '✓ Tu ticket de soporte ha sido creado',
    template: (data) => `
      <h2>¡Hola ${data.customerName}!</h2>
      <p>Tu ticket de soporte ha sido creado exitosamente.</p>
      <p><strong>Código de ticket:</strong> ${data.ticketCode}</p>
      <p><strong>Asunto:</strong> ${data.ticketTitle}</p>
      <p>Puedes hacer seguimiento del estado en tu panel de cliente.</p>
      <p>Nos pondremos en contacto pronto.</p>
    `,
  },
  TICKET_UPDATED: {
    subject: 'Tu ticket ha sido actualizado',
    template: (data) => `
      <h2>Actualización de tu ticket</h2>
      <p>Hola ${data.customerName},</p>
      <p>Tu ticket <strong>${data.ticketCode}</strong> ha sido actualizado.</p>
      <p><strong>Nuevo estado:</strong> ${data.newStatus}</p>
      <p>Haz clic en el enlace para ver los detalles: ${data.dashboardLink}</p>
    `,
  },
  TICKET_RESPONSE: {
    subject: 'Nueva respuesta en tu ticket',
    template: (data) => `
      <h2>Respuesta a tu ticket</h2>
      <p>Hola ${data.customerName},</p>
      <p>Hemos respondido a tu ticket <strong>${data.ticketCode}</strong>.</p>
      <p><strong>Respuesta:</strong></p>
      <p>${data.responseMessage}</p>
      <p>Accede a tu panel para ver la respuesta completa: ${data.dashboardLink}</p>
    `,
  },
  TICKET_RESOLVED: {
    subject: '✓ Tu ticket ha sido resuelto',
    template: (data) => `
      <h2>Ticket Resuelto</h2>
      <p>¡Hola ${data.customerName}!</p>
      <p>Tu ticket <strong>${data.ticketCode}</strong> ha sido marcado como resuelto.</p>
      <p>Si tienes más problemas o dudas, no dudes en contactarnos.</p>
    `,
  },
  TICKET_CLOSED: {
    subject: 'Ticket cerrado',
    template: (data) => `
      <h2>Ticket Cerrado</h2>
      <p>Tu ticket <strong>${data.ticketCode}</strong> ha sido cerrado.</p>
      <p>Gracias por usar AppleGranada.</p>
    `,
  },
  PLAN_ASSIGNED: {
    subject: '¡Tu plan ha sido asignado!',
    template: (data) => `
      <h2>Plan Asignado</h2>
      <p>¡Hola ${data.customerName}!</p>
      <p>Tu nuevo plan <strong>${data.planName}</strong> ha sido asignado.</p>
      <p>Accede a tu panel para ver todos los detalles y características.</p>
    `,
  },
  PLAN_CHANGED: {
    subject: 'Tu plan ha cambiado',
    template: (data) => `
      <h2>Cambio de Plan</h2>
      <p>Tu plan ha sido actualizado de <strong>${data.oldPlan}</strong> a <strong>${data.newPlan}</strong>.</p>
      <p>Los cambios entrarán en vigor en tu próxima renovación.</p>
    `,
  },
  INVOICE_CREATED: {
    subject: 'Nueva factura disponible',
    template: (data) => `
      <h2>Factura Creada</h2>
      <p>¡Hola ${data.customerName}!</p>
      <p>Tu factura <strong>${data.invoiceNumber}</strong> ha sido generada.</p>
      <p><strong>Monto:</strong> €${data.amount}</p>
      <p><strong>Vencimiento:</strong> ${data.dueDate}</p>
      <p>Descárgala desde tu panel de cliente.</p>
    `,
  },
  INVOICE_DUE_SOON: {
    subject: 'Recordatorio: Tu factura vence pronto',
    template: (data) => `
      <h2>Recordatorio de Pago</h2>
      <p>¡Hola ${data.customerName}!</p>
      <p>Tu factura <strong>${data.invoiceNumber}</strong> vence el <strong>${data.dueDate}</strong>.</p>
      <p><strong>Monto pendiente:</strong> €${data.amount}</p>
      <p>Realiza el pago en tu panel de cliente.</p>
    `,
  },
  INVOICE_OVERDUE: {
    subject: '⚠ Factura vencida',
    template: (data) => `
      <h2>Factura Vencida</h2>
      <p>Tu factura <strong>${data.invoiceNumber}</strong> ha vencido.</p>
      <p><strong>Monto pendiente:</strong> €${data.amount}</p>
      <p>Por favor, realiza el pago lo antes posible para evitar interrupciones en tu servicio.</p>
    `,
  },
  PAYMENT_RECEIVED: {
    subject: '✓ Pago recibido',
    template: (data) => `
      <h2>Pago Confirmado</h2>
      <p>¡Hola ${data.customerName}!</p>
      <p>Hemos recibido tu pago de €${data.amount}.</p>
      <p><strong>Referencia:</strong> ${data.paymentReference}</p>
      <p>Gracias por tu confianza en AppleGranada.</p>
    `,
  },
  PAYMENT_FAILED: {
    subject: '⚠ Error en el pago',
    template: (data) => `
      <h2>Error en el Pago</h2>
      <p>¡Hola ${data.customerName}!</p>
      <p>Hubo un problema al procesar tu pago.</p>
      <p><strong>Motivo:</strong> ${data.failureReason}</p>
      <p>Por favor, intenta de nuevo o contacta con nosotros.</p>
    `,
  },
  SUPPORT_SCHEDULED: {
    subject: 'Soporte presencial programado',
    template: (data) => `
      <h2>Cita de Soporte Confirmada</h2>
      <p>¡Hola ${data.customerName}!</p>
      <p>Tu cita de soporte ha sido programada.</p>
      <p><strong>Fecha:</strong> ${data.scheduledDate}</p>
      <p><strong>Hora:</strong> ${data.scheduledTime}</p>
      <p><strong>Ubicación:</strong> ${data.location}</p>
      <p>Nos vemos pronto.</p>
    `,
  },
  SUPPORT_REMINDER: {
    subject: 'Recordatorio: Tu cita de soporte es mañana',
    template: (data) => `
      <h2>Recordatorio de Cita</h2>
      <p>¡Hola ${data.customerName}!</p>
      <p>Tu cita de soporte es mañana a las ${data.scheduledTime}.</p>
      <p><strong>Ubicación:</strong> ${data.location}</p>
      <p>Asegúrate de tener tu equipo listo.</p>
    `,
  },
  WELCOME: {
    subject: '¡Bienvenido a AppleGranada!',
    template: (data) => `
      <h2>Bienvenido</h2>
      <p>¡Hola ${data.customerName}!</p>
      <p>Gracias por registrarte en AppleGranada.</p>
      <p>Tu cuenta está lista para usar. Accede a tu panel para comenzar.</p>
      <p>Si tienes dudas, no dudes en contactarnos.</p>
    `,
  },
  PROMOTIONAL: {
    subject: data => data.subject,
    template: (data) => data.htmlContent,
  },
};

/**
 * SMS templates for different notification types
 */
export const SMS_TEMPLATES: Record<NotificationType, (data: any) => string> = {
  TICKET_CREATED: (data) =>
    `AppleGranada: Tu ticket ${data.ticketCode} ha sido creado. Seguimiento: ${data.trackingLink}`,
  TICKET_UPDATED: (data) =>
    `AppleGranada: Tu ticket ${data.ticketCode} ha sido actualizado. Estado: ${data.newStatus}`,
  TICKET_RESPONSE: (data) =>
    `AppleGranada: Nueva respuesta en tu ticket ${data.ticketCode}. Ver: ${data.dashboardLink}`,
  TICKET_RESOLVED: (data) =>
    `AppleGranada: ✓ Tu ticket ${data.ticketCode} ha sido resuelto.`,
  TICKET_CLOSED: (data) =>
    `AppleGranada: Tu ticket ${data.ticketCode} ha sido cerrado.`,
  PLAN_ASSIGNED: (data) =>
    `AppleGranada: ¡Nuevo plan asignado! ${data.planName}. Detalles: ${data.dashboardLink}`,
  PLAN_CHANGED: (data) =>
    `AppleGranada: Tu plan ha cambiado de ${data.oldPlan} a ${data.newPlan}.`,
  INVOICE_CREATED: (data) =>
    `AppleGranada: Factura ${data.invoiceNumber} por €${data.amount}. Vence: ${data.dueDate}`,
  INVOICE_DUE_SOON: (data) =>
    `AppleGranada: ⏰ Tu factura ${data.invoiceNumber} vence el ${data.dueDate}.`,
  INVOICE_OVERDUE: (data) =>
    `AppleGranada: ⚠ Factura ${data.invoiceNumber} vencida. Pago pendiente: €${data.amount}`,
  PAYMENT_RECEIVED: (data) =>
    `AppleGranada: ✓ Pago de €${data.amount} recibido. Ref: ${data.paymentReference}`,
  PAYMENT_FAILED: (data) =>
    `AppleGranada: ⚠ Error en pago. Razón: ${data.failureReason}. Intenta de nuevo.`,
  SUPPORT_SCHEDULED: (data) =>
    `AppleGranada: Cita confirmada ${data.scheduledDate} a las ${data.scheduledTime} en ${data.location}`,
  SUPPORT_REMINDER: (data) =>
    `AppleGranada: ⏰ Tu cita es mañana a las ${data.scheduledTime}. ${data.location}`,
  WELCOME: (data) =>
    `AppleGranada: ¡Bienvenido ${data.customerName}! Tu cuenta está lista. ${data.dashboardLink}`,
  PROMOTIONAL: (data) =>
    data.smsContent,
};
