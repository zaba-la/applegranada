ALTER TABLE "users" ADD COLUMN "inviteToken" TEXT;
ALTER TABLE "users" ADD COLUMN "inviteTokenExpiry" TIMESTAMP(3);
CREATE UNIQUE INDEX "users_inviteToken_key" ON "users"("inviteToken");
