$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$EnvFile = Join-Path $ProjectRoot ".env"

if (-not (Test-Path $EnvFile)) {
    throw "Файл .env не найден"
}

$DatabaseUrlLine = Get-Content $EnvFile |
    Where-Object { $_ -match '^\s*DATABASE_URL\s*=' } |
    Select-Object -First 1

if (-not $DatabaseUrlLine) {
    throw "DATABASE_URL отсутствует в .env"
}

$DatabaseUrl = ($DatabaseUrlLine -split '=', 2)[1].Trim().Trim('"', "'")

$Uri = [System.UriBuilder]::new($DatabaseUrl)

if ($Uri.Host -notin @("localhost", "127.0.0.1")) {
    throw "Разрешена только локальная тестовая база"
}

if ($Uri.Port -ne 5433) {
    throw "Неожиданный порт PostgreSQL: $($Uri.Port)"
}

$Uri.Path = "/sodrujestvo_test"

$env:DATABASE_URL = $Uri.Uri.AbsoluteUri

Write-Host "Тестовая база активирована: sodrujestvo_test" -ForegroundColor Green
Write-Host "Подключение: localhost:5433"