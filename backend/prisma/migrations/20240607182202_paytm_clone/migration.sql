/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Merchant_email_key" ON "Merchant"("email");
