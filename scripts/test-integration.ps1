$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot

Push-Location $ProjectRoot

try {
    # Activate isolated test database configuration.
    . "$PSScriptRoot\use-test-database.ps1"

    $DatabaseUri = [System.Uri]::new($env:DATABASE_URL)

    # Safety guard: integration tests must never target production.
    if (
        $DatabaseUri.Host -notin @("localhost", "127.0.0.1") -or
        $DatabaseUri.Port -ne 5433 -or
        $DatabaseUri.AbsolutePath -ne "/sodrujestvo_test"
    ) {
        throw "ОШИБКА: интеграционные тесты разрешены только для sodrujestvo_test"
    }

    Write-Host "Проверка PostgreSQL..." -ForegroundColor Cyan

    & docker compose ps --status running postgres

    if ($LASTEXITCODE -ne 0) {
        throw "Не удалось проверить PostgreSQL через Docker Compose"
    }

    $ContainerId = (& docker compose ps -q postgres)

    if ($LASTEXITCODE -ne 0 -or -not $ContainerId) {
        throw "Контейнер PostgreSQL не запущен. Выполните docker compose up -d postgres"
    }

    $ContainerId = ($ContainerId | Select-Object -First 1).Trim()

    Write-Host "Ожидание готовности PostgreSQL..." -ForegroundColor Cyan

    $Ready = $false

    for ($Attempt = 1; $Attempt -le 30; $Attempt++) {
        & docker exec $ContainerId `
            pg_isready -U sodrujestvo -d sodrujestvo *> $null

        if ($LASTEXITCODE -eq 0) {
            $Ready = $true
            break
        }

        Start-Sleep -Seconds 2
    }

    if (-not $Ready) {
        throw "PostgreSQL не готов к подключениям"
    }

    Write-Host "Проверка тестовой базы данных..." -ForegroundColor Cyan

    # Check whether the isolated database already exists.
    $DatabaseExists = & docker exec $ContainerId `
        psql -U sodrujestvo -d sodrujestvo `
        -tAc "SELECT 1 FROM pg_database WHERE datname = 'sodrujestvo_test'"

    if ($LASTEXITCODE -ne 0) {
        throw "Не удалось проверить существование тестовой базы"
    }

    if ("$DatabaseExists".Trim() -ne "1") {
        Write-Host "Создание базы sodrujestvo_test..." -ForegroundColor Yellow

        & docker exec $ContainerId `
            createdb -U sodrujestvo -O sodrujestvo sodrujestvo_test

        if ($LASTEXITCODE -ne 0) {
            throw "Не удалось создать тестовую базу данных"
        }
    }
    else {
        Write-Host "Тестовая база уже существует" -ForegroundColor Green
    }

    Write-Host "Применение миграций Prisma..." -ForegroundColor Cyan

    & npx.cmd --no-install prisma migrate deploy

    if ($LASTEXITCODE -ne 0) {
        throw "Не удалось применить миграции Prisma"
    }

    Write-Host "Запуск интеграционных тестов..." -ForegroundColor Cyan

    & npx.cmd --no-install vitest run --config vitest.integration.config.mts

    if ($LASTEXITCODE -ne 0) {
        throw "Интеграционные тесты завершились с ошибкой"
    }

    Write-Host "Интеграционные тесты успешно завершены" -ForegroundColor Green
}
finally {
    Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
    Pop-Location
}