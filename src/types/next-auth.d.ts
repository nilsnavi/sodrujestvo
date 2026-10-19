import "next-auth";

declare module "next-auth" {
  interface User {
    authSessionId?: string;
  }

  interface Session {
    authSessionId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    authSessionId?: string;
  }
}
