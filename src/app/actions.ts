"use server";

import { Resend } from "resend";
import { unstable_rethrow } from "next/navigation";
import crypto from "crypto";
import { ContactFormEmail } from "./email-templates/contact-form-email";
import { contactSchema } from "@/lib/schemas/contact";

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null;
function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "office@foremost.ai";
const FROM_EMAIL = process.env.FROM_EMAIL || "hello@foremost.ai";

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

function isRetryableError(error: unknown): boolean {
  if (error && typeof error === "object" && "statusCode" in error) {
    const statusCode = (error as { statusCode: number }).statusCode;
    return statusCode >= 500 || statusCode === 429;
  }
  return false;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendWithRetry(
  emailClient: Resend,
  emailData: Parameters<Resend["emails"]["send"]>[0],
  idempotencyKey: string
): Promise<{ data: { id: string } | null; error: unknown | null }> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await emailClient.emails.send(emailData, {
        headers: { "Idempotency-Key": idempotencyKey },
      });
      return { data: result.data, error: result.error };
    } catch (error) {
      if (!isRetryableError(error) || attempt === MAX_RETRIES - 1) {
        return { data: null, error };
      }
      // Exponential backoff with jitter
      const delay = Math.min(INITIAL_DELAY_MS * Math.pow(2, attempt), 30000);
      await sleep(delay + Math.random() * 1000);
    }
  }
  return { data: null, error: new Error("Max retries exceeded") };
}

export type ContactFormState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    company?: string[];
    message?: string[];
  };
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    message: formData.get("message"),
  };

  const validatedFields = contactSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, company, message } = validatedFields.data;

  // Generate idempotency key
  const contentHash = crypto
    .createHash("sha256")
    .update(JSON.stringify({ name, email, message }))
    .digest("hex")
    .slice(0, 16);
  const hourWindow = Math.floor(Date.now() / (1000 * 60 * 60));
  const idempotencyKey = `contact-form-${contentHash}-${hourWindow}`;

  try {
    const { error } = await sendWithRetry(
      getResend(),
      {
        from: `Foremost Contact <${FROM_EMAIL}>`,
        to: CONTACT_EMAIL,
        replyTo: email,
        subject: `Contact Form: ${name}${company ? ` (${company})` : ""}`,
        react: ContactFormEmail({ name, email, company, message }),
      },
      idempotencyKey
    );

    if (error) {
      console.error("Error sending contact email:", error);
      return {
        success: false,
        message: "Failed to send your message. Please try again.",
      };
    }

    return {
      success: true,
      message: "Thank you for reaching out. We'll be in touch within 24 hours.",
    };
  } catch (error) {
    // Re-throw Next.js internal errors (redirect, notFound, etc.)
    unstable_rethrow(error);

    console.error("Unexpected error in contact form:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
