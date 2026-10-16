import "server-only";

import { prisma } from "@/lib/prisma";

import { verifyPassword } from "../infrastructure/password-hasher";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
}

export async function authenticateUser(
  email: unknown,
  password: unknown,
): Promise<AuthenticatedUser | null> {
  if (typeof email !== "string" || typeof password !== "string") {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedEmail.length === 0 ||
    normalizedEmail.length > 254 ||
    !normalizedEmail.includes("@") ||
    Buffer.byteLength(password, "utf8") > 512
  ) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive || !user.passwordHash) {
    return null;
  }

  const passwordValid = await verifyPassword(
    password,
    user.passwordHash,
  );

  if (!passwordValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
