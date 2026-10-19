import type { NextRequest } from "next/server";

import { handlers } from "@/auth";

export const GET = handlers.GET;

export async function POST(request: NextRequest): Promise<Response> {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/api/auth/signout") {
    return Response.json(
      {
        error: "Используйте безопасный серверный выход",
      },
      {
        status: 403,
      },
    );
  }

  return handlers.POST(request);
}