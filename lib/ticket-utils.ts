/**
 * Utility functions for generating ticket codes and other identifiers
 */

/**
 * Generates a random 6-character alphanumeric code for tickets
 * Format: 2 letters + 4 alphanumeric characters (e.g., "AB5K7Q")
 * This ensures a professional look and uniqueness
 */
export function generateTicketCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  // Generate 2 random letters
  let code = '';
  for (let i = 0; i < 2; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Generate 4 random alphanumeric characters
  for (let i = 0; i < 4; i++) {
    code += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
  }
  
  return code;
}

/**
 * Generates a sequential invoice number
 * Format: INV-YYYY-XXXXXX
 * @param sequenceNumber - The sequence number for this invoice
 */
export function generateInvoiceNumber(sequenceNumber: number): string {
  const year = new Date().getFullYear();
  const paddedNumber = String(sequenceNumber).padStart(6, '0');
  return `INV-${year}-${paddedNumber}`;
}

/**
 * Generates a sequential ticket number
 * Format: TKT-YYYY-XXXXXX
 * @param sequenceNumber - The sequence number for this ticket
 */
export function generateTicketNumber(sequenceNumber: number): string {
  const year = new Date().getFullYear();
  const paddedNumber = String(sequenceNumber).padStart(6, '0');
  return `TKT-${year}-${paddedNumber}`;
}

/**
 * Validates a ticket code format
 * @param code - The ticket code to validate
 */
export function isValidTicketCode(code: string): boolean {
  const pattern = /^[A-Z]{2}[A-Z0-9]{4}$/;
  return pattern.test(code);
}
