import { Metadata } from "next";
import { Suspense } from "react";
import { Container, Section } from "@/components/layout";
import {
  Button,
  Heading,
  Text,
  SectionLabel,
  LinkWithArrow,
  Card,
  CardContent,
  CTACard,
  LogoCarousel,
  TiltCard,
  HeroSection,
  ErrorBoundary,
  ScannerFallback,
  IndustryFinder,
  Testimonials,
} from "@/components/ui";
import { FadeIn, StaggerChildren, StaggerItem, TextReveal } from "@/components/motion";
import {
  SchemaScript,
  professionalServiceSchema,
  breadcrumbs,
} from "@/components/seo";
import { AIScanner } from "@/components/scanner";

// Loading skeletons for Suspense boundaries
function ScannerSkeleton() {
  return (
    <div className="min-h-[420px] flex items-center justify-center">
      <div className="text-foreground-muted text-sm font-mono">Loading scanner...</div>
    </div>
  );
}

function IndustryFinderSkeleton() {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="text-foreground-muted text-sm font-mono">Loading...</div>
    </div>
  );
}

function TestimonialsSkeleton() {
  return (
    <Section className="py-20">
      <Container>
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-foreground-muted text-sm font-mono">Loading testimonials...</div>
        </div>
      </Container>
    </Section>
  );
}

