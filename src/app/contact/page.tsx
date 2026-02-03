import { Metadata } from "next";
import { Suspense } from "react";
import { Container, Section } from "@/components/layout";
import { Heading, Text, SectionLabel, HeroSection } from "@/components/ui";
import { FadeIn, TextReveal } from "@/components/motion";
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
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <HeroSection variant="contact">
          <Heading as="h1" size="hero" className="mb-6">
            <TextReveal>Start a Conversation.</TextReveal>
          </Heading>
          <FadeIn delay={0.4}>
            <Text
              variant="bodyLarge"
              mono
              className="max-w-xl text-foreground-muted"
            >
              We take on a few clients at a time. You&apos;d work directly with the founders — no account managers in between.
            </Text>
          </FadeIn>
        </HeroSection>

        {/* Contact Form Section */}
        <Section className="pb-12 md:pb-20">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-center">
              {/* Left column - Contact info */}
              <div className="lg:col-span-5 lg:pr-8">
                <FadeIn>
                  <SectionLabel className="mb-6">Let&apos;s Talk</SectionLabel>
                </FadeIn>

                {/* Contact info cards - stacked vertically on mobile, visible on desktop */}
                <div className="mt-8 space-y-6 hidden lg:block">
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

                    <div className="bg-background-card rounded-xl p-5 sm:p-8 md:p-10 lg:p-12 border border-border shadow-lg relative overflow-hidden">
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

        {/* Bottom section - elevated dark card with contact info and quote */}
        <div className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-9">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div
                className="relative bg-background-dark rounded-lg overflow-hidden"
                style={{
                  border: "3px dashed rgba(255, 255, 255, 0.4)",
                }}
              >
                {/* Subtle diagonal lines background */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      -55deg,
                      transparent,
                      transparent 8px,
                      rgba(255,255,255,0.04) 8px,
                      rgba(255,255,255,0.04) 9px
                    )`,
                  }}
                />

                {/* Content */}
                <div className="relative p-6 sm:p-8 md:p-10">
                  {/* Top accent bar */}
                  <div className="flex items-center justify-between mb-8 sm:mb-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-orange" />
                    <span className="font-mono text-xs uppercase tracking-widest text-white/40">
                      Get in Touch
                    </span>
                  </div>

                  {/* Mobile contact info */}
                  <div className="lg:hidden mb-10 sm:mb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <a
                        href="mailto:office@foremost.ai"
                        className="group flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors min-h-14"
                      >
                        <div>
                          <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider block mb-1">
                            Email
                          </span>
                          <span className="text-base text-white group-hover:text-accent-orange transition-colors">
                            office@foremost.ai
                          </span>
                        </div>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="text-white/30 group-hover:text-accent-orange transition-colors"
                        >
                          <path
                            d="M3.333 8h9.334M8.667 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                      <a
                        href="https://linkedin.com/company/foremost-ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors min-h-14"
                      >
                        <div>
                          <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider block mb-1">
                            LinkedIn
                          </span>
                          <span className="text-base text-white group-hover:text-accent-orange transition-colors">
                            Foremost.ai
                          </span>
                        </div>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="text-white/30 group-hover:text-accent-orange transition-colors"
                        >
                          <path
                            d="M3.333 8h9.334M8.667 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="max-w-2xl">
                    <p className="text-xl sm:text-2xl md:text-[28px] leading-[1.3] tracking-[-0.02em] text-white">
                      <TextReveal>
                        &ldquo;Right now we can give you our full attention. That changes as we grow.&rdquo;
                      </TextReveal>
                    </p>
                  </blockquote>
                  <FadeIn delay={0.4}>
                    <p className="mt-6 text-white/50 font-mono text-sm">
                      Better rates now. Direct access. Only a few spots.
                    </p>
                  </FadeIn>

                  {/* Bottom bar */}
                  <div className="flex items-center justify-between mt-10 sm:mt-12 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <PulsingDot />
                      <span className="font-mono text-xs text-white/40">
                        Typically respond within 24 hours
                      </span>
                    </div>
                    <span className="font-mono text-xs text-white/30 hidden sm:block">
                      foremost.ai
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
    </>
  );
}

