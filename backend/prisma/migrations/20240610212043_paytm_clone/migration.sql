/*
  Warnings:

  - You are about to drop the column `bankId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - Made the column `sender` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `receiver` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_receiver_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_sender_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "bankId",
DROP COLUMN "userId",
ALTER COLUMN "sender" SET NOT NULL,
ALTER COLUMN "receiver" SET NOT NULL;

-- CreateTable
CREATE TABLE "BankTransaction" (
    "id" SERIAL NOT NULL,
    "sender" INTEGER NOT NULL,
    "receiver" INTEGER NOT NULL,
    "amountTransfered" INTEGER NOT NULL,

    CONSTRAINT "BankTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sender_fkey" FOREIGN KEY ("sender") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransaction" ADD CONSTRAINT "BankTransaction_sender_fkey" FOREIGN KEY ("sender") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
