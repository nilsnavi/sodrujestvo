import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const BASE_URL = "http://127.0.0.1:3001";

function extractCookies(response) {
  return response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(";")[0])
    .join("; ");
}

async function main() {
  // 1. Получаем CSRF-токен и связанную cookie.
  const csrfResponse = await fetch(`${BASE_URL}/api/auth/csrf`);

  assert.equal(csrfResponse.status, 200);

  const { csrfToken } = await csrfResponse.json();
  assert.ok(csrfToken);

  const cookies = extractCookies(csrfResponse);
  assert.ok(cookies, "CSRF cookie is missing");

  console.log("PASS: CSRF token and cookie");

  // 2. Проверяем анонимную сессию.
  const anonymousResponse = await fetch(`${BASE_URL}/api/auth/session`, {
    headers: {
      Cookie: cookies,
    },
  });

  assert.equal(anonymousResponse.status, 200);
  assert.equal(await anonymousResponse.json(), null);

  console.log("PASS: anonymous session");

  // 3. Проверяем вход несуществующего пользователя.
  const email = `http-test-${randomUUID()}@example.test`;

  const loginResponse = await fetch(
    `${BASE_URL}/api/auth/callback/credentials`,
    {
      method: "POST",
      redirect: "manual",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookies,
      },
      body: new URLSearchParams({
        csrfToken,
        email,
        password: "SecureTestPassword2026!",
      }),
    },
  );

  console.log("Credentials HTTP status:", loginResponse.status);

  assert.ok(
    [302, 303].includes(loginResponse.status),
    "Expected redirect after rejected login",
  );

  const location = loginResponse.headers.get("location") ?? "";
  const redirect = new URL(location, BASE_URL);

  assert.ok(
    ["localhost", "127.0.0.1"].includes(redirect.hostname) &&
      redirect.port === "3001" &&
      redirect.protocol === "http:",
    "Unexpected redirect destination",
  );

  assert.ok(
    redirect.searchParams.has("error") ||
      redirect.pathname === "/login",
    "Expected authentication error or login redirect",
  );

  console.log("PASS: unknown user rejected");

  // 4. Убеждаемся, что сессия не появилась.
  const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
    headers: {
      Cookie: cookies,
    },
  });

  assert.equal(sessionResponse.status, 200);
  assert.equal(await sessionResponse.json(), null);

  console.log("PASS: no session after rejected login");

  // 5. Проверяем блокировку прямого Auth.js Logout.
  const signoutResponse = await fetch(
    `${BASE_URL}/api/auth/signout`,
    {
      method: "POST",
      redirect: "manual",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookies,
      },
      body: new URLSearchParams({
        csrfToken,
      }),
    },
  );

  assert.equal(
    signoutResponse.status,
    403,
    "Direct Auth.js signout must be blocked",
  );

  const signoutBody = await signoutResponse.json();

  assert.equal(
    signoutBody.error,
    "Используйте безопасный серверный выход",
  );

  console.log("PASS: direct Auth.js signout blocked");
}

main().catch((error) => {
  console.error("FAIL:", error);
  process.exitCode = 1;
});