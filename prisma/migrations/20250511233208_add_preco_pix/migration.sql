/*
  Warnings:

  - Added the required column `precoPix` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "marca" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "precoPix" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "tamanhos" TEXT[];

-- Atualizar precoPix para 90% do preço atual
UPDATE "Produto" SET "precoPix" = "preco" * 0.9;
