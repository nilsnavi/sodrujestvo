import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUniqueMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenantMembership: {
      findUnique: findUniqueMock,
    },
  },
}));

import {
  authorizeTenant,
  TenantAccessDeniedError,
} from "./authorize-tenant";

const USER_ID = "11111111-1111-4111-8111-111111111111";
const TENANT_ID = "22222222-2222-4222-8222-222222222222";

function activeMembership(
  overrides: Record<string, unknown> = {},
) {
  return {
    role: "OWNER",
    status: "ACTIVE",
    tenant: {
      status: "ACTIVE",
    },
    user: {
      isActive: true,
    },
    ...overrides,
  };
}

describe("Tenant authorization", () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
  });

  it("allows OWNER to access own tenant", async () => {
    findUniqueMock.mockResolvedValue(activeMembership());

    const result = await authorizeTenant(
      USER_ID,
      TENANT_ID,
      "tenant:read",
    );

    expect(result).toEqual({
      tenantId: TENANT_ID,
      userId: USER_ID,
      role: "OWNER",
    });

    expect(findUniqueMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tenantId_userId: {
            tenantId: TENANT_ID,
            userId: USER_ID,
          },
        },
      }),
    );
  });

  it("denies access when membership does not exist", async () => {
    findUniqueMock.mockResolvedValue(null);

    await expect(
      authorizeTenant(USER_ID, TENANT_ID, "tenant:read"),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);
  });

  it("denies suspended membership", async () => {
    findUniqueMock.mockResolvedValue(
      activeMembership({ status: "SUSPENDED" }),
    );

    await expect(
      authorizeTenant(USER_ID, TENANT_ID, "tenant:read"),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);
  });

  it("denies suspended tenant", async () => {
    findUniqueMock.mockResolvedValue(
      activeMembership({
        tenant: { status: "SUSPENDED" },
      }),
    );

    await expect(
      authorizeTenant(USER_ID, TENANT_ID, "tenant:read"),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);
  });

  it("denies archived tenant", async () => {
    findUniqueMock.mockResolvedValue(
      activeMembership({
        tenant: { status: "ARCHIVED" },
      }),
    );

    await expect(
      authorizeTenant(USER_ID, TENANT_ID, "tenant:read"),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);
  });

  it("denies inactive user", async () => {
    findUniqueMock.mockResolvedValue(
      activeMembership({
        user: { isActive: false },
      }),
    );

    await expect(
      authorizeTenant(USER_ID, TENANT_ID, "tenant:read"),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);
  });

  it("denies insufficient role", async () => {
    findUniqueMock.mockResolvedValue(
      activeMembership({ role: "MEMBER" }),
    );

    await expect(
      authorizeTenant(USER_ID, TENANT_ID, "members:manage"),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);
  });

  it("denies empty userId without database query", async () => {
    await expect(
      authorizeTenant("", TENANT_ID, "tenant:read"),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);

    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it("denies empty tenantId without database query", async () => {
    await expect(
      authorizeTenant(USER_ID, "", "tenant:read"),
    ).rejects.toBeInstanceOf(TenantAccessDeniedError);

    expect(findUniqueMock).not.toHaveBeenCalled();
  });
});