import { describe, expect, it } from "vitest";

import {
  InvalidPasswordError,
  validatePassword,
} from "./password-policy";

describe("Password policy", () => {
  it("accepts a valid password", () => {
    expect(() => validatePassword("CorrectHorseBatteryStaple")).not.toThrow();
  });

  it("accepts a password with 12 characters", () => {
    expect(() => validatePassword("123456789012")).not.toThrow();
  });

  it("rejects a short password", () => {
    expect(() => validatePassword("short")).toThrow(InvalidPasswordError);
  });

  it("rejects an empty password", () => {
    expect(() => validatePassword("")).toThrow(InvalidPasswordError);
  });

  it("rejects a password longer than 128 characters", () => {
    expect(() => validatePassword("a".repeat(129))).toThrow(
      InvalidPasswordError,
    );
  });

  it("rejects non-string input", () => {
    expect(() => validatePassword(null)).toThrow(InvalidPasswordError);
  });

  it("accepts Unicode passwords", () => {
    expect(() => validatePassword("ПарольДляПроверки2026")).not.toThrow();
  });
});
