import { Metadata } from "next";
import { Suspense } from "react";
import { Navbar, Container, Section, Footer } from "@/components/layout";
import { Heading, Text, SectionLabel } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { ContactForm } from "./contact-form";
import { SchemaScript, breadcrumbs } from "@/components/seo";

export const metadata: Metadata = {
  title: "Contact Our AI Consultants | Foremost",
  description:
    "Contact our AI consultants to discuss board-level AI strategy. Schedule a conversation and get clarity on your AI agenda.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Our AI Consultants | Foremost",
    description:
      "Contact our AI consultants to discuss board-level AI strategy. Schedule a conversation and get clarity on your AI agenda.",
    url: "https://foremost.ai/contact",
    type: "website",
    images: [
      {
        url: "https://foremost.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foremost.ai - Contact Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Our AI Consultants | Foremost",
    description:
      "Contact our AI consultants to discuss board-level AI strategy. Schedule a conversation and get clarity on your AI agenda.",
    images: ["https://foremost.ai/og-image.png"],
  },
};

export default function ContactPage() {
  return (
    <>
      <SchemaScript schema={breadcrumbs.contact} />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <Section className="pt-32 pb-20">
          <Container>
            <FadeIn>
              <div className="max-w-4xl">
                <Heading as="h1" size="hero" className="mb-6">
                  Contact Foremost AI Consultants
                </Heading>
                <Text
                  variant="bodyLarge"
                  mono
                  className="max-w-xl text-foreground-muted"
                >
                  Start a conversation about bringing clarity to your AI agenda
                  and business transformation goals.
                </Text>
              </div>
            </FadeIn>
          </Container>
        </Section>

        {/* Contact Form Section */}
        <Section className="py-20" variant="card" pattern="grid-subtle" blend="elevated">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Form */}
              <FadeIn>
                <div className="max-w-md">
                  <SectionLabel className="mb-4">Start a Conversation</SectionLabel>
                  <Heading as="h2" size="card" className="mb-8">
                    Send Us a Message
                  </Heading>
                  <Suspense fallback={<div className="h-96 animate-pulse bg-background-card rounded-lg" />}>
                    <ContactForm />
                  </Suspense>
                </div>
              </FadeIn>

              {/* Contact Info */}
              <FadeIn delay={0.2}>
                <div>
                  <SectionLabel className="mb-4">Contact Details</SectionLabel>
                  <Heading as="h2" size="card" className="mb-8">
                    Get in Touch Directly
                  </Heading>

                  <div className="space-y-8">
                    <div>
                      <Text className="font-mono text-sm text-foreground-muted mb-2">
                        Email
                      </Text>
                      <a
                        href="mailto:office@foremost.ai"
                        className="text-lg text-foreground hover:text-foreground-secondary transition-colors"
                      >
                        office@foremost.ai
                      </a>
                    </div>

                    <div>
                      <Text className="font-mono text-sm text-foreground-muted mb-2">
                        LinkedIn
                      </Text>
                      <a
                        href="https://linkedin.com/company/foremost-ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-foreground hover:text-foreground-secondary transition-colors"
                      >
                        Foremost.ai
                      </a>
                    </div>

                    <div className="pt-8 border-t border-border">
                      <Text variant="muted" className="text-lg leading-relaxed">
                        Prefer to schedule a call directly? We&apos;re happy to arrange
                        a conversation at a time that works for you. Just drop us
                        a note and we&apos;ll get back to you promptly.
                      </Text>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
