import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("../infrastructure/password-hasher", () => ({
  verifyPassword: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "../infrastructure/password-hasher";
import { authenticateUser } from "./authenticate-user";

const findUniqueMock = vi.mocked(prisma.user.findUnique);
const verifyPasswordMock = vi.mocked(verifyPassword);

const activeUser = {
  id: "11111111-1111-4111-8111-111111111111",
  email: "user@example.com",
  name: "Test User",
  passwordHash: "$argon2id$test",
  isActive: true,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

describe("authenticateUser", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("authenticates an active user with a valid password", async () => {
    findUniqueMock.mockResolvedValue(activeUser);
    verifyPasswordMock.mockResolvedValue(true);

    const result = await authenticateUser(
      "USER@EXAMPLE.COM",
      "StrongPassword2026!",
    );

    expect(result).toEqual({
      id: activeUser.id,
      email: activeUser.email,
      name: activeUser.name,
    });

    expect(findUniqueMock).toHaveBeenCalledWith({
      where: {
        email: "user@example.com",
      },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        isActive: true,
      },
    });

    expect(result).not.toHaveProperty("passwordHash");
  });

  it("rejects an unknown user", async () => {
    findUniqueMock.mockResolvedValue(null);

    const result = await authenticateUser(
      "unknown@example.com",
      "StrongPassword2026!",
    );

    expect(result).toBeNull();
    expect(verifyPasswordMock).not.toHaveBeenCalled();
  });

  it("rejects an inactive user", async () => {
    findUniqueMock.mockResolvedValue({
      ...activeUser,
      isActive: false,
    });

    const result = await authenticateUser(
      "user@example.com",
      "StrongPassword2026!",
    );

    expect(result).toBeNull();
    expect(verifyPasswordMock).not.toHaveBeenCalled();
  });

  it("rejects an incorrect password", async () => {
    findUniqueMock.mockResolvedValue(activeUser);
    verifyPasswordMock.mockResolvedValue(false);

    const result = await authenticateUser(
      "user@example.com",
      "WrongPassword2026!",
    );

    expect(result).toBeNull();
  });

  it("rejects users without a password hash", async () => {
    findUniqueMock.mockResolvedValue({
      ...activeUser,
      passwordHash: null,
    });

    const result = await authenticateUser(
      "user@example.com",
      "StrongPassword2026!",
    );

    expect(result).toBeNull();
    expect(verifyPasswordMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    const result = await authenticateUser(
      "invalid-email",
      "StrongPassword2026!",
    );

    expect(result).toBeNull();
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it("rejects a non-string password", async () => {
    const result = await authenticateUser(
      "user@example.com",
      null,
    );

    expect(result).toBeNull();
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it("rejects oversized passwords", async () => {
    const result = await authenticateUser(
      "user@example.com",
      "a".repeat(513),
    );

    expect(result).toBeNull();
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it("normalizes email before lookup", async () => {
    findUniqueMock.mockResolvedValue(activeUser);
    verifyPasswordMock.mockResolvedValue(true);

    await authenticateUser(
      "  USER@EXAMPLE.COM  ",
      "StrongPassword2026!",
    );

    expect(findUniqueMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          email: "user@example.com",
        },
      }),
    );
  });

  it("propagates database errors", async () => {
    findUniqueMock.mockRejectedValue(
      new Error("Database unavailable"),
    );

    await expect(
      authenticateUser(
        "user@example.com",
        "StrongPassword2026!",
      ),
    ).rejects.toThrow("Database unavailable");
  });
});

