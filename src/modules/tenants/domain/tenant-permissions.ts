import type { TenantRole } from "@/generated/prisma/enums";

export type TenantPermission =
  | "tenant:read"
  | "tenant:update"
  | "members:read"
  | "members:manage";

const rolePermissions: Record<TenantRole, readonly TenantPermission[]> = {
  OWNER: [
    "tenant:read",
    "tenant:update",
    "members:read",
    "members:manage",
  ],
  ADMIN: [
    "tenant:read",
    "tenant:update",
    "members:read",
    "members:manage",
  ],
  MANAGER: [
    "tenant:read",
    "tenant:update",
    "members:read",
  ],
  MEMBER: [
    "tenant:read",
  ],
};

export function hasTenantPermission(
  role: TenantRole,
  permission: TenantPermission,
): boolean {
  return rolePermissions[role].includes(permission);
}