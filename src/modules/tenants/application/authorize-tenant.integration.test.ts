
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";

import {
  authorizeTenant,
  TenantAccessDeniedError,
} from "./authorize-tenant";

const suffix = crypto.randomUUID();

const tenantAId = crypto.randomUUID();
const tenantBId = crypto.randomUUID();

const userAId = crypto.randomUUID();
const userBId = crypto.randomUUID();

describe("Tenant authorization integration", () => {
  beforeAll(async () => {
    const url = process.env.DATABASE_URL;

    if (!url) {
      throw new Error("DATABASE_URL is required");
    }

    const parsed = new URL(url);

    if (
      !["localhost", "127.0.0.1"].includes(parsed.hostname) ||
      parsed.port !== "5433" ||
      parsed.pathname !== "/sodrujestvo_test"
    ) {
      throw new Error("Unsafe integration test database");
    }

    await prisma.tenant.createMany({
      data: [
        {
          id: tenantAId,
          name: "Test Kennel A",
          slug: `test-a-${suffix}`,
        },
        {
          id: tenantBId,
          name: "Test Kennel B",
          slug: `test-b-${suffix}`,
        },
      ],
    });

    await prisma.user.createMany({
      data: [
        {
          id: userAId,
          email: `test-a-${suffix}@example.test`,
        },
        {
          id: userBId,
          email: `test-b-${suffix}@example.test`,
        },
      ],
    });

    await prisma.tenantMembership.createMany({
      data: [
        {
          tenantId: tenantAId,
          userId: userAId,
          role: "OWNER",
          status: "ACTIVE",
        },
        {
          tenantId: tenantBId,
          userId: userBId,
          role: "OWNER",
          status: "ACTIVE",
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.tenantMembership.deleteMany({
      where: {
        tenantId: {
          in: [tenantAId, tenantBId],
        },
      },
    });

    await prisma.tenant.deleteMany({
      where: {
        id: {
          in: [tenantAId, tenantBId],
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: {
          in: [userAId, userBId],
        },
      },
    });

    await prisma.$disconnect();
  });

  it("allows owner A to access tenant A", async () => {
    const result = await authorizeTenant(
      userAId,
      tenantAId,
      "tenant:read",
    );

    expect(result.tenantId).toBe(tenantAId);
    expect(result.role).toBe("OWNER");
  });

  it("allows owner B to access tenant B", async () => {
    const result = await authorizeTenant(
      userBId,
      tenantBId,
      "tenant:read",
    );

    expect(result.tenantId).toBe(tenantBId);
  });

  it("denies owner A access to tenant B", async () => {
    await expect(
      authorizeTenant(userAId, tenantBId, "tenant:read"),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);
  });

  it("denies owner B access to tenant A", async () => {
    await expect(
      authorizeTenant(userBId, tenantAId, "tenant:read"),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);
  });

  it("denies suspended membership", async () => {
    await prisma.tenantMembership.update({
      where: {
        tenantId_userId: {
          tenantId: tenantAId,
          userId: userAId,
        },
      },
      data: {
        status: "SUSPENDED",
      },
    });

    await expect(
      authorizeTenant(userAId, tenantAId, "tenant:read"),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);

    await prisma.tenantMembership.update({
      where: {
        tenantId_userId: {
          tenantId: tenantAId,
          userId: userAId,
        },
      },
      data: {
        status: "ACTIVE",
      },
    });
  });

  it("denies suspended tenant", async () => {
    await prisma.tenant.update({
      where: { id: tenantAId },
      data: { status: "SUSPENDED" },
    });

    await expect(
      authorizeTenant(userAId, tenantAId, "tenant:read"),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);

    await prisma.tenant.update({
      where: { id: tenantAId },
      data: { status: "ACTIVE" },
    });
  });

  it("denies inactive user", async () => {
    await prisma.user.update({
      where: { id: userAId },
      data: { isActive: false },
    });

    await expect(
      authorizeTenant(userAId, tenantAId, "tenant:read"),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);

    await prisma.user.update({
      where: { id: userAId },
      data: { isActive: true },
    });
  });
});