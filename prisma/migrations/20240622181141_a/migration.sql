/*
  Warnings:

  - You are about to drop the column `estiloGraduacion` on the `Licor` table. All the data in the column will be lost.
  - Added the required column `estilo_graduacion` to the `Licor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Licor" DROP COLUMN "estiloGraduacion",
ADD COLUMN     "estilo_graduacion" TEXT NOT NULL;
