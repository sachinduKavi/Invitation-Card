"use server";

import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth";
import {
  registerUser,
  requestPasswordReset,
  resetPasswordWithToken,
} from "@/modules/auth/service";

export type ActionResult = { success: true } | { success: false; error: string };

export async function registerAction(input: unknown): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await registerUser(parsed.data);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function forgotPasswordAction(input: unknown): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await requestPasswordReset(parsed.data.email);
  return { success: true };
}

export async function resetPasswordAction(input: unknown): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const result = await resetPasswordWithToken(parsed.data.token, parsed.data.password);
  if (!result.success) {
    return { success: false, error: "This reset link is invalid or has expired." };
  }

  return { success: true };
}
