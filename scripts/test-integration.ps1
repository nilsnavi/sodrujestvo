$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot

Push-Location $ProjectRoot

try {
    . "$PSScriptRoot\use-test-database.ps1"

    $DatabaseUri = [System.Uri]::new($env:DATABASE_URL)

    if (
        $DatabaseUri.Host -notin @("localhost", "127.0.0.1") -or
        $DatabaseUri.Port -ne 5433 -or
        $DatabaseUri.AbsolutePath -ne "/sodrujestvo_test"
    ) {
        throw "ОШИБКА: интеграционные тесты разрешены только для sodrujestvo_test"
    }

    Write-Host "Запуск интеграционных тестов..." -ForegroundColor Cyan

    & npx.cmd --no-install vitest run --config vitest.integration.config.mts

    if ($LASTEXITCODE -ne 0) {
        throw "Интеграционные тесты завершились с ошибкой"
    }
}
finally {
    Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
    Pop-Location
}