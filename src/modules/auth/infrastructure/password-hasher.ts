import "server-only";

import argon2 from "argon2";

import { validatePassword } from "../domain/password-policy";

export const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
} as const;

export async function hashPassword(password: string): Promise<string> {
  validatePassword(password);

  return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  if (typeof password !== "string" || typeof passwordHash !== "string") {
    return false;
  }

  if (Buffer.byteLength(password, "utf8") > 512) {
    return false;
  }

  if (!passwordHash.startsWith("$argon2id$")) {
    return false;
  }

  try {
    return await argon2.verify(passwordHash, password);
  } catch {
    return false;
  }
}
