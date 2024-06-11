-- DropForeignKey
ALTER TABLE "BankTransaction" DROP CONSTRAINT "BankTransaction_sender_fkey";

-- AddForeignKey
ALTER TABLE "BankTransaction" ADD CONSTRAINT "BankTransaction_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
