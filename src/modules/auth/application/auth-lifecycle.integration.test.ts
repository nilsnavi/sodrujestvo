import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "../infrastructure/password-hasher";
import { authenticateUser } from "./authenticate-user";
import {
  createAuthSession,
  findValidAuthSession,
  revokeAuthSession,
  revokeAllUserSessions,
} from "../infrastructure/auth-session-repository";

const userId = crypto.randomUUID();
const email = `auth-test-${userId}@example.test`;
const password = "SecureTestPassword2026!";

function assertTestDatabase(): void {
  const value = process.env.DATABASE_URL;

  if (!value) {
    throw new Error("DATABASE_URL is required");
  }

  const url = new URL(value);

  if (
    !["localhost", "127.0.0.1"].includes(url.hostname) ||
    url.port !== "5433" ||
    url.pathname !== "/sodrujestvo_test"
  ) {
    throw new Error("Unsafe integration test database");
  }
}

describe("Auth session lifecycle integration", () => {
  beforeAll(async () => {
    assertTestDatabase();

    const result = await prisma.$queryRaw<
      Array<{ database_name: string }>
    >`SELECT current_database() AS database_name`;

    if (result[0]?.database_name !== "sodrujestvo_test") {
      throw new Error("Connected to an unexpected database");
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        id: userId,
        email,
        passwordHash,
        isActive: true,
      },
    });
  });

  afterAll(async () => {
    assertTestDatabase();

    await prisma.user.deleteMany({
      where: { id: userId },
    });

    await prisma.$disconnect();
  });

  it("authenticates a valid user", async () => {
    const user = await authenticateUser(email, password);

    expect(user).not.toBeNull();
    expect(user?.id).toBe(userId);
  });

  it("rejects an invalid password", async () => {
    const user = await authenticateUser(
      email,
      "IncorrectPassword2026!",
    );

    expect(user).toBeNull();
  });

  it("creates and validates an auth session", async () => {
    const expiresAt = new Date(Date.now() + 60_000);

    const session = await createAuthSession(
      userId,
      expiresAt,
    );

    const found = await findValidAuthSession(session.id);

    expect(found).not.toBeNull();
    expect(found?.userId).toBe(userId);
  });

  it("rejects a revoked auth session", async () => {
    const session = await createAuthSession(
      userId,
      new Date(Date.now() + 60_000),
    );

    const revoked = await revokeAuthSession(
      session.id,
      userId,
    );

    expect(revoked).toBe(true);

    const found = await findValidAuthSession(session.id);

    expect(found).toBeNull();
  });

  it("rejects an expired auth session", async () => {
    const session = await createAuthSession(
      userId,
      new Date(Date.now() + 60_000),
    );

    await prisma.authSession.update({
      where: { id: session.id },
      data: {
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    const found = await findValidAuthSession(session.id);

    expect(found).toBeNull();
  });

  it("rejects sessions of inactive users", async () => {
    const session = await createAuthSession(
      userId,
      new Date(Date.now() + 60_000),
    );

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    try {
      const found = await findValidAuthSession(session.id);

      expect(found).toBeNull();
    } finally {
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: true },
      });
    }
  });

  it("revokes all user sessions", async () => {
    const first = await createAuthSession(
      userId,
      new Date(Date.now() + 60_000),
    );

    const second = await createAuthSession(
      userId,
      new Date(Date.now() + 60_000),
    );

    const count = await revokeAllUserSessions(userId);

    expect(count).toBeGreaterThanOrEqual(2);

    expect(await findValidAuthSession(first.id)).toBeNull();
    expect(await findValidAuthSession(second.id)).toBeNull();
  });
});
