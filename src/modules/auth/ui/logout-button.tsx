import { logout } from "@/modules/auth/application/logout";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-xl border border-white/20 px-5 py-3 text-sm text-white transition hover:bg-white/10"
      >
        Выйти
      </button>
    </form>
  );
}