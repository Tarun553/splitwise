import { PrismaClient } from '@prisma/client'

// Prisma singleton pattern
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // In development, create a global variable to avoid connection issues
  globalThis.prisma = globalThis.prisma || new PrismaClient()
  prisma = globalThis.prisma
}

export default prisma
