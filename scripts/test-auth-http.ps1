$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

$previousDatabaseUrl = $env:DATABASE_URL
$previousTestInstance = $env:NEXT_TEST_INSTANCE
$previousAuthUrl = $env:AUTH_URL

$server = $null

try {
    . "$PSScriptRoot\use-test-database.ps1"

    $db = [uri]$env:DATABASE_URL

    if (
        $db.Host -notin @("localhost", "127.0.0.1") -or
        $db.Port -ne 5433 -or
        $db.AbsolutePath -ne "/sodrujestvo_test"
    ) {
        throw "Небезопасная конфигурация тестовой базы"
    }

    $env:NEXT_TEST_INSTANCE = "1"
    $env:AUTH_URL = "http://127.0.0.1:3001"

    $listener = Get-NetTCPConnection `
        -LocalPort 3001 `
        -State Listen `
        -ErrorAction SilentlyContinue

    if ($listener) {
        throw "Порт 3001 занят. Тестовый сервер не запущен."
    }

    Write-Host "Запуск тестового Next.js..." -ForegroundColor Cyan

    $node = (Get-Command node.exe -ErrorAction Stop).Source

    $nextCli = Join-Path `
        $ProjectRoot `
        "node_modules\next\dist\bin\next"

    if (-not (Test-Path $nextCli)) {
        throw "Next.js CLI не найден"
    }

    $server = Start-Process `
        -FilePath $node `
        -ArgumentList @(
            $nextCli,
            "dev",
            "--hostname",
            "127.0.0.1",
            "--port",
            "3001"
        ) `
        -WorkingDirectory $ProjectRoot `
        -PassThru `
        -NoNewWindow

    Write-Host "Ожидание готовности Next.js..."

    $ready = $false

    for ($i = 0; $i -lt 60; $i++) {

        if ($server.HasExited) {
            throw "Next.js завершился до готовности"
        }

        try {
            $response = Invoke-WebRequest `
                -Uri "http://127.0.0.1:3001/api/auth/session" `
                -TimeoutSec 2

            if ($response.StatusCode -eq 200) {
                $ready = $true
                break
            }
        }
        catch {
            Start-Sleep -Seconds 1
        }
    }

    if (-not $ready) {
        throw "Next.js не запустился за 60 секунд"
    }

    Write-Host "PASS: Next.js готов" -ForegroundColor Green

    node "tests/http/auth-http.test.mjs"

    if ($LASTEXITCODE -ne 0) {
        throw "HTTP-тест завершился с ошибкой"
    }

    Write-Host ""
    Write-Host "=== SOD-002: HTTP Authentication Lifecycle ===" -ForegroundColor Cyan

    $lifecycleTest = "src/modules/auth/http/auth-http.integration.test.ts"

    if (-not (Test-Path $lifecycleTest)) {
        throw "Файл интеграционного теста не найден: $lifecycleTest"
    }

    npx.cmd vitest run `
        --config vitest.integration.config.mts `
        $lifecycleTest

    if ($LASTEXITCODE -ne 0) {
        throw "HTTP lifecycle integration test failed"
    }

    Write-Host "PASS: HTTP Authentication Lifecycle" -ForegroundColor Green
    Write-Host "PASS: HTTP Auth Tests" -ForegroundColor Green
}
finally {
    if ($server) {
        Write-Host "Остановка тестового сервера..."

        # Завершаем только процесс, запущенный данным скриптом.
        if (-not $server.HasExited) {
            Stop-Process `
                -Id $server.Id `
                -Force `
                -ErrorAction SilentlyContinue
        }
    }

    $env:DATABASE_URL = $previousDatabaseUrl
    $env:NEXT_TEST_INSTANCE = $previousTestInstance
    $env:AUTH_URL = $previousAuthUrl
}
