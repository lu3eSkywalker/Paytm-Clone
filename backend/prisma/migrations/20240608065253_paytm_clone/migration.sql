/*
  Warnings:

  - You are about to drop the column `merchantId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `user1Id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `user2Id` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `amountTransfered` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reciever` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "merchantId",
DROP COLUMN "user1Id",
DROP COLUMN "user2Id",
ADD COLUMN     "amountTransfered" INTEGER NOT NULL,
ADD COLUMN     "reciever" INTEGER NOT NULL,
ADD COLUMN     "sender" INTEGER NOT NULL;
