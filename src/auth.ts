import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authenticateUser } from "@/modules/auth/application/authenticate-user";
import {
  createAuthSession,
  findValidAuthSession,
} from "@/modules/auth/infrastructure/auth-session-repository";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },

      async authorize(credentials) {
        const user = await authenticateUser(
          credentials?.email,
          credentials?.password,
        );

        if (!user) {
          return null;
        }

        const expiresAt = new Date(
          Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
        );

        const authSession = await createAuthSession(
          user.id,
          expiresAt,
        );

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          authSessionId: authSession.id,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.authSessionId = user.authSessionId;
      }

      if (
        typeof token.sub !== "string" ||
        typeof token.authSessionId !== "string"
      ) {
        return null;
      }

      const session = await findValidAuthSession(
        token.authSessionId,
      );

      if (!session || session.userId !== token.sub) {
        return null;
      }

      return token;
    },

    async session({ session, token }) {
      if (
        !session.user ||
        typeof token.sub !== "string"
      ) {
        return session;
      }

      session.user.id = token.sub;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  trustHost: true,
});
