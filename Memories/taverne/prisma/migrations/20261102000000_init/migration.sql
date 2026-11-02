-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Aventurier" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "joueur" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "sexe" TEXT NOT NULL,
    "classe" TEXT NOT NULL,
    "apparence" TEXT,
    "representation" TEXT,
    "equipement" TEXT,
    "caractere" TEXT,
    "phraseCulte" TEXT,
    "histoire" TEXT,
    "limites" TEXT,
    "accordUsage" BOOLEAN NOT NULL DEFAULT false,
    "relecture" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Aventurier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aventurierId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "texte" TEXT NOT NULL,

    CONSTRAINT "Recit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Aventurier_token_key" ON "Aventurier"("token");

-- CreateIndex
CREATE INDEX "Recit_aventurierId_idx" ON "Recit"("aventurierId");

-- AddForeignKey
ALTER TABLE "Recit" ADD CONSTRAINT "Recit_aventurierId_fkey" FOREIGN KEY ("aventurierId") REFERENCES "Aventurier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

