import { Metadata } from "next";
import { Navbar, Container, Section, Footer } from "@/components/layout";
import {
  Button,
  Heading,
  Text,
  SectionLabel,
  LinkWithArrow,
  Card,
  CardContent,
  CTACard,
  IndustryFinder,
  LogoCarousel,
  Testimonials,
  TiltCard,
} from "@/components/ui";
import { FadeIn, StaggerChildren, StaggerItem, TextReveal } from "@/components/motion";
import { AIScanner } from "@/components/scanner";
import {
  SchemaScript,
  professionalServiceSchema,
  breadcrumbs,
} from "@/components/seo";

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
      "Most AI conversations start with technology. We start with your business goals, then figure out which ones AI actually helps with.",
    href: "/how-we-think#strategic-clarity",
    linkText: "Explore strategic clarity",
  },
  {
    number: "02",
    title: "Applied Intelligence",
    description:
      "Pilots are easy. Getting AI to affect your P&L is hard. We focus on the second part.",
    href: "/how-we-think#applied-intelligence",
    linkText: "Explore applied intelligence",
  },
  {
    number: "03",
    title: "Human Potential",
    description:
      "AI projects fail because of people, not technology. We help you design organisations where humans and AI actually work together.",
    href: "/how-we-think#human-potential",
    linkText: "Explore human potential",
  },
  {
    number: "04",
    title: "Governance as Enabler",
    description:
      "Good governance lets you move faster, not slower. It gives your teams permission to act.",
    href: "/how-we-think#governance",
    linkText: "Explore governance",
  },
];


export default function Home() {
  return (
    <>
      <SchemaScript schema={[professionalServiceSchema, breadcrumbs.home]} />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <Section className="pt-32 pb-20">
          <Container>
            <div className="max-w-4xl">
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
                  Board-level AI advisory. We help leadership teams figure out
                  what AI actually means for their business, then make it happen.
                </Text>
                <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                  <Button href="/contact" size="lg" magnetic>
                    Schedule a Discussion
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
                  Advising executive teams across 6 industries
                </p>
              </FadeIn>
            </div>
          </Container>
        </Section>

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
                  {`"We don't sell AI strategies. We sharpen business strategies for an AI-enabled world."`}
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
                  For boards tired of hearing what AI could do, and ready to
                  focus on what it should do for their specific business.
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
                  Generic AI advice is useless. Tell us your industry and
                  we&apos;ll show you what actually matters.
                </Text>
              </FadeIn>
            </div>

            <FadeIn delay={0.2}>
              <IndustryFinder />
            </FadeIn>
          </Container>
        </Section>

        {/* Testimonials */}
        <Testimonials />

        {/* AI Scanner Section */}
        <Section className="py-20" variant="card" pattern="grid-subtle" blend="elevated">
          <Container>
            <AIScanner />
          </Container>
        </Section>

        {/* CTA Card */}
        <CTACard
          label="Start a Conversation"
          topRightLink={{ text: "Contact", href: "/contact" }}
          heading="Ready to cut through the noise?"
          description="No pitch deck. Just a conversation about your business."
          buttonText="Schedule a Discussion"
          buttonHref="/contact"
        />
      </main>
      <Footer />
    </>
  );
}
