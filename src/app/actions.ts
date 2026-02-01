"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

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

  // In production, this would send an email or save to a database
  // For now, we log and return success
  console.log("Contact form submission:", validatedFields.data);

  // Simulate async operation (e.g., sending email)
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    message: "Thank you for reaching out. We'll be in touch within 24 hours.",
  };
}
