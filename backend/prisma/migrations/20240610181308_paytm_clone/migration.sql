-- CreateTable
CREATE TABLE "MerchantTransaction" (
    "id" SERIAL NOT NULL,
    "sender" INTEGER NOT NULL,
    "receiver" INTEGER NOT NULL,
    "amountTransfered" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MerchantTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MerchantTransaction" ADD CONSTRAINT "MerchantTransaction_sender_fkey" FOREIGN KEY ("sender") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantTransaction" ADD CONSTRAINT "MerchantTransaction_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
