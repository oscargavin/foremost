"use client";

import { useActionState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Input, Label, Textarea, Text } from "@/components/ui";
import { submitContactForm, type ContactFormState } from "@/app/actions";

const initialState: ContactFormState = {
  success: false,
  message: "",
};

export function ContactForm() {
  const searchParams = useSearchParams();
  const industryParam = searchParams.get("industry");
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState
  );

  // Pre-fill message if industry query param is present
  useEffect(() => {
    if (industryParam && messageRef.current && !messageRef.current.value) {
      messageRef.current.value = `I'm interested in AI consulting for the ${industryParam} industry. I'd like to discuss how AI could help our organisation.`;
    }
  }, [industryParam]);

  // Focus error summary when errors appear
  useEffect(() => {
    if (state.errors && Object.keys(state.errors).length > 0) {
      errorSummaryRef.current?.focus();
    }
  }, [state.errors]);

  // Get all error fields for summary
  const errorFields = state.errors
    ? Object.entries(state.errors).map(([field, messages]) => ({
        field,
        message: messages[0],
        id: `${field}`,
      }))
    : [];

  if (state.success) {
    return (
      <div
        className="p-8 bg-background-card rounded-lg border border-border"
        role="status"
        aria-live="polite"
      >
        <Text as="p" className="text-lg text-foreground mb-2">
          Thank you for reaching out.
        </Text>
        <Text variant="muted">
          We&apos;ll be in touch within 24 hours to arrange a conversation.
        </Text>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6" aria-busy={isPending}>
      {/* Error Summary */}
      {errorFields.length > 0 && (
        <div
          ref={errorSummaryRef}
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
          className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-destructive"
        >
          <Text as="p" className="font-medium text-destructive mb-2">
            Please fix the following errors:
          </Text>
          <ul className="list-disc list-inside space-y-1">
            {errorFields.map(({ field, message }) => (
              <li key={field}>
                <a
                  href={`#${field}`}
                  className="text-sm text-destructive underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-destructive rounded"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">
          Name
          <span className="text-destructive ml-1" aria-hidden="true">
            *
          </span>
          <span className="sr-only">(required)</span>
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          required
          aria-required="true"
          aria-invalid={state.errors?.name ? "true" : undefined}
          aria-describedby={state.errors?.name ? "name-error" : undefined}
        />
        {state.errors?.name && (
          <Text id="name-error" variant="small" className="text-destructive">
            {state.errors.name[0]}
          </Text>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email
          <span className="text-destructive ml-1" aria-hidden="true">
            *
          </span>
          <span className="sr-only">(required)</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          required
          aria-required="true"
          aria-invalid={state.errors?.email ? "true" : undefined}
          aria-describedby={state.errors?.email ? "email-error" : undefined}
        />
        {state.errors?.email && (
          <Text id="email-error" variant="small" className="text-destructive">
            {state.errors.email[0]}
          </Text>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          type="text"
          placeholder="Your company"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Message
          <span className="text-destructive ml-1" aria-hidden="true">
            *
          </span>
          <span className="sr-only">(required)</span>
        </Label>
        <Textarea
          ref={messageRef}
          id="message"
          name="message"
          placeholder="Tell us about your AI challenges and what you'd like to discuss..."
          className="min-h-[150px]"
          required
          aria-required="true"
          aria-invalid={state.errors?.message ? "true" : undefined}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
        />
        {state.errors?.message && (
          <Text id="message-error" variant="small" className="text-destructive">
            {state.errors.message[0]}
          </Text>
        )}
      </div>

      {state.message && !state.success && (
        <div role="alert" aria-live="assertive">
          <Text variant="small" className="text-destructive">
            {state.message}
          </Text>
        </div>
      )}

      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <span className="sr-only">Sending message, please wait</span>
            <span aria-hidden="true">Sending...</span>
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
