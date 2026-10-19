import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "../infrastructure/password-hasher";
import { revokeAuthSession } from "../infrastructure/auth-session-repository";

const BASE_URL = "http://127.0.0.1:3001";

const userId = randomUUID();
const email = `auth-http-${userId}@example.test`;
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
    throw new Error("Unsafe HTTP integration test database");
  }
}

function getCookies(response: Response): string {
  return response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(";")[0])
    .join("; ");
}

describe("Auth.js HTTP lifecycle", () => {
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
        passwordHash: await hashPassword(password),
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

  it("login → JWT → PostgreSQL → revoke → access denied", async () => {
    const csrfResponse = await fetch(`${BASE_URL}/api/auth/csrf`);

    expect(csrfResponse.status).toBe(200);

    const { csrfToken } = await csrfResponse.json();

    expect(typeof csrfToken).toBe("string");

    const csrfCookies = getCookies(csrfResponse);

    expect(csrfCookies).toContain("csrf");

    const loginResponse = await fetch(
      `${BASE_URL}/api/auth/callback/credentials`,
      {
        method: "POST",
        redirect: "manual",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: csrfCookies,
        },
        body: new URLSearchParams({
          csrfToken,
          email,
          password,
        }),
      },
    );

    expect([302, 303]).toContain(loginResponse.status);

    const loginCookies = getCookies(loginResponse);

    expect(loginCookies).toMatch(/session-token/);

    const cookieHeader = `${csrfCookies}; ${loginCookies}`;

    const sessionResponse = await fetch(
      `${BASE_URL}/api/auth/session`,
      {
        headers: {
          Cookie: cookieHeader,
        },
      },
    );

    expect(sessionResponse.status).toBe(200);

    const session = await sessionResponse.json();

    expect(session?.user?.id).toBe(userId);

    expect(session).not.toHaveProperty("authSessionId");

    const authSession = await prisma.authSession.findFirst({
      where: {
        userId,
        revokedAt: null,
      },
    });

    expect(authSession).not.toBeNull();

    const revoked = await revokeAuthSession(
      authSession!.id,
      userId,
    );

    expect(revoked).toBe(true);

    const revokedSessionResponse = await fetch(
      `${BASE_URL}/api/auth/session`,
      {
        headers: {
          Cookie: cookieHeader,
        },
      },
    );

    expect(revokedSessionResponse.status).toBe(200);

    const revokedSession = await revokedSessionResponse.json();

    expect(revokedSession).toBeNull();
  });
});