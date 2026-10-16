import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    authSession: {
      create: vi.fn(),
      findFirst: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

import {
  createAuthSession,
  findValidAuthSession,
  revokeAuthSession,
  revokeAllUserSessions,
} from "./auth-session-repository";

const createMock = vi.mocked(prisma.authSession.create);
const findFirstMock = vi.mocked(prisma.authSession.findFirst);
const updateManyMock = vi.mocked(prisma.authSession.updateMany);

const userId = "11111111-1111-4111-8111-111111111111";
const sessionId = "22222222-2222-4222-8222-222222222222";

const validSession = {
  id: sessionId,
  userId,
  expiresAt: new Date("2099-01-01T00:00:00.000Z"),
};

describe("Auth Session Repository", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("creates a session with a future expiration date", async () => {
    createMock.mockResolvedValue({
      ...validSession,
      revokedAt: null,
      createdAt: new Date(),
    });

    const result = await createAuthSession(
      userId,
      validSession.expiresAt,
    );

    expect(result).toMatchObject(validSession);

    expect(createMock).toHaveBeenCalledWith({
      data: {
        userId,
        expiresAt: validSession.expiresAt,
      },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
      },
    });
  });

  it("rejects an expired session during creation", async () => {
    await expect(
      createAuthSession(
        userId,
        new Date("2020-01-01T00:00:00.000Z"),
      ),
    ).rejects.toThrow("Invalid auth session parameters");

    expect(createMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid expiration date", async () => {
    await expect(
      createAuthSession(userId, new Date("invalid")),
    ).rejects.toThrow("Invalid auth session parameters");
  });

  it("rejects an empty user ID", async () => {
    await expect(
      createAuthSession("", validSession.expiresAt),
    ).rejects.toThrow("Invalid auth session parameters");
  });

  it("finds only active, non-revoked sessions", async () => {
    findFirstMock.mockResolvedValue({
      ...validSession,
      revokedAt: null,
      createdAt: new Date(),
    });

    const result = await findValidAuthSession(sessionId);

    expect(result).toMatchObject(validSession);

    expect(findFirstMock).toHaveBeenCalledWith({
      where: {
        id: sessionId,
        revokedAt: null,
        expiresAt: {
          gt: expect.any(Date),
        },
        user: {
          isActive: true,
        },
      },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
      },
    });
  });

  it("returns null when session is not found", async () => {
    findFirstMock.mockResolvedValue(null);

    const result = await findValidAuthSession(sessionId);

    expect(result).toBeNull();
  });

  it("does not query database for an empty session ID", async () => {
    const result = await findValidAuthSession("");

    expect(result).toBeNull();
    expect(findFirstMock).not.toHaveBeenCalled();
  });

  it("revokes an active session", async () => {
    updateManyMock.mockResolvedValue({ count: 1 });

    const result = await revokeAuthSession(sessionId, userId);

    expect(result).toBe(true);

    expect(updateManyMock).toHaveBeenCalledWith({
      where: {
        id: sessionId,
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: expect.any(Date),
      },
    });
  });

  it("safely handles an already revoked session", async () => {
    updateManyMock.mockResolvedValue({ count: 0 });

    const result = await revokeAuthSession(sessionId, userId);

    expect(result).toBe(false);
  });

  it("rejects revocation without user ID", async () => {
    const result = await revokeAuthSession(sessionId, "");

    expect(result).toBe(false);
    expect(updateManyMock).not.toHaveBeenCalled();
  });

  it("revokes all sessions belonging to a user", async () => {
    updateManyMock.mockResolvedValue({ count: 3 });

    const result = await revokeAllUserSessions(userId);

    expect(result).toBe(3);

    expect(updateManyMock).toHaveBeenCalledWith({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: expect.any(Date),
      },
    });
  });

  it("does not revoke sessions for an empty user ID", async () => {
    const result = await revokeAllUserSessions("");

    expect(result).toBe(0);
    expect(updateManyMock).not.toHaveBeenCalled();
  });

  it("propagates database errors when finding a session", async () => {
    findFirstMock.mockRejectedValue(
      new Error("Database unavailable"),
    );

    await expect(
      findValidAuthSession(sessionId),
    ).rejects.toThrow("Database unavailable");
  });

  it("propagates database errors during revocation", async () => {
    updateManyMock.mockRejectedValue(
      new Error("Database unavailable"),
    );

    await expect(
      revokeAuthSession(sessionId, userId),
    ).rejects.toThrow("Database unavailable");
  });
});
