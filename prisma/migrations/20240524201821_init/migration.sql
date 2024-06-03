-- CreateTable
CREATE TABLE "Licor" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "estiloGraduacion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "stock_critico" INTEGER NOT NULL,
    "id_proveedor" TEXT NOT NULL,

    CONSTRAINT "Licor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consumo" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "id_licor" TEXT NOT NULL,

    CONSTRAINT "Consumo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Licor" ADD CONSTRAINT "Licor_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumo" ADD CONSTRAINT "Consumo_id_licor_fkey" FOREIGN KEY ("id_licor") REFERENCES "Licor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
