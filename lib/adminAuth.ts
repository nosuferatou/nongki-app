import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_AUTH_COOKIE = "nongki_auth";
export const ADMIN_AUTH_SIGNATURE_COOKIE = "nongki_auth_sig";

export function getAdminPassword(): string | undefined {
  if (process.env.ADMIN_PASSWORD) {
    return process.env.ADMIN_PASSWORD;
  }

  return process.env.NODE_ENV === "development" ? "nongki123" : undefined;
}

function getSessionSecret(): string | undefined {
  if (process.env.ADMIN_SESSION_SECRET) {
    return process.env.ADMIN_SESSION_SECRET.length >= 32
      ? process.env.ADMIN_SESSION_SECRET
      : undefined;
  }

  return process.env.NODE_ENV === "development"
    ? getAdminPassword()
    : undefined;
}

export function createAdminSessionSignature(): string | undefined {
  const secret = getSessionSecret();
  if (!secret) {
    return undefined;
  }

  return createHmac("sha256", secret).update("true").digest("hex");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_AUTH_COOKIE)?.value !== "true") {
    return false;
  }

  const expectedSignature = createAdminSessionSignature();
  const suppliedSignature = cookieStore.get(
    ADMIN_AUTH_SIGNATURE_COOKIE,
  )?.value;

  if (!expectedSignature || !suppliedSignature) {
    return false;
  }

  const expected = Buffer.from(expectedSignature, "hex");
  const supplied = Buffer.from(suppliedSignature, "hex");

  return (
    expected.length === supplied.length &&
    timingSafeEqual(expected, supplied)
  );
}
