/* eslint-disable */
// @ts-nocheck
/**
 * Notification triggers and rules
 * Defines what notifications should be sent automatically for different events
 */

import { NotificationService } from './notification-service';
import { NotificationType, NotificationChannel } from '@prisma/client';

export class NotificationTriggers {
  /**
   * Trigger notification when a ticket is created
   */
  static async onTicketCreated(
    customerId: string,
    ticketData: {
      ticketCode: string;
      title: string;
      dashboardLink: string;
    },
    channel: NotificationChannel = NotificationChannel.BOTH
  ) {
    return NotificationService.sendNotification({
      customerId,
      type: NotificationType.TICKET_CREATED,
      channel,
      subject: `✓ Tu ticket ${ticketData.ticketCode} ha sido creado`,
      message: `Tu ticket de soporte ha sido creado. Código: ${ticketData.ticketCode}`,
      ticketCode: ticketData.ticketCode,
      ticketTitle: ticketData.title,
      trackingLink: ticketData.dashboardLink,
    });
  }

  /**
   * Trigger notification when a ticket gets a new response
   */
  static async onTicketResponse(
    customerId: string,
    ticketData: {
      ticketCode: string;
      responseMessage: string;
      dashboardLink: string;
    },
    channel: NotificationChannel = NotificationChannel.BOTH
  ) {
    return NotificationService.sendNotification({
      customerId,
      type: NotificationType.TICKET_RESPONSE,
      channel,
      subject: 'Tienes una nueva respuesta en tu ticket',
      message: ticketData.responseMessage,
      ticketCode: ticketData.ticketCode,
      responseMessage: ticketData.responseMessage,
      dashboardLink: ticketData.dashboardLink,
    });
  }

  /**
   * Trigger notification when a ticket is resolved
   */
  static async onTicketResolved(
    customerId: string,
    ticketData: {
      ticketCode: string;
      dashboardLink: string;
    },
    channel: NotificationChannel = NotificationChannel.BOTH
  ) {
    return NotificationService.sendNotification({
      customerId,
      type: NotificationType.TICKET_RESOLVED,
      channel,
      subject: `✓ Tu ticket ${ticketData.ticketCode} ha sido resuelto`,
      message: `Tu ticket ha sido resuelto satisfactoriamente.`,
      ticketCode: ticketData.ticketCode,
      dashboardLink: ticketData.dashboardLink,
    });
  }

  /**
   * Trigger notification when a plan is assigned
   */
  static async onPlanAssigned(
    customerId: string,
    planData: {
      planName: string;
      serviceMode: string;
      price: number;
      dashboardLink: string;
    },
    channel: NotificationChannel = NotificationChannel.BOTH
  ) {
    return NotificationService.sendNotification({
      customerId,
      type: NotificationType.PLAN_ASSIGNED,
      channel,
      subject: `¡Tu plan ${planData.planName} ha sido asignado!`,
      message: `Tu nuevo plan está activo. Modo: ${planData.serviceMode}. Precio: €${planData.price}`,
      planName: planData.planName,
      serviceMode: planData.serviceMode,
      price: planData.price,
      dashboardLink: planData.dashboardLink,
    });
  }

  /**
   * Trigger notification when an invoice is created
   */
  static async onInvoiceCreated(
    customerId: string,
    invoiceData: {
      invoiceNumber: string;
      amount: number;
      dueDate: string;
      dashboardLink: string;
    },
    channel: NotificationChannel = NotificationChannel.EMAIL // Default to email for invoices
  ) {
    return NotificationService.sendNotification({
      customerId,
      type: NotificationType.INVOICE_CREATED,
      channel,
      subject: `Factura disponible: ${invoiceData.invoiceNumber}`,
      message: `Tu factura por €${invoiceData.amount} está disponible. Vence: ${invoiceData.dueDate}`,
      invoiceNumber: invoiceData.invoiceNumber,
      amount: invoiceData.amount,
      dueDate: invoiceData.dueDate,
      dashboardLink: invoiceData.dashboardLink,
    });
  }

  /**
   * Trigger notification when an invoice is due soon (3 days before)
   */
  static async onInvoiceDueSoon(
    customerId: string,
    invoiceData: {
      invoiceNumber: string;
      amount: number;
      dueDate: string;
      dashboardLink: string;
    },
    channel: NotificationChannel = NotificationChannel.BOTH
  ) {
    return NotificationService.sendNotification({
      customerId,
      type: NotificationType.INVOICE_DUE_SOON,
      channel,
      subject: `⏰ Tu factura ${invoiceData.invoiceNumber} vence pronto`,
      message: `Tu factura por €${invoiceData.amount} vence el ${invoiceData.dueDate}. Realiza el pago ahora.`,
      invoiceNumber: invoiceData.invoiceNumber,
      amount: invoiceData.amount,
      dueDate: invoiceData.dueDate,
      dashboardLink: invoiceData.dashboardLink,
    });
  }

