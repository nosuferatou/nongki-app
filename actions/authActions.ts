"use server";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_AUTH_COOKIE,
  ADMIN_AUTH_SIGNATURE_COOKIE,
  createAdminSessionSignature,
  getAdminPassword,
} from "@/lib/adminAuth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const submittedPassword = formData.get("password");
  const adminPassword = getAdminPassword();

  if (!adminPassword || !createAdminSessionSignature()) {
    console.error(
      "Admin login requires ADMIN_PASSWORD and ADMIN_SESSION_SECRET in production.",
    );
    return { error: "Admin login is not configured. Contact the administrator." };
  }

  if (typeof submittedPassword !== "string") {
    return { error: "Enter the admin password." };
  }

  const submitted = Buffer.from(submittedPassword);
  const expected = Buffer.from(adminPassword);
  const isPasswordValid =
    submitted.length === expected.length &&
    timingSafeEqual(submitted, expected);

  if (!isPasswordValid) {
    return { error: "Incorrect password. Please try again." };
  }

  const signature = createAdminSessionSignature();
  if (!signature) {
    return { error: "Admin login is not configured. Contact the administrator." };
  }

  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };

  cookieStore.set(ADMIN_AUTH_COOKIE, "true", cookieOptions);
  cookieStore.set(ADMIN_AUTH_SIGNATURE_COOKIE, signature, cookieOptions);

  redirect("/");
}
