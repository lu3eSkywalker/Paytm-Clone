-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sender_fkey" FOREIGN KEY ("sender") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
