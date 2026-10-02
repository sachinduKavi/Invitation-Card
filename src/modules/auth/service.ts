import { nanoid } from "nanoid";
import { prisma } from "@/lib/db/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getEmailService } from "@/lib/email/email-service";
import { verificationEmail, passwordResetEmail } from "@/lib/email/templates";
import { createDefaultWorkspaceForUser } from "@/modules/workspaces/service";
import type { RegisterInput } from "@/lib/validation/auth";

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

function appUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}${path}`;
}

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
  });

  await createDefaultWorkspaceForUser(user.id, input.name);
  await sendVerificationEmail(user.id, user.email);

  return user;
}

export async function sendVerificationEmail(userId: string, email: string) {
  const token = nanoid(48);
  await prisma.emailVerificationToken.create({
    data: {
      token,
      userId,
      expires: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
    },
  });

  const verifyUrl = appUrl(`/verify-email?token=${token}`);
  const email_ = verificationEmail(verifyUrl);
  await getEmailService().send({ to: email, ...email_ });
}

export async function verifyEmailToken(token: string): Promise<{ success: boolean }> {
  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date()) {
    return { success: false };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.deleteMany({ where: { userId: record.userId } }),
  ]);

  return { success: true };
}

export async function requestPasswordReset(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always behave the same whether or not the user exists, to avoid email enumeration.
  if (!user || !user.passwordHash) return;

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const token = nanoid(48);
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expires: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
    },
  });

  const resetUrl = appUrl(`/reset-password?token=${token}`);
  const email_ = passwordResetEmail(resetUrl);
  await getEmailService().send({ to: user.email, ...email_ });
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<{ success: boolean }> {
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date()) {
    return { success: false };
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } }),
  ]);

  return { success: true };
}

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  return user;
}
