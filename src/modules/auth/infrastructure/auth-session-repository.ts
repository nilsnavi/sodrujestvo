import "server-only";

import { prisma } from "@/lib/prisma";

export interface ValidAuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
}

export async function createAuthSession(
  userId: string,
  expiresAt: Date,
): Promise<ValidAuthSession> {
  if (
    !userId ||
    Number.isNaN(expiresAt.getTime()) ||
    expiresAt.getTime() <= Date.now()
  ) {
    throw new Error("Invalid auth session parameters");
  }

  const session = await prisma.authSession.create({
    data: {
      userId,
      expiresAt,
    },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
    },
  });

  return session;
}

export async function findValidAuthSession(
  sessionId: string,
): Promise<ValidAuthSession | null> {
  if (!sessionId) {
    return null;
  }

  return prisma.authSession.findFirst({
    where: {
      id: sessionId,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
      user: {
        isActive: true,
      },
    },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
    },
  });
}

export async function revokeAuthSession(
  sessionId: string,
  userId: string,
): Promise<boolean> {
  if (!sessionId || !userId) {
    return false;
  }

  const result = await prisma.authSession.updateMany({
    where: {
      id: sessionId,
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  return result.count === 1;
}

export async function revokeAllUserSessions(
  userId: string,
): Promise<number> {
  if (!userId) {
    return 0;
  }

  const result = await prisma.authSession.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  return result.count;
}
