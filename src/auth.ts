import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },

      async authorize() {
        // Реализуем на следующем этапе.
        // Пока вход для всех пользователей запрещён.
        return null;
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  trustHost: true,
});
