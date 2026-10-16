import "server-only";

import type { TenantRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

import {
  hasTenantPermission,
  type TenantPermission,
} from "../domain/tenant-permissions";

export class TenantAccessDeniedError extends Error {
  constructor() {
    super("Tenant access denied");
    this.name = "TenantAccessDeniedError";
  }
}

export interface AuthorizedTenantContext {
  tenantId: string;
  userId: string;
  role: TenantRole;
}

export async function authorizeTenant(
  userId: string,
  tenantId: string,
  permission: TenantPermission,
): Promise<AuthorizedTenantContext> {
  if (!userId || !tenantId) {
    throw new TenantAccessDeniedError();
  }

  const membership = await prisma.tenantMembership.findUnique({
    where: {
      tenantId_userId: {
        tenantId,
        userId,
      },
    },
    select: {
      role: true,
      status: true,
      tenant: {
        select: {
          status: true,
        },
      },
      user: {
        select: {
          isActive: true,
        },
      },
    },
  });

  if (
    !membership ||
    membership.status !== "ACTIVE" ||
    membership.tenant.status !== "ACTIVE" ||
    !membership.user.isActive ||
    !hasTenantPermission(membership.role, permission)
  ) {
    throw new TenantAccessDeniedError();
  }

  return {
    tenantId,
    userId,
    role: membership.role,
  };
}