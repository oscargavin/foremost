import { Metadata } from "next";
import { Suspense } from "react";
import { Navbar, Container, Section, Footer } from "@/components/layout";
import { Heading, Text, SectionLabel, ContactAnimation } from "@/components/ui";
import { FadeIn, TextReveal, StaggerChildren, StaggerItem } from "@/components/motion";
import { ContactForm } from "./contact-form";
import { SchemaScript, breadcrumbs } from "@/components/seo";
import { ContactInfoCardAnimated, DecorativeCorners, PulsingDot } from "./contact-animations";

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
        {/* Hero Section - Dramatic asymmetric layout */}
        <Section className="pt-32 pb-12 md:pb-0 md:min-h-[85vh] relative overflow-hidden">
          <ContactAnimation />
          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-center lg:min-h-[calc(85vh-128px)]">
              {/* Left column - Typography focused */}
              <div className="lg:col-span-5 lg:pr-8">
                <FadeIn>
                  <SectionLabel className="mb-6">Let&apos;s Talk</SectionLabel>
                </FadeIn>
                <Heading as="h1" size="hero" className="mb-8">
                  <TextReveal>Start a Conversation</TextReveal>
                </Heading>
                <FadeIn delay={0.3}>
                  <Text
                    variant="bodyLarge"
                    mono
                    className="text-foreground-muted max-w-md"
                  >
                    No pitch deck. No sales process. Just a direct conversation
                    about what AI could mean for your business.
                  </Text>
                </FadeIn>

                {/* Contact info cards - stacked vertically on mobile, visible on desktop */}
                <div className="mt-12 space-y-6 hidden lg:block">
                  <ContactInfoCardAnimated
                    label="Email"
                    value="office@foremost.ai"
                    href="mailto:office@foremost.ai"
                    index={0}
                  />
                  <ContactInfoCardAnimated
                    label="LinkedIn"
                    value="Foremost.ai"
                    href="https://linkedin.com/company/foremost-ai"
                    external
                    index={1}
                  />
                </div>

                {/* Response time indicator */}
                <FadeIn delay={0.5}>
                  <div className="mt-12 hidden lg:flex items-center gap-3">
                    <PulsingDot />
                    <span className="font-mono text-sm text-foreground-muted">
                      Typically respond within 24 hours
                    </span>
                  </div>
                </FadeIn>
              </div>

              {/* Right column - Form in elevated card */}
              <div className="lg:col-span-7">
                <FadeIn delay={0.2}>
                  <div className="relative">
                    {/* Decorative corner accents with animation */}
                    <DecorativeCorners />

                    <div className="bg-background-card rounded-xl p-8 md:p-10 lg:p-12 border border-border shadow-lg relative overflow-hidden">
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-orange/[0.02] pointer-events-none" />

                      <div className="relative">
                        <div className="flex items-center justify-between mb-8">
                          <Heading as="h2" size="card">
                            Send a Message
                          </Heading>
                          <span className="font-mono text-xs text-foreground-subtle tracking-wide uppercase hidden sm:block">
                            Direct Line
                          </span>
                        </div>

                        <Suspense
                          fallback={
                            <div className="space-y-6">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                  <div className="h-4 w-20 bg-surface-subtle rounded animate-pulse" />
                                  <div className="h-12 bg-surface-subtle rounded-lg animate-pulse" />
                                </div>
                              ))}
                              <div className="h-12 bg-surface-subtle rounded-lg animate-pulse mt-4" />
                            </div>
                          }
                        >
                          <ContactForm />
                        </Suspense>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </Container>
        </Section>

        {/* Mobile-only contact info section */}
        <Section className="py-12 lg:hidden" variant="card" pattern="grid-subtle" blend="elevated">
          <Container>
            <div className="space-y-6">
              <ContactInfoCardAnimated
                label="Email"
                value="office@foremost.ai"
                href="mailto:office@foremost.ai"
                index={0}
              />
              <ContactInfoCardAnimated
                label="LinkedIn"
                value="Foremost.ai"
                href="https://linkedin.com/company/foremost-ai"
                external
                index={1}
              />
              <FadeIn delay={0.3}>
                <div className="flex items-center gap-3 pt-4">
                  <PulsingDot />
                  <span className="font-mono text-sm text-foreground-muted">
                    Typically respond within 24 hours
                  </span>
                </div>
              </FadeIn>
            </div>
          </Container>
        </Section>

        {/* Bottom quote section */}
        <Section className="py-20" pattern="grid-subtle" blend="border">
          <Container>
            <FadeIn>
              <div className="max-w-3xl mx-auto text-center">
                <blockquote>
                  <Text className="text-2xl md:text-[28px] leading-relaxed text-foreground">
                    <TextReveal>
                      &ldquo;The best conversations start with curiosity, not a pitch.&rdquo;
                    </TextReveal>
                  </Text>
                </blockquote>
                <FadeIn delay={0.4}>
                  <Text variant="muted" className="mt-6 font-mono text-sm">
                    We&apos;re here to listen first, advise second.
                  </Text>
                </FadeIn>
              </div>
            </FadeIn>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}

