// Mock Prisma client for development
// This allows the frontend to run while we use the Go backend + MCP server for data operations

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

interface MockUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  hasParentalConsent?: boolean;
  dateOfBirth?: Date;
}

interface MockAccount {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
}

interface MockSession {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

// Mock Prisma client that returns empty results for now
export const prismaMock = {
  user: {
    findUnique: async ({ where }: { where: any }) => null as MockUser | null,
    findFirst: async ({ where }: { where: any }) => null as MockUser | null,
    create: async ({ data }: { data: any }) => ({
      id: 'mock-user-id',
      email: data.email,
      name: data.name,
      role: data.role || 'student',
      hasParentalConsent: data.hasParentalConsent || false,
      dateOfBirth: data.dateOfBirth,
    } as MockUser),
    update: async ({ where, data }: { where: any; data: any }) => ({
      id: where.id || 'mock-user-id',
      email: data.email || 'mock@example.com',
      name: data.name,
      role: data.role || 'student',
      hasParentalConsent: data.hasParentalConsent || false,
      dateOfBirth: data.dateOfBirth,
    } as MockUser),
  },
  account: {
    findFirst: async ({ where }: { where: any }) => null as MockAccount | null,
    create: async ({ data }: { data: any }) => ({
      id: 'mock-account-id',
      userId: data.userId,
      type: data.type,
      provider: data.provider,
      providerAccountId: data.providerAccountId,
    } as MockAccount),
  },
  session: {
    findUnique: async ({ where }: { where: any }) => null as MockSession | null,
    create: async ({ data }: { data: any }) => ({
      id: 'mock-session-id',
      sessionToken: data.sessionToken,
      userId: data.userId,
      expires: data.expires,
    } as MockSession),
    update: async ({ where, data }: { where: any; data: any }) => ({
      id: where.sessionToken || 'mock-session-id',
      sessionToken: where.sessionToken || 'mock-token',
      userId: data.userId || 'mock-user-id',
      expires: data.expires || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    } as MockSession),
    delete: async ({ where }: { where: any }) => ({
      id: 'mock-session-id',
      sessionToken: where.sessionToken,
      userId: 'mock-user-id',
      expires: new Date(),
    } as MockSession),
  },
  verificationToken: {
    findUnique: async ({ where }: { where: any }) => null,
    create: async ({ data }: { data: any }) => data,
    delete: async ({ where }: { where: any }) => null,
  },
};

// For compatibility with existing code
export default prismaMock; 