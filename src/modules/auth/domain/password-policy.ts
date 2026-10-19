export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_MAX_BYTES = 512;

export class InvalidPasswordError extends Error {
  constructor() {
    super("Password does not meet security requirements");
    this.name = "InvalidPasswordError";
  }
}

export function validatePassword(password: unknown): asserts password is string {
  if (typeof password !== "string") {
    throw new InvalidPasswordError();
  }

  const length = Array.from(password).length;
  const bytes = Buffer.byteLength(password, "utf8");

  if (
    length < PASSWORD_MIN_LENGTH ||
    length > PASSWORD_MAX_LENGTH ||
    bytes > PASSWORD_MAX_BYTES
  ) {
    throw new InvalidPasswordError();
  }
}
