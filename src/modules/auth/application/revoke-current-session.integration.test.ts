import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";

import { revokeCurrentSession } from "./revoke-current-session";

const userId = randomUUID();
const email = `revoke-test-${userId}@example.test`;

function assertTestDatabase(): void {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }

  const url = new URL(connectionString);

  if (
    !["localhost", "127.0.0.1"].includes(url.hostname) ||
    url.port !== "5433" ||
    url.pathname !== "/sodrujestvo_test"
  ) {
    throw new Error("Unsafe integration test database");
  }
}

describe("SOD-002: revoke current session", () => {
  beforeAll(async () => {
    assertTestDatabase();

    const result = await prisma.$queryRaw<
      Array<{ database_name: string }>
    >`SELECT current_database() AS database_name`;

    expect(result[0]?.database_name).toBe("sodrujestvo_test");

    await prisma.user.create({
      data: {
        id: userId,
        email,
        isActive: true,
      },
    });
  });

  afterAll(async () => {
    assertTestDatabase();

    try {
      await prisma.user.deleteMany({
        where: { id: userId },
      });
    } finally {
      await prisma.$disconnect();
    }
  });

  it("revokes only the selected session", async () => {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const first = await prisma.authSession.create({
      data: {
        userId,
        expiresAt,
      },
    });

    const second = await prisma.authSession.create({
      data: {
        userId,
        expiresAt,
      },
    });

    await revokeCurrentSession({
      userId,
      authSessionId: first.id,
    });

    const sessions = await prisma.authSession.findMany({
      where: {
        id: {
          in: [first.id, second.id],
        },
      },
    });

    const revokedSession = sessions.find(
      (session) => session.id === first.id,
    );

    const activeSession = sessions.find(
      (session) => session.id === second.id,
    );

    expect(revokedSession?.revokedAt).not.toBeNull();
    expect(activeSession?.revokedAt).toBeNull();
  });

  it("rejects repeated revocation", async () => {
    const session = await prisma.authSession.create({
      data: {
        userId,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    await revokeCurrentSession({
      userId,
      authSessionId: session.id,
    });

    await expect(
      revokeCurrentSession({
        userId,
        authSessionId: session.id,
      }),
    ).rejects.toThrow("Не удалось завершить серверную сессию");
  });

  it("rejects invalid session identity", async () => {
    await expect(
      revokeCurrentSession({
        userId: "",
        authSessionId: "",
      }),
    ).rejects.toThrow("Некорректная сессия");
  });

  it("does not revoke another user's session", async () => {
    const otherUserId = randomUUID();

    const session = await prisma.authSession.create({
      data: {
        userId,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    await expect(
      revokeCurrentSession({
        userId: otherUserId,
        authSessionId: session.id,
      }),
    ).rejects.toThrow("Не удалось завершить серверную сессию");

    const unchanged = await prisma.authSession.findUnique({
      where: { id: session.id },
    });

    expect(unchanged?.revokedAt).toBeNull();
  });
});