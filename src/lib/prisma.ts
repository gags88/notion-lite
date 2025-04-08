import { PrismaClient } from '@prisma/client';

const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;

// Augment the NodeJS global type (in module scope)
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}
