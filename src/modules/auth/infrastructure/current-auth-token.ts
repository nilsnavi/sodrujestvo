import "server-only";

import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";

export interface CurrentAuthToken {
  userId: string;
  authSessionId: string;
}

export async function getCurrentAuthToken(): Promise<CurrentAuthToken | null> {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }

  const requestHeaders = await headers();

  const token = await getToken({
    req: {
      headers: {
        cookie: requestHeaders.get("cookie") ?? "",
      },
    },
    secret,
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (
    typeof token?.sub !== "string" ||
    typeof token.authSessionId !== "string"
  ) {
    return null;
  }

  return {
    userId: token.sub,
    authSessionId: token.authSessionId,
  };
}
