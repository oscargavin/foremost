'use server';

import { Resend } from 'resend';
import { ScanReportEmail } from '../email-templates/scan-report-email';
import type { ScanResult } from '@/lib/scanner/types';
import crypto from 'crypto';

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null;
function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'office@foremost.ai';
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || 'hello@foremost.ai';

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

function isRetryableError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const statusCode = (error as { statusCode: number }).statusCode;
    return statusCode >= 500 || statusCode === 429;
  }
  return false;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendWithRetry(
  emailClient: Resend,
  emailData: Parameters<Resend['emails']['send']>[0],
  idempotencyKey: string
): Promise<{ data: { id: string } | null; error: unknown | null }> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await emailClient.emails.send(emailData, {
        headers: { 'Idempotency-Key': idempotencyKey }
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
  return { data: null, error: new Error('Max retries exceeded') };
}

interface SendScanReportParams {
  result: ScanResult;
  email: string;
  name?: string;
}

export async function sendScanReport({ result, email, name }: SendScanReportParams) {
  try {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: 'Please enter a valid email address.' };
    }

    // Generate idempotency keys based on scan result and email
    const scanHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({ url: result.url, email, timestamp: Math.floor(Date.now() / (1000 * 60 * 60)) }))
      .digest('hex')
      .slice(0, 16);

    const emailClient = getResend();

    // Send report to user and lead notification in parallel with retry logic
    const [userEmailResult, leadEmailResult] = await Promise.all([
      // Email to user with their report
      sendWithRetry(
        emailClient,
        {
          from: 'Foremost AI <hello@foremost.ai>',
          replyTo: REPLY_TO_EMAIL,
          to: email,
          subject: `Your AI Opportunity Report for ${result.businessName}`,
          react: ScanReportEmail({ result, recipientName: name }),
        },
        `scan-report-user-${scanHash}`
      ),

      // Lead notification to team
      sendWithRetry(
        emailClient,
        {
          from: 'Foremost Scanner <hello@foremost.ai>',
          to: CONTACT_EMAIL,
          subject: `New Scanner Lead: ${result.businessName} (${result.industry})`,
          text: `
New lead from AI Scanner:

Business: ${result.businessName}
Industry: ${result.industry}
Website: ${result.url}
Contact Email: ${email}
${name ? `Contact Name: ${name}` : ''}

Opportunities Identified: ${result.opportunities.length}
${result.opportunities.map((o, i) => `${i + 1}. ${o.title} (Impact: ${o.impact}/5)`).join('\n')}

Summary:
${result.summary}
          `,
          replyTo: email,
        },
        `scan-report-lead-${scanHash}`
      ),
    ]);

    if (userEmailResult.error) {
      console.error('Error sending user email:', userEmailResult.error);
      return { error: 'Failed to send report. Please try again.' };
    }

    if (leadEmailResult.error) {
      console.error('Error sending lead notification:', leadEmailResult.error);
      // Don't fail if just the lead notification fails
    }

    return {
      success: true,
      message: 'Report sent successfully! Check your inbox.'
    };
  } catch (error) {
    console.error('Error in sendScanReport:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
