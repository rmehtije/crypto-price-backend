-- CreateTable
CREATE TABLE "public"."coins" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."coin_pairs" (
    "id" SERIAL NOT NULL,
    "baseCoinId" INTEGER NOT NULL,
    "quoteCoinId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coin_pairs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."data_providers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "apiKeyEnvVar" TEXT NOT NULL,
    "apiKeyHeader" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coins_symbol_key" ON "public"."coins"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "coin_pairs_baseCoinId_quoteCoinId_key" ON "public"."coin_pairs"("baseCoinId", "quoteCoinId");

-- CreateIndex
CREATE UNIQUE INDEX "data_providers_name_key" ON "public"."data_providers"("name");

-- AddForeignKey
ALTER TABLE "public"."coin_pairs" ADD CONSTRAINT "coin_pairs_baseCoinId_fkey" FOREIGN KEY ("baseCoinId") REFERENCES "public"."coins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."coin_pairs" ADD CONSTRAINT "coin_pairs_quoteCoinId_fkey" FOREIGN KEY ("quoteCoinId") REFERENCES "public"."coins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
