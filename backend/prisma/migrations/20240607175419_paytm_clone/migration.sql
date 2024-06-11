/*
  Warnings:

  - Added the required column `email` to the `Merchant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Merchant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Merchant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;
