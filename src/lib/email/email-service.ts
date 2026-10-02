export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailService {
  send(message: EmailMessage): Promise<void>;
}

class ConsoleEmailService implements EmailService {
  async send(message: EmailMessage): Promise<void> {
    console.log(
      `[email:console] to=${message.to} subject="${message.subject}"\n${
        message.text ?? message.html
      }`
    );
  }
}

class ResendEmailService implements EmailService {
  constructor(private readonly apiKey: string, private readonly from: string) {}

  async send(message: EmailMessage): Promise<void> {
    const { Resend } = await import("resend");
    const resend = new Resend(this.apiKey);
    await resend.emails.send({
      from: this.from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });
  }
}

let cachedService: EmailService | undefined;

export function getEmailService(): EmailService {
  if (cachedService) return cachedService;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Invitations <no-reply@example.com>";

  cachedService =
    apiKey && apiKey.length > 0
      ? new ResendEmailService(apiKey, from)
      : new ConsoleEmailService();

  return cachedService;
}
