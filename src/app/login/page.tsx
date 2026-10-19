import Link from "next/link";
import { redirect } from "next/navigation";

import { getAuthenticatedUser } from "@/modules/auth/application/get-authenticated-user";
import LoginForm from "@/modules/auth/ui/login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getAuthenticatedUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-20">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="text-sm uppercase tracking-[0.3em] text-white/50">
            Содружество Хотошо
          </Link>

          <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl uppercase text-white">
            Личный кабинет
          </h1>

          <p className="mt-4 text-sm text-white/50">
            Войдите, чтобы продолжить работу
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <LoginForm />
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-white/50 transition hover:text-white">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </main>
  );
}