import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { hashPassword, verifyPassword } from "./password-hasher";

describe("Password hasher", () => {
  it("creates an Argon2id hash", async () => {
    const hash = await hashPassword("StrongPassword2026!");

    expect(hash).toMatch(/^\$argon2id\$/);
    expect(hash).not.toContain("StrongPassword2026!");
  });

  it("verifies a correct password", async () => {
    const password = "StrongPassword2026!";
    const hash = await hashPassword(password);

    expect(await verifyPassword(password, hash)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("StrongPassword2026!");

    expect(await verifyPassword("IncorrectPassword", hash)).toBe(false);
  });

  it("rejects an invalid hash", async () => {
    expect(
      await verifyPassword("StrongPassword2026!", "invalid-hash"),
    ).toBe(false);
  });

  it("rejects an oversized password", async () => {
    const hash = await hashPassword("StrongPassword2026!");

    expect(await verifyPassword("a".repeat(513), hash)).toBe(false);
  });

  it("generates different hashes for identical passwords", async () => {
    const password = "StrongPassword2026!";

    const first = await hashPassword(password);
    const second = await hashPassword(password);

    expect(first).not.toBe(second);
  });
});
