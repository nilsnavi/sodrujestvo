"use server";

import { signOut } from "@/auth";

import { getCurrentAuthToken } from "../infrastructure/current-auth-token";
import { revokeCurrentSession } from "./revoke-current-session";

export async function logout(): Promise<void> {
  const token = await getCurrentAuthToken();

  if (!token) {
    throw new Error("Не удалось подтвердить серверную сессию для выхода");
  }

  await revokeCurrentSession({
    userId: token.userId,
    authSessionId: token.authSessionId,
  });

  await signOut({ redirect: false });
}