export const metadata: Metadata = {
  title: "Board-Level AI Advisory for Leaders | Foremost",
  description:
    "Cut through AI noise with board-level advisory. Get strategic clarity, measurable outcomes, and governance that enables speed.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Board-Level AI Advisory for Leaders | Foremost",
    description:
      "Cut through AI noise with board-level advisory. Get strategic clarity, measurable outcomes, and governance that enables speed.",
    url: "https://foremost.ai",
    type: "website",
    images: [
      {
        url: "https://foremost.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foremost.ai - Board-Level AI Advisory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Board-Level AI Advisory for Leaders | Foremost",
    description:
      "Cut through AI noise with board-level advisory. Get strategic clarity, measurable outcomes, and governance that enables speed.",
    images: ["https://foremost.ai/og-image.png"],
  },
};

const services = [
  {
    number: "01",
    title: "Strategic Clarity",
    description:
      "Most AI conversations start with technology. We start with your business goals, then work backwards to what AI actually helps with.",
    href: "/how-we-think#strategic-clarity",
    linkText: "See how",
  },
  {
    number: "02",
    title: "Applied Intelligence",
    description:
      "Pilots are easy; affecting your P&L is hard. We focus on the second part.",
    href: "/how-we-think#applied-intelligence",
    linkText: "See how",
  },
  {
    number: "03",
    title: "Human Potential",
    description:
      "AI projects fail because of people, not technology. We design organisations where humans and AI work together.",
    href: "/how-we-think#human-potential",
    linkText: "See how",
  },
  {
    number: "04",
    title: "Governance as Enabler",
    description:
      "Good governance lets you move faster. It gives teams permission to act.",
    href: "/how-we-think#governance",
    linkText: "See how",
  },
];


export default function Home() {
  return (
    <>
      <SchemaScript schema={[professionalServiceSchema, breadcrumbs.home]} />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <HeroSection>
          <Heading as="h1" size="hero" className="mb-6">
            <TextReveal>
              AI Strategy Consulting for Executive Teams
            </TextReveal>
          </Heading>
          <FadeIn delay={0.4}>
            <Text
              variant="bodyLarge"
              mono
              className="max-w-xl text-foreground-muted"
            >
              Board-level AI advisory. While your competitors run pilots,
              we help you ship.
            </Text>
            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              <Button href="/contact" size="lg" magnetic>
                Talk to a Founder
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="ml-1"
                >
                  <path
                    d="M3.333 8h9.334M8.667 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Button href="/how-we-work" variant="secondary" size="lg">
                See How We Work
              </Button>
            </div>
            <p className="mt-6 text-sm text-foreground-subtle font-mono">
              Now accepting founding clients · Direct founder access
            </p>
          </FadeIn>
        </HeroSection>

        {/* Logo Carousel */}
        <LogoCarousel />

        {/* Foremost Thinking Section */}
        <Section className="py-20" pattern="grid-subtle" blend="border">
          <Container>
            <FadeIn>
              <SectionLabel className="mb-8">Foremost Thinking</SectionLabel>
            </FadeIn>
            <blockquote className="max-w-3xl">
              <p className="text-[33px] leading-[1.2] tracking-[-0.5px] text-foreground">
                <TextReveal>
                  {`"We don't sell AI strategies. We sharpen business strategies for a world where AI exists."`}
                </TextReveal>
              </p>
            </blockquote>
            <FadeIn delay={0.6}>
              <div className="mt-8">
                <LinkWithArrow href="/how-we-think">
                  Explore Our Thinking
                </LinkWithArrow>
              </div>
            </FadeIn>
          </Container>
        </Section>

        {/* Strategic Clarity Section */}
        <Section className="py-20" blend="border">
          <Container>
            <div className="mb-12">
              <FadeIn>
                <SectionLabel className="mb-4">What We Do</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-4">
                <TextReveal>Strategically applied intelligence</TextReveal>
              </Heading>
              <FadeIn delay={0.4}>
                <Text
                  variant="bodyLarge"
                  mono
                  className="max-w-2xl text-foreground-muted"
                >
                  Every month you wait is a month your competitors don&apos;t.
                </Text>
              </FadeIn>
            </div>

            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {services.map((service) => (
                <StaggerItem key={service.number}>
                  <TiltCard className="h-full">
                    <Card className="h-full p-6">
                      <CardContent className="p-0">
                        <span className="font-mono text-sm text-foreground-muted mb-3 block">
                          {service.number}
                        </span>
                        <Heading as="h3" size="card" className="mb-3">
                          {service.title}
                        </Heading>
                        <Text variant="muted" className="mb-4">
                          {service.description}
                        </Text>
                        <LinkWithArrow href={service.href}>
                          {service.linkText}
                        </LinkWithArrow>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </Container>
        </Section>

        {/* Industries Section - Conversational Search */}
        <Section className="py-20" variant="card" pattern="grid-subtle" blend="elevated">
          <Container>
            <div className="mb-12">
              <FadeIn>
                <SectionLabel className="mb-4">Find Your Industry</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-4">
                <TextReveal>AI advisory for your sector</TextReveal>
              </Heading>
              <FadeIn delay={0.4}>
                <Text
                  variant="bodyLarge"
                  mono
                  className="max-w-2xl text-foreground-muted"
                >
                  Generic AI advice is useless. Tell us your industry; we&apos;ll show you what matters.
                </Text>
              </FadeIn>
            </div>

            <FadeIn delay={0.2}>
              <Suspense fallback={<IndustryFinderSkeleton />}>
                <IndustryFinder />
              </Suspense>
            </FadeIn>
          </Container>
        </Section>

        {/* Testimonials */}
        <Suspense fallback={<TestimonialsSkeleton />}>
          <Testimonials />
        </Suspense>

        {/* AI Scanner Section - Streams in via PPR */}
        <Section className="py-20" variant="card" pattern="grid-subtle" blend="elevated">
          <Container>
            <ErrorBoundary fallback={<ScannerFallback />}>
              <Suspense fallback={<ScannerSkeleton />}>
                <AIScanner />
              </Suspense>
            </ErrorBoundary>
          </Container>
        </Section>

        {/* CTA Card */}
        <CTACard
          label="Founding Engagements"
          topRightLink={{ text: "Limited Availability", href: "/contact" }}
          heading="We're looking for a handful of founding clients."
          description="You work with us directly — all three founders, no juniors. Better rates now than later."
          buttonText="Get in Touch"
          buttonHref="/contact"
        />
      </main>
    </>
  );
}
