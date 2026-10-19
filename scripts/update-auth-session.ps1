$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

$Files = @(
    "src/modules/auth/infrastructure/current-auth-token.ts",
    "src/modules/auth/application/logout.ts",
    "src/modules/auth/application/get-authenticated-user.ts"
)

$BackupDir = Join-Path $env:TEMP ("sodrujestvo-auth-backup-" + (Get-Date -Format "yyyyMMdd-HHmmss"))

New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null

foreach ($File in $Files) {
    if (Test-Path $File) {
        $BackupName = $File.Replace("/", "__")
        Copy-Item $File (Join-Path $BackupDir $BackupName)
    }
}

Write-Host "Резервные копии: $BackupDir" -ForegroundColor Cyan

$TokenCode = @'
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
'@

$LogoutCode = @'
"use server";

import { signOut } from "@/auth";

import { getCurrentAuthToken } from "../infrastructure/current-auth-token";
import { revokeCurrentSession } from "./revoke-current-session";

export async function logout(): Promise<void> {
  const token = await getCurrentAuthToken();

  if (!token) {
    await signOut({ redirect: false });
    return;
  }

  await revokeCurrentSession({
    userId: token.userId,
    authSessionId: token.authSessionId,
  });

  await signOut({ redirect: false });
}
'@

$AuthenticatedUserCode = @'
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
'@

Set-Content `
    -Path "src/modules/auth/infrastructure/current-auth-token.ts" `
    -Value $TokenCode `
    -Encoding utf8

Set-Content `
    -Path "src/modules/auth/application/logout.ts" `
    -Value $LogoutCode `
    -Encoding utf8

Set-Content `
    -Path "src/modules/auth/application/get-authenticated-user.ts" `
    -Value $AuthenticatedUserCode `
    -Encoding utf8

Write-Host "Файлы обновлены" -ForegroundColor Green

Write-Host "Проверка TypeScript..." -ForegroundColor Cyan

& npx.cmd tsc --noEmit

if ($LASTEXITCODE -ne 0) {
    throw "TypeScript: FAIL"
}

Write-Host "Проверка ESLint..." -ForegroundColor Cyan

& npx.cmd eslint `
    "src/auth.ts" `
    "src/modules/auth/infrastructure/current-auth-token.ts" `
    "src/modules/auth/application/logout.ts" `
    "src/modules/auth/application/get-authenticated-user.ts"

if ($LASTEXITCODE -ne 0) {
    throw "ESLint: FAIL"
}

Write-Host "PASS: SOD-002.9.5 static checks" -ForegroundColor Green