-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_receiver_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_sender_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "bankId" INTEGER,
ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "sender" DROP NOT NULL,
ALTER COLUMN "receiver" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sender_fkey" FOREIGN KEY ("sender") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
