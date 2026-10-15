# SOD-000 — Foundation

## Scope
Initial production engineering baseline for the existing Next.js website.
This change does not implement multi-tenancy, CRM, AI, Telegram, or MAX.

## Checks
- npm ci
- npm run lint
- npx tsc --noEmit
- npm run build
- docker build -t sodrujestvo:local .

## Deployment
Use a VPS with Docker/Coolify. Set the container HTTP port to 3000 and terminate TLS at the reverse proxy.
Point hotosho.ru DNS to the VPS only after staging verification.
Do not expose PostgreSQL, Redis, or internal administration ports publicly.

## Acceptance
- All CI jobs pass on the pull request.
- Container starts and responds on port 3000.
- Homepage and mobile navigation are manually checked.
- Rollback to the previous image is documented and tested before production release.

## Deferred
- Health endpoint and runtime health check.
- Multi-tenant data model and database migrations.
- Integration and E2E tests.
- Deployment secrets, backup and recovery drills.
- Canonical domain metadata migration and privacy policy.
