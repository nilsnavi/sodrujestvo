import "server-only";

import { revokeAuthSession } from "../infrastructure/auth-session-repository";

export interface SessionIdentity {
  userId: string;
  authSessionId: string;
}

export async function revokeCurrentSession(
  identity: SessionIdentity,
): Promise<void> {
  if (!identity.userId || !identity.authSessionId) {
    throw new Error("Некорректная сессия");
  }

  const revoked = await revokeAuthSession(
    identity.authSessionId,
    identity.userId,
  );

  if (!revoked) {
    throw new Error("Не удалось завершить серверную сессию");
  }
}