/*
  Warnings:

  - You are about to drop the column `merchantId` on the `Wallet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_merchantId_fkey";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "merchantId";

-- CreateTable
CREATE TABLE "WalletMerchant" (
    "id" SERIAL NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 100000,

    CONSTRAINT "WalletMerchant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WalletMerchant" ADD CONSTRAINT "WalletMerchant_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
