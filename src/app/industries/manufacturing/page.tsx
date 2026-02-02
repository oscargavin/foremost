import { Metadata } from "next";
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
  HeroSection,
} from "@/components/ui";
import { FadeIn, StaggerChildren, StaggerItem, TextReveal } from "@/components/motion";
import { SchemaScript, generateBreadcrumbSchema } from "@/components/seo";

const BASE_URL = "https://foremost.ai";

export const metadata: Metadata = {
  title: "AI Consulting for Manufacturing | Foremost",
  description:
    "Strategic AI consulting for manufacturing. Predictive maintenance, digital twins, and operational excellence for industrial leaders.",
  alternates: {
    canonical: "/industries/manufacturing",
  },
  openGraph: {
    title: "AI Consulting for Manufacturing | Foremost",
    description:
      "Strategic AI consulting for manufacturing. Predictive maintenance, digital twins, and operational excellence for industrial leaders.",
    url: "https://foremost.ai/industries/manufacturing",
    type: "website",
    images: [
      {
        url: "https://foremost.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foremost.ai - AI Consulting for Manufacturing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Consulting for Manufacturing | Foremost",
    description:
      "Strategic AI consulting for manufacturing. Predictive maintenance, quality control, supply chain optimization.",
    images: ["https://foremost.ai/og-image.png"],
  },
};

const manufacturingBreadcrumbs = generateBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Industries", url: `${BASE_URL}/industries` },
  { name: "Manufacturing", url: `${BASE_URL}/industries/manufacturing` },
]);

const useCases = [
  {
    title: "Predictive Maintenance",
    description:
      "Fix equipment before it breaks. The ROI is obvious: unplanned downtime is expensive. Getting sensor data from legacy machines is the hard part.",
  },
  {
    title: "Quality Control & Inspection",
    description:
      "Computer vision catches defects human inspectors miss. Proven in automotive and electronics; deployment depends on your line configuration.",
  },
  {
    title: "Supply Chain Optimization",
    description:
      "Better demand forecasts, less safety stock. The models work; the challenge is getting accurate data from suppliers who won't share it.",
  },
  {
    title: "Production Planning & Scheduling",
    description:
      "Dynamic scheduling that adapts when a machine goes down. Most planning systems can't do this — AI can, if the data is there.",
  },
  {
    title: "Digital Twins",
    description:
      "Simulate changes before making them. Useful for expensive decisions, not worth the setup for simple processes.",
  },
];

const whyForemost = [
  {
    title: "Operational Excellence Focus",
    description:
      "We measure AI success the same way you measure manufacturing: uptime, yield, throughput. Impressive demos don't count.",
  },
  {
    title: "Pragmatic Implementation",
    description:
      "We've seen too many pilots that never scale. We focus on use cases that work in production, not just controlled environments.",
  },
  {
    title: "Integration Expertise",
    description:
      "Factory floor reality: 20-year-old PLCs, proprietary protocols, IT teams who've never seen the plant. We've dealt with all of it.",
  },
];

const relatedIndustries = [
  {
    title: "Energy",
    description: "AI advisory for asset-intensive operations with similar predictive maintenance and optimisation challenges.",
    href: "/industries/energy",
  },
  {
    title: "Retail",
    description: "AI consulting for supply chain optimisation and demand forecasting across complex distribution networks.",
    href: "/industries/retail",
  },
];

