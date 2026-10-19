import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "../infrastructure/password-hasher";

const BASE_URL = "http://127.0.0.1:3001";

const email = `logout-e2e-${crypto.randomUUID()}@example.test`;
const password = "TestPassword-2026-Strong!";

let userId: string | null = null;

function extractCookies(response: Response): string {
  return response.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ");
}

function getSessionCookie(response: Response): string {
  const cookie = response.headers
    .getSetCookie()
    .find((value) =>
      /(?:^|;) *(__Secure-)?authjs\.session-token=/.test(value),
    );

  if (!cookie) {
    throw new Error("Auth.js session cookie not found");
  }

  return cookie.split(";")[0];
}

afterAll(async () => {
  if (userId) {
    await prisma.user.delete({
      where: { id: userId },
    });
  }

  await prisma.$disconnect();
});

describe("SOD-002 Server Action Logout E2E", () => {
  it("login -> logout -> PostgreSQL revoke -> old JWT rejected", async () => {
    const user = await prisma.user.create({
      data: {
        email,
        name: "Logout E2E User",
        passwordHash: await hashPassword(password),
      },
    });

    userId = user.id;

    const csrfResponse = await fetch(`${BASE_URL}/api/auth/csrf`);
    expect(csrfResponse.status).toBe(200);

    const { csrfToken } = (await csrfResponse.json()) as {
      csrfToken: string;
    };

    const csrfCookies = extractCookies(csrfResponse);

    const loginResponse = await fetch(
      `${BASE_URL}/api/auth/callback/credentials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: csrfCookies,
        },
        body: new URLSearchParams({
          csrfToken,
          email,
          password,
          callbackUrl: BASE_URL,
        }),
        redirect: "manual",
      },
    );

    expect(loginResponse.status).toBe(302);

    const sessionCookie = getSessionCookie(loginResponse);

    const dbSession = await prisma.authSession.findFirst({
      where: {
        userId: user.id,
        revokedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    expect(dbSession).not.toBeNull();

    const beforeLogout = await fetch(`${BASE_URL}/api/auth/session`, {
      headers: { Cookie: sessionCookie },
    });

    const activeSession = (await beforeLogout.json()) as {
      user?: { id?: string };
    };

    expect(activeSession.user?.id).toBe(user.id);

    const pageResponse = await fetch(`${BASE_URL}/auth-test-e2e`, {
      headers: { Cookie: sessionCookie },
    });

    expect(pageResponse.status).toBe(200);

    const html = await pageResponse.text();

    const actionId = html.match(/\$ACTION_ID_([a-fA-F0-9]+)/)?.[0];

    expect(actionId).toBeDefined();

    const formData = new FormData();
    formData.append(actionId!, "");

    const logoutResponse = await fetch(`${BASE_URL}/auth-test-e2e`, {
      method: "POST",
      headers: {
        Cookie: sessionCookie,
        Origin: BASE_URL,
        Referer: `${BASE_URL}/auth-test-e2e`,
      },
      body: formData,
      redirect: "manual",
    });

    expect([200, 303]).toContain(logoutResponse.status);

    const revokedSession = await prisma.authSession.findUnique({
      where: { id: dbSession!.id },
    });

    expect(revokedSession?.revokedAt).not.toBeNull();

    const clearedCookie = logoutResponse.headers
      .getSetCookie()
      .some((value) =>
        /(?:__Secure-)?authjs\.session-token=/.test(value) &&
        /(?:Max-Age=0|Expires=Thu, 01 Jan 1970)/i.test(value),
      );

    expect(clearedCookie).toBe(true);

    const afterLogout = await fetch(`${BASE_URL}/api/auth/session`, {
      headers: { Cookie: sessionCookie },
    });

    expect(afterLogout.status).toBe(200);

    const invalidSession = await afterLogout.json();

    // Auth.js returns JSON null when the session is invalid.
    expect(invalidSession).toBeNull();
  });
});
