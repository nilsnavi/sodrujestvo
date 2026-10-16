import { describe, expect, it } from "vitest";

import { hasTenantPermission } from "./tenant-permissions";

describe("Tenant permissions", () => {
  it("allows OWNER to manage members", () => {
    expect(
      hasTenantPermission("OWNER", "members:manage"),
    ).toBe(true);
  });

  it("allows ADMIN to update tenant", () => {
    expect(
      hasTenantPermission("ADMIN", "tenant:update"),
    ).toBe(true);
  });

  it("prevents MANAGER from managing members", () => {
    expect(
      hasTenantPermission("MANAGER", "members:manage"),
    ).toBe(false);
  });

  it("allows MEMBER to read tenant", () => {
    expect(
      hasTenantPermission("MEMBER", "tenant:read"),
    ).toBe(true);
  });

  it("prevents MEMBER from updating tenant", () => {
    expect(
      hasTenantPermission("MEMBER", "tenant:update"),
    ).toBe(false);
  });

  it("prevents MEMBER from reading membership list", () => {
    expect(
      hasTenantPermission("MEMBER", "members:read"),
    ).toBe(false);
  });
});