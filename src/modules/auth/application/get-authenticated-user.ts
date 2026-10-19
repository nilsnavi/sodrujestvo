import "server-only";

import { auth } from "@/auth";

export interface CurrentAuthenticatedUser {
  id: string;
  email: string | null;
  name: string | null;
}

export async function getAuthenticatedUser(): Promise<CurrentAuthenticatedUser | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
  };
}
