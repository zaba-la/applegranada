/* eslint-disable */
// @ts-nocheck
/**
 * Notification Service
 * Handles sending emails and SMS notifications to customers
 */

import { prisma } from './prisma';
import { NotificationType, NotificationChannel, NotificationStatus } from '@prisma/client';
import { EMAIL_TEMPLATES, SMS_TEMPLATES, NotificationPayload } from './notification-templates';

export class NotificationService {
  /**
   * Send a notification (email, SMS, or both)
   */
  static async sendNotification(payload: NotificationPayload) {
    try {
      // Create notification record in database
      const notification = await prisma.notification.create({
        data: {
          customerId: payload.customerId,
          type: payload.type,
          channel: payload.channel,
          subject: payload.subject,
          message: payload.message,
          ticketId: payload.ticketId,
          invoiceId: payload.invoiceId,
          paymentId: payload.paymentId,
          status: NotificationStatus.PENDING,
        },
      });

      // Send based on channel
      if (payload.channel === NotificationChannel.EMAIL || payload.channel === NotificationChannel.BOTH) {
        await this.sendEmail(notification.id, payload);
      }

      if (payload.channel === NotificationChannel.SMS || payload.channel === NotificationChannel.BOTH) {
        await this.sendSMS(notification.id, payload);
      }

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Send email notification
   */
  private static async sendEmail(notificationId: string, payload: NotificationPayload) {
    try {
      const emailTemplate = EMAIL_TEMPLATES[payload.type];
      if (!emailTemplate) {
        throw new Error(`No email template for notification type: ${payload.type}`);
      }

      const subject = payload.subject || emailTemplate.subject;
      const htmlContent = emailTemplate.template(payload);

      // Get customer email
      const customer = await prisma.customer.findUnique({
        where: { id: payload.customerId },
        include: { user: true },
      });

      if (!customer?.user.email) {
        throw new Error('Customer email not found');
      }

      // TODO: Implement actual email sending via SMTP or service like SendGrid
      // For now, just log it
      console.log('📧 Email:', {
        to: customer.user.email,
        subject,
        htmlContent,
      });

      // Update notification status
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: NotificationStatus.SENT,
          sentAt: new Date(),
          emailMessageId: `email_${Date.now()}`,
        },
      });
    } catch (error) {
      console.error('Error sending email:', error);
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: NotificationStatus.FAILED,
          failureReason: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  /**
   * Send SMS notification
   */
  private static async sendSMS(notificationId: string, payload: NotificationPayload) {
    try {
      const smsTemplate = SMS_TEMPLATES[payload.type];
      if (!smsTemplate) {
        throw new Error(`No SMS template for notification type: ${payload.type}`);
      }

      const messageText = smsTemplate(payload);

      // Get customer phone
      const customer = await prisma.customer.findUnique({
        where: { id: payload.customerId },
      });

      if (!customer?.phone) {
        console.warn('Customer phone not found, skipping SMS');
        return;
      }

      // TODO: Implement actual SMS sending via service like Twilio or AWS SNS
      // For now, just log it
      console.log('📱 SMS:', {
        to: customer.phone,
        message: messageText,
      });

      // Update notification status
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: NotificationStatus.SENT,
          sentAt: new Date(),
          smsMessageId: `sms_${Date.now()}`,
        },
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: NotificationStatus.FAILED,
          failureReason: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  /**
   * Send bulk notifications
   */
  static async sendBulkNotifications(payloads: NotificationPayload[]) {
    const results = await Promise.allSettled(
      payloads.map((payload) => this.sendNotification(payload))
    );

    return results;
  }

  /**
   * Get notification history for a customer
   */
  static async getCustomerNotifications(customerId: string, limit: number = 20) {
    return prisma.notification.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
  }

  /**
   * Retry failed notifications
   */
  static async retryFailedNotifications() {
    const failedNotifications = await prisma.notification.findMany({
      where: {
        status: NotificationStatus.FAILED,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      include: {
        customer: true,
        ticket: true,
        invoice: true,
        payment: true,
      },
    });

    for (const notification of failedNotifications) {
      try {
        const payload: NotificationPayload = {
          customerId: notification.customerId,
          type: notification.type,
          channel: notification.channel,
          subject: notification.subject || undefined,
          message: notification.message,
          ticketId: notification.ticketId || undefined,
          invoiceId: notification.invoiceId || undefined,
          paymentId: notification.paymentId || undefined,
        };

        // Attempt to resend
        await this.sendNotification(payload);
      } catch (error) {
        console.error(`Failed to retry notification ${notification.id}:`, error);
      }
    }
  }
}
