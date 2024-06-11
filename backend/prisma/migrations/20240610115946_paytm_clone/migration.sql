/*
  Warnings:

  - A unique constraint covering the columns `[merchantId]` on the table `WalletMerchant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WalletMerchant_merchantId_key" ON "WalletMerchant"("merchantId");
