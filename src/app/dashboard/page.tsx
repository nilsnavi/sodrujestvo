import { redirect } from "next/navigation";
import Link from "next/link";

import { getAuthenticatedUser } from "@/modules/auth/application/get-authenticated-user";
import LogoutButton from "@/modules/auth/ui/logout-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen px-5 py-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <Link href="/" className="text-sm uppercase tracking-[0.3em] text-white/50">
              Содружество Хотошо
            </Link>

            <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl uppercase text-white">
              Личный кабинет
            </h1>
          </div>

          <LogoutButton />
        </header>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">
            Добро пожаловать
          </h2>

          <p className="mt-4 text-white/60">
            {user.name ?? user.email ?? "Пользователь"}
          </p>

          <p className="mt-6 text-sm text-white/40">
            Управление питомниками и доступными функциями появится здесь
            после завершения следующих модулей.
          </p>
        </section>
      </div>
    </main>
  );
}