  /**
   * Trigger notification when an invoice is overdue
   */
  static async onInvoiceOverdue(
    customerId: string,
    invoiceData: {
      invoiceNumber: string;
      amount: number;
      daysOverdue: number;
      dashboardLink: string;
    },
    channel: NotificationChannel = NotificationChannel.BOTH
  ) {
    return NotificationService.sendNotification({
      customerId,
      type: NotificationType.INVOICE_OVERDUE,
      channel,
      subject: `⚠ Factura ${invoiceData.invoiceNumber} vencida`,
      message: `Tu factura por €${invoiceData.amount} está vencida hace ${invoiceData.daysOverdue} días.`,
      invoiceNumber: invoiceData.invoiceNumber,
      amount: invoiceData.amount,
      daysOverdue: invoiceData.daysOverdue,
      dashboardLink: invoiceData.dashboardLink,
    });
  }

  /**
   * Trigger notification when a payment is received
   */
  static async onPaymentReceived(
    customerId: string,
    paymentData: {
      amount: number;
      paymentMethod: string;
      invoiceNumber?: string;
      dashboardLink: string;
    },
    channel: NotificationChannel = NotificationChannel.EMAIL
  ) {
    return NotificationService.sendNotification({
      customerId,
      type: NotificationType.PAYMENT_RECEIVED,
      channel,
      subject: `✓ Pago de €${paymentData.amount} recibido`,
      message: `Hemos recibido tu pago de €${paymentData.amount} por ${paymentData.paymentMethod}.`,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      invoiceNumber: paymentData.invoiceNumber,
      dashboardLink: paymentData.dashboardLink,
    });
  }

  /**
   * Trigger notification when a payment fails
   */
  static async onPaymentFailed(
    customerId: string,
    paymentData: {
      amount: number;
      paymentMethod: string;
      failureReason: string;
      retryLink: string;
    },
    channel: NotificationChannel = NotificationChannel.BOTH
  ) {
    return NotificationService.sendNotification({
      customerId,
      type: NotificationType.PAYMENT_FAILED,
      channel,
      subject: `⚠ Error al procesar tu pago`,
      message: `Tu pago de €${paymentData.amount} no se completó. Razón: ${paymentData.failureReason}`,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      failureReason: paymentData.failureReason,
      retryLink: paymentData.retryLink,
    });
  }

  /**
   * Trigger notification for on-site support scheduled
   */
  static async onSupportScheduled(
    customerId: string,
    supportData: {
      scheduledDate: string;
      scheduledTime: string;
      location: string;
      address: string;
    },
    channel: NotificationChannel = NotificationChannel.BOTH
  ) {
    return NotificationService.sendNotification({
      customerId,
      type: NotificationType.SUPPORT_SCHEDULED,
      channel,
      subject: `Cita de soporte confirmada`,
      message: `Tu cita de soporte ha sido programada para ${supportData.scheduledDate} a las ${supportData.scheduledTime}.`,
      scheduledDate: supportData.scheduledDate,
      scheduledTime: supportData.scheduledTime,
      location: supportData.location,
      address: supportData.address,
    });
  }

  /**
   * Trigger reminder notification 1 day before on-site support
   */
  static async onSupportReminder(
    customerId: string,
    supportData: {
      scheduledTime: string;
      location: string;
      address: string;
    },
    channel: NotificationChannel = NotificationChannel.SMS // SMS for quick reminder
  ) {
    return NotificationService.sendNotification({
      customerId,
      type: NotificationType.SUPPORT_REMINDER,
      channel,
      subject: `Recordatorio: Tu cita de soporte es mañana`,
      message: `Tu cita de soporte es mañana a las ${supportData.scheduledTime} en ${supportData.location}.`,
      scheduledTime: supportData.scheduledTime,
      location: supportData.location,
      address: supportData.address,
    });
  }

  /**
   * Trigger welcome notification for new customers
   */
  static async onCustomerWelcome(
    customerId: string,
    customerData: {
      customerName: string;
      dashboardLink: string;
    },
    channel: NotificationChannel = NotificationChannel.EMAIL
  ) {
    return NotificationService.sendNotification({
      customerId,
      type: NotificationType.WELCOME,
      channel,
      subject: `¡Bienvenido a Soporte Granada!`,
      message: `¡Hola ${customerData.customerName}! Gracias por registrarte en Soporte Granada.`,
      customerName: customerData.customerName,
      dashboardLink: customerData.dashboardLink,
    });
  }
}
