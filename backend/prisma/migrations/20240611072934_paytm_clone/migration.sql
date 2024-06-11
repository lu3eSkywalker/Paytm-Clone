-- DropForeignKey
ALTER TABLE "BankTransaction" DROP CONSTRAINT "BankTransaction_receiver_fkey";

-- AlterTable
ALTER TABLE "BankTransaction" ADD COLUMN     "BankIdReceiver" INTEGER,
ALTER COLUMN "receiver" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BankTransaction" ADD CONSTRAINT "BankTransaction_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
