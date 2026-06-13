/**
 * Validation schemas using Zod
 */

import { z } from 'zod';

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  segment: z.enum(['STUDENT', 'HOME', 'PROFESSIONAL', 'BUSINESS']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Ticket schemas
export const CreateTicketSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(200, 'El título es demasiado largo'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(5000, 'La descripción es demasiado larga'),
  deviceType: z.enum(['MAC', 'IPAD', 'IPHONE', 'APPLE_TV', 'MULTIPLE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  serviceMode: z.enum(['REMOTE', 'ON_SITE']).default('REMOTE'),
  
  // For on-site support
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  
  // Scheduling
  scheduledDate: z.date().optional(),
});

export const UpdateTicketSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  notes: z.string().optional(),
});

export const CreateTicketResponseSchema = z.object({
  message: z.string().min(5, 'El mensaje debe tener al menos 5 caracteres').max(5000, 'El mensaje es demasiado largo'),
  attachments: z.array(z.string().url()).optional(),
  isFromAdmin: z.boolean().default(false),
});

// Plan schemas
const BasePlanSchema = z.object({
  nameEs: z.string().min(3, 'El nombre es requerido'),
  nameEn: z.string().min(3, 'El nombre es requerido'),
  descriptionEs: z.string().min(10),
  descriptionEn: z.string().min(10),
  priceRemote: z.number().positive().optional(),
  priceOnSite: z.number().positive().optional(),
  billingCycle: z.enum(['MONTHLY', 'QUARTERLY', 'ANNUAL']).default('MONTHLY'),
  segment: z.enum(['STUDENT', 'HOME', 'PROFESSIONAL', 'BUSINESS']),
  features: z.array(z.string()),
  supportRemote: z.boolean().default(true),
  supportOnSite: z.boolean().default(true),
});

export const CreatePlanSchema = BasePlanSchema.refine((data) => data.priceRemote || data.priceOnSite, {
  message: 'Al menos un precio debe estar definido',
});

export const UpdatePlanSchema = BasePlanSchema.partial();

// Invoice schemas
export const CreateInvoiceSchema = z.object({
  customerId: z.string(),
  subscriptionId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().default('EUR'),
  itemDescription: z.string(),
  dueDate: z.date(),
});

export const UpdateInvoiceSchema = z.object({
  status: z.enum(['DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
  paidDate: z.date().optional(),
});

// Payment schemas
export const CreatePaymentSchema = z.object({
  customerId: z.string(),
  invoiceId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().default('EUR'),
  paymentMethod: z.enum(['STRIPE', 'PAYPAL', 'BANK_TRANSFER']),
  description: z.string().optional(),
});

// Customer schemas
export const UpdateCustomerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  company: z.string().optional(),
  segment: z.enum(['STUDENT', 'HOME', 'PROFESSIONAL', 'BUSINESS']).optional(),
});

// Subscription schemas
export const CreateSubscriptionSchema = z.object({
  customerId: z.string(),
  planId: z.string(),
  serviceMode: z.enum(['REMOTE', 'ON_SITE']).default('REMOTE'),
});

export const UpdateSubscriptionSchema = z.object({
  planId: z.string().optional(),
  serviceMode: z.enum(['REMOTE', 'ON_SITE']).optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED']).optional(),
});

// Notification schemas
export const NotificationPreferencesSchema = z.object({
  ticketNotifications: z.enum(['EMAIL', 'SMS', 'BOTH']).default('BOTH'),
  invoiceNotifications: z.enum(['EMAIL', 'SMS', 'BOTH']).default('EMAIL'),
  paymentNotifications: z.enum(['EMAIL', 'SMS', 'BOTH']).default('BOTH'),
  supportReminders: z.enum(['EMAIL', 'SMS', 'BOTH']).default('SMS'),
  promotionalEmails: z.boolean().default(false),
});

// Export types
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;
export type UpdateTicketInput = z.infer<typeof UpdateTicketSchema>;
export type CreateTicketResponseInput = z.infer<typeof CreateTicketResponseSchema>;
export type CreatePlanInput = z.infer<typeof CreatePlanSchema>;
export type UpdatePlanInput = z.infer<typeof UpdatePlanSchema>;
export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof UpdateInvoiceSchema>;
export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>;
export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof UpdateSubscriptionSchema>;
export type NotificationPreferencesInput = z.infer<typeof NotificationPreferencesSchema>;
