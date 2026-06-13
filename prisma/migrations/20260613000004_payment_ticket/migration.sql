ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "ticketId" TEXT;
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "bizumReference" TEXT;
ALTER TABLE "payments" ADD CONSTRAINT "payments_ticketId_fkey"
  FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
