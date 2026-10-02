function layout(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="font-family: sans-serif; background: #f7f5f2; padding: 32px;">
    <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 32px;">
      <h1 style="font-size: 20px; margin-bottom: 16px;">${title}</h1>
      ${bodyHtml}
      <p style="color: #999; font-size: 12px; margin-top: 32px;">Invitations — Create Invitations That Feel Alive.</p>
    </div>
  </body>
</html>`;
}

export function verificationEmail(verifyUrl: string) {
  return {
    subject: "Verify your email address",
    html: layout(
      "Verify your email",
      `<p>Thanks for signing up. Please confirm your email address to activate your account.</p>
       <p><a href="${verifyUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">Verify email</a></p>
       <p>If the button doesn't work, copy this link:<br />${verifyUrl}</p>`
    ),
    text: `Verify your email: ${verifyUrl}`,
  };
}

export function passwordResetEmail(resetUrl: string) {
  return {
    subject: "Reset your password",
    html: layout(
      "Reset your password",
      `<p>We received a request to reset your password. This link expires in 1 hour.</p>
       <p><a href="${resetUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">Reset password</a></p>
       <p>If you didn't request this, you can safely ignore this email.</p>`
    ),
    text: `Reset your password: ${resetUrl}`,
  };
}
