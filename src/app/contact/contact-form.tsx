"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { m, AnimatePresence } from "motion/react";
import { Button, Input, Label, Textarea, Text } from "@/components/ui";
import {
  FormFieldReveal,
  FormSuccess,
  FormSuccessIcon,
  FormSuccessText,
  FormError,
} from "@/components/motion";
import { submitContactForm, type ContactFormState } from "@/app/actions";
import { contactSchema, type ContactFormData } from "@/lib/schemas/contact";

export function ContactForm() {
  const searchParams = useSearchParams();
  const industryParam = searchParams.get("industry");
  const [serverState, setServerState] = useState<ContactFormState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  // Pre-fill message if industry query param is present
  useEffect(() => {
    if (industryParam) {
      setValue(
        "message",
        `I'm interested in AI consulting for the ${industryParam} industry. I'd like to discuss how AI could help our organisation.`
      );
    }
  }, [industryParam, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setServerState(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("company", data.company || "");
    formData.append("message", data.message);

    const result = await submitContactForm(
      { success: false, message: "" },
      formData
    );

    setServerState(result);
    setIsSubmitting(false);

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          setError(field as keyof ContactFormData, {
            type: "server",
            message: messages[0],
          });
        }
      });
    }

    if (result.success) {
      reset();
    }
  };

  // Helper to create field wrapper with focus indicator
  const createFieldProps = (fieldName: keyof ContactFormData) => ({
    onFocus: () => setFocusedField(fieldName),
    onBlur: () => setFocusedField(null),
  });

  return (
    <AnimatePresence mode="wait">
      {serverState?.success ? (
        <FormSuccess
          key="success"
          className="relative py-12 text-center"
        >
          <div role="status" aria-live="polite">
            {/* Success checkmark with spring bounce */}
            <FormSuccessIcon className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-orange/10 text-accent-orange">
              <m.svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <m.path
                  d="M8 16l6 6 10-12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                />
              </m.svg>
            </FormSuccessIcon>
            <FormSuccessText>
              <Text as="p" className="text-xl text-foreground mb-2">
                Message sent
              </Text>
            </FormSuccessText>
            <FormSuccessText>
              <Text variant="muted" className="max-w-xs mx-auto">
                We&apos;ll be in touch within 24 hours to arrange a conversation.
              </Text>
            </FormSuccessText>
          </div>
        </FormSuccess>
      ) : (
        <m.form
          key="form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          aria-busy={isSubmitting}
          noValidate
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Server Error Message with shake animation */}
          <FormError
            isVisible={!!(serverState?.message && !serverState.success)}
            className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg overflow-hidden"
          >
            <div role="alert" aria-live="assertive" className="flex items-start gap-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-destructive flex-shrink-0 mt-0.5"
              >
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <Text as="p" className="text-sm text-destructive">
                {serverState?.message}
              </Text>
            </div>
          </FormError>

          {/* Two-column layout for name and email with staggered reveal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormFieldReveal index={0}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground-secondary">
                  Name
                  <span className="text-accent-orange ml-1" aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  aria-required="true"
                  aria-invalid={errors.name ? "true" : undefined}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`transition-all duration-200 ${
                    focusedField === "name" ? "border-accent-orange ring-2 ring-accent-orange/10" : ""
                  } ${errors.name ? "border-destructive" : ""}`}
                  {...register("name")}
                  {...createFieldProps("name")}
                />
                <AnimatePresence>
                  {errors.name && (
                    <m.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Text id="name-error" variant="small" className="text-destructive flex items-center gap-1">
                        <span role="alert">{errors.name.message}</span>
                      </Text>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </FormFieldReveal>

            <FormFieldReveal index={1}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground-secondary">
                  Email
                  <span className="text-accent-orange ml-1" aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  aria-required="true"
                  aria-invalid={errors.email ? "true" : undefined}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`transition-all duration-200 ${
                    focusedField === "email" ? "border-accent-orange ring-2 ring-accent-orange/10" : ""
                  } ${errors.email ? "border-destructive" : ""}`}
                  {...register("email")}
                  {...createFieldProps("email")}
                />
                <AnimatePresence>
                  {errors.email && (
                    <m.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Text id="email-error" variant="small" className="text-destructive">
                        <span role="alert">{errors.email.message}</span>
                      </Text>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </FormFieldReveal>
          </div>

          <FormFieldReveal index={2}>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium text-foreground-secondary">
                Company
                <span className="text-foreground-subtle ml-2 font-normal text-xs">(optional)</span>
              </Label>
              <Input
                id="company"
                type="text"
                placeholder="Your company"
                className={`transition-all duration-200 ${
                  focusedField === "company" ? "border-accent-orange ring-2 ring-accent-orange/10" : ""
                }`}
                {...register("company")}
                {...createFieldProps("company")}
              />
            </div>
          </FormFieldReveal>

          <FormFieldReveal index={3}>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-foreground-secondary">
                Message
                <span className="text-accent-orange ml-1" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us about your AI challenges and what you'd like to discuss..."
                className={`min-h-[140px] resize-none transition-all duration-200 ${
                  focusedField === "message" ? "border-accent-orange ring-2 ring-accent-orange/10" : ""
                } ${errors.message ? "border-destructive" : ""}`}
                aria-required="true"
                aria-invalid={errors.message ? "true" : undefined}
                aria-describedby={errors.message ? "message-error" : undefined}
                {...register("message")}
                {...createFieldProps("message")}
              />
              <AnimatePresence>
                {errors.message && (
                  <m.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Text id="message-error" variant="small" className="text-destructive">
                      <span role="alert">{errors.message.message}</span>
                    </Text>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </FormFieldReveal>

          <FormFieldReveal index={4}>
            <div className="pt-2">
              <m.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full group relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <m.span
                        key="loading"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <span className="sr-only">Sending message, please wait</span>
                        <m.svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </m.svg>
                        <span aria-hidden="true">Sending...</span>
                      </m.span>
                    ) : (
                      <m.span
                        key="default"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-2"
                      >
                        Send Message
                        <m.svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          initial={{ x: 0 }}
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          <path
                            d="M3.333 8h9.334M8.667 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </m.svg>
                      </m.span>
                    )}
                  </AnimatePresence>
                </Button>
              </m.div>
            </div>
          </FormFieldReveal>
        </m.form>
      )}
    </AnimatePresence>
  );
}
