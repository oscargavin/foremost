import { NextRequest } from 'next/server';
import { after } from 'next/server';
import { Resend } from 'resend';
import { QuestionnaireSummaryEmail } from '@/app/email-templates/questionnaire-summary-email';
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
const FROM_EMAIL = process.env.FROM_EMAIL || 'hello@foremost.ai';
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || FROM_EMAIL;

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

// Function to format the final summary response
function formatFinalSummary(text: string): string {
  // Remove duplicate thank yous at the beginning
  let formatted = text.replace(/^#\s*Thank you[^#\n]*\n*Thank you/i, "# Thank you");

  // If there's no heading at the start, add one
  if (!formatted.startsWith("# Thank")) {
    formatted = "# Thank you for your information\n\n" + formatted;
  }

  // Ensure proper line breaks after headings and between bullet points
  formatted = formatted.replace(/^# (.+)$/m, "# $1\n");

  return formatted;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, summary, orchestratorMode, selectedService } = await req.json();

    if (!messages || !Array.isArray(messages) || !summary) {
      return new Response(
        JSON.stringify({ error: 'Invalid request format. Messages array and summary are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Format the summary
    const formattedSummary = formatFinalSummary(summary);

    // Prepare the full conversation history as a string
    const chatHistory = messages
      .filter((msg: { role: string; content: string }) => msg.role !== 'system')
      .map((msg: { role: string; content: string }) => {
        if (msg.role === 'user') {
          return `**Client**: ${msg.content}`;
        } else if (msg.role === 'assistant') {
          return `**Foremost**: ${msg.content}`;
        }
        return '';
      })
      .join('\n\n---\n\n');

    // Create a combined summary with the formatted response and conversation history
    const emailContent = `
# Questionnaire Summary

**Mode**: ${orchestratorMode || 'quote'}
${selectedService ? `**Service**: ${selectedService}` : ''}

${formattedSummary}

# Complete Conversation History

${chatHistory}
`;

    // Generate idempotency key based on message content hash + timestamp (hourly window)
    const contentHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({ messages, orchestratorMode, selectedService }))
      .digest('hex')
      .slice(0, 16);
    const hourWindow = Math.floor(Date.now() / (1000 * 60 * 60));
    const idempotencyKey = `chat-summary-${contentHash}-${hourWindow}`;

    // Use after() to send email after response is returned (non-blocking)
    after(async () => {
      try {
        const { error } = await sendWithRetry(
          getResend(),
          {
            from: `Foremost Chat <${FROM_EMAIL}>`,
            replyTo: REPLY_TO_EMAIL,
            to: CONTACT_EMAIL,
            subject: `New Chat Inquiry - ${orchestratorMode === 'services' ? selectedService : 'General Quote'}`,
            react: QuestionnaireSummaryEmail({ summary: emailContent }),
          },
          idempotencyKey
        );

        if (error) {
          console.error('Error sending summary email:', error);
        }
      } catch (error) {
        console.error('Error in after() email sending:', error);
      }
    });

    // Respond immediately - email is sent in the background
    return new Response(
      JSON.stringify({ success: true, message: 'Summary email queued for delivery' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing summary request:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