export default function ManufacturingPage() {
  return (
    <>
      <SchemaScript schema={manufacturingBreadcrumbs} />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <HeroSection variant="industry-manufacturing">
          <Heading as="h1" size="hero" className="mb-6">
            <TextReveal>AI Advisory for Manufacturing</TextReveal>
          </Heading>
          <FadeIn delay={0.4}>
            <Text
              variant="bodyLarge"
              mono
              className="max-w-xl text-foreground-muted"
            >
              AI advisory for manufacturers who care about what actually
              works on the factory floor.
            </Text>
          </FadeIn>
        </HeroSection>

        {/* Industry Challenges Section */}
        <Section className="py-20" pattern="grid-subtle" blend="border">
          <Container>
            <div className="max-w-3xl">
              <FadeIn>
                <SectionLabel className="mb-4">The Challenge</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-8">
                <TextReveal>AI in Manufacturing: Promise Meets Reality</TextReveal>
              </Heading>
              <FadeIn delay={0.3}>
                <div className="space-y-6">
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Industry 4.0 sounds great in presentations — connected
                    factories, AI-driven everything. Reality is messier:
                    equipment that predates the internet, data stuck in systems
                    that don't talk, pilots that never reach production.
                  </Text>
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Your competitors are probably claiming transformation too.
                    Most are stuck in the same place you are.
                  </Text>
                  <Text
                    as="p"
                    className="text-[24px] leading-[1.4] text-foreground"
                  >
                    The question is how to get from pilot to production without
                    wasting years and millions.
                  </Text>
                </div>
              </FadeIn>
            </div>
          </Container>
        </Section>

        {/* Use Cases Section */}
        <Section className="py-20" variant="card" pattern="grid-subtle" blend="elevated">
          <Container>
            <div className="mb-12">
              <FadeIn>
                <SectionLabel className="mb-4">AI Use Cases</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-4">
                <TextReveal>Where AI Creates Value in Manufacturing</TextReveal>
              </Heading>
              <FadeIn delay={0.4}>
                <Text variant="muted" className="text-lg max-w-2xl">
                  Where AI actually improves manufacturing operations.
                </Text>
              </FadeIn>
            </div>
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {useCases.map((useCase, index) => (
                <StaggerItem key={index}>
                  <Card className="h-full p-6">
                    <CardContent className="p-0">
                      <Heading as="h3" size="card" className="mb-4">
                        {useCase.title}
                      </Heading>
                      <Text variant="muted">{useCase.description}</Text>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </Container>
        </Section>

        {/* Why Foremost Section */}
        <Section className="py-20" blend="border">
          <Container>
            <div className="mb-12">
              <FadeIn>
                <SectionLabel className="mb-4">Our Approach</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section">
                <TextReveal>Why Manufacturing Leaders Choose Foremost</TextReveal>
              </Heading>
            </div>
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {whyForemost.map((item, index) => (
                <StaggerItem key={index}>
                  <Card className="h-full p-6">
                    <CardContent className="p-0">
                      <Heading as="h3" size="card" className="mb-4">
                        {item.title}
                      </Heading>
                      <Text variant="muted">{item.description}</Text>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </Container>
        </Section>

        {/* Related Industries */}
        <Section className="py-20" pattern="grid-subtle" blend="border">
          <Container>
            <FadeIn>
              <SectionLabel className="mb-4">Related Industries</SectionLabel>
            </FadeIn>
            <Heading as="h2" size="section" className="mb-8">
              <TextReveal>AI Advisory for Similar Sectors</TextReveal>
            </Heading>
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {relatedIndustries.map((industry) => (
                <StaggerItem key={industry.href}>
                  <Card className="h-full p-6">
                    <CardContent className="p-0">
                      <Heading as="h3" size="card" className="mb-3">
                        {industry.title}
                      </Heading>
                      <Text variant="muted" className="mb-4">
                        {industry.description}
                      </Text>
                      <LinkWithArrow href={industry.href}>
                        Explore AI consulting for {industry.title.toLowerCase()}
                      </LinkWithArrow>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </Container>
        </Section>

        {/* Explore More */}
        <Section className="py-20" variant="card" blend="elevated">
          <Container>
            <FadeIn>
              <SectionLabel className="mb-4">Continue Exploring</SectionLabel>
            </FadeIn>
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/how-we-think" className="text-lg">
                    How We Think
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Our perspective on AI transformation
                  </Text>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/how-we-work" className="text-lg">
                    How We Work
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Our partnership model
                  </Text>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/who-we-are" className="text-lg">
                    Who We Are
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Meet the team
                  </Text>
                </div>
              </StaggerItem>
            </StaggerChildren>
          </Container>
        </Section>

        {/* CTA Card */}
        <CTACard
          label="Founding Engagements"
          topRightLink={{ text: "Limited Spots", href: "/contact" }}
          heading="Automation advantages compound. Start now."
          description="Founding clients work with us directly and pay less than those who come later."
          buttonText="Talk to Us"
          buttonHref="/contact"
        />
      </main>
    </>
  );
}
