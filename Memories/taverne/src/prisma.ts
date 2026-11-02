import { PrismaClient } from "@prisma/client";

const globale = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globale.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globale.prisma = prisma;
