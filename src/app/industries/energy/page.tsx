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
} from "@/components/ui";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion";
import { SchemaScript, generateBreadcrumbSchema } from "@/components/seo";

const BASE_URL = "https://foremost.ai";

export const metadata: Metadata = {
  title: "AI Consulting for Energy & Utilities | Foremost",
  description:
    "Strategic AI consulting for utilities, oil & gas, and renewable energy. Expert advisory on grid optimization, predictive maintenance, and sustainability.",
  alternates: {
    canonical: "/industries/energy",
  },
  openGraph: {
    title: "AI Consulting for Energy & Utilities | Foremost",
    description:
      "Strategic AI consulting for utilities, oil & gas, and renewables. Grid optimization and predictive maintenance.",
    url: "https://foremost.ai/industries/energy",
    type: "website",
    images: [
      {
        url: "https://foremost.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foremost.ai - AI Consulting for Energy Industry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Consulting for Energy & Utilities | Foremost",
    description:
      "Strategic AI consulting for utilities, oil & gas, and renewable energy companies. Grid optimization, predictive maintenance, and sustainability analytics.",
    images: ["https://foremost.ai/og-image.png"],
  },
};

const energyBreadcrumbs = generateBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Industries", url: `${BASE_URL}/industries` },
  { name: "Energy", url: `${BASE_URL}/industries/energy` },
]);

const useCases = [
  {
    title: "Grid Optimization",
    description:
      "Balance supply and demand in real-time as renewables and EVs make the grid more complex. Traditional approaches can't keep up. AI can.",
  },
  {
    title: "Predictive Maintenance",
    description:
      "Turbines, transformers, substations - fix them before they fail. The ROI is clear. Getting the sensor data is the challenge.",
  },
  {
    title: "Energy Trading",
    description:
      "Better price forecasting and market analysis. AI spots patterns humans miss. The winners in energy trading are already using it.",
  },
  {
    title: "Demand Forecasting",
    description:
      "More accurate predictions of energy consumption. Weather, events, economic shifts - AI handles the complexity. Reduces procurement costs.",
  },
  {
    title: "Asset Management",
    description:
      "Where to invest when you're managing aging infrastructure and new renewables. AI helps prioritise across a complex portfolio.",
  },
  {
    title: "Sustainability Analytics",
    description:
      "Track and report carbon emissions accurately. Regulators want it. Investors want it. AI makes it practical at scale.",
  },
];

const differentiators = [
  {
    title: "Infrastructure Expertise",
    description:
      "Assets that last decades, systems that predate the internet, regulations that change every year. We understand what it takes to deploy AI in this environment.",
  },
  {
    title: "Safety-Critical Systems Focus",
    description:
      "Grid failures and equipment explosions are not acceptable failure modes. We evaluate AI through the lens of what happens when it goes wrong.",
  },
  {
    title: "Regulatory Navigation",
    description:
      "OFGEM, EU regulations, market structures - we help leadership understand where AI governance overlaps with energy compliance. Most consultancies don't.",
  },
];

const relatedIndustries = [
  {
    title: "Manufacturing",
    description: "AI advisory for asset-intensive industries with similar predictive maintenance and operational optimisation needs.",
    href: "/industries/manufacturing",
  },
  {
    title: "Financial Services",
    description: "AI consulting for trading, risk modelling, and regulatory compliance in complex market environments.",
    href: "/industries/financial-services",
  },
];

export default function EnergyIndustryPage() {
  return (
    <>
      <SchemaScript schema={energyBreadcrumbs} />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <Section className="pt-32 pb-20">
          <Container>
            <FadeIn>
              <div className="max-w-4xl">
                <SectionLabel className="mb-6">Energy Industry</SectionLabel>
                <Heading as="h1" size="hero" className="mb-6">
                  AI Advisory for Energy
                </Heading>
                <Text
                  variant="bodyLarge"
                  mono
                  className="max-w-xl text-foreground-muted"
                >
                  AI advisory for energy companies balancing grid reliability
                  with the pressure to decarbonise.
                </Text>
              </div>
            </FadeIn>
          </Container>
        </Section>

        {/* Industry Challenges Section */}
        <Section className="py-20">
          <Container>
            <FadeIn>
              <div className="max-w-3xl">
                <SectionLabel className="mb-8">Industry Context</SectionLabel>
                <Heading as="h2" size="section" className="mb-8">
                  The AI Imperative in Energy
                </Heading>
                <div className="space-y-6">
                  <Text variant="muted" className="text-lg leading-relaxed">
                    The grid is getting more complex every year. Renewables,
                    distributed generation, EVs, storage - traditional planning
                    tools can't keep up. Add aging infrastructure, volatile prices,
                    and regulators demanding net zero, and something has to give.
                  </Text>
                  <Text variant="muted" className="text-lg leading-relaxed">
                    AI can help, but energy is different from other sectors.
                    Grid failures aren't acceptable. Safety margins matter.
                    Moving fast and breaking things is not an option.
                  </Text>
                  <Text
                    as="p"
                    className="text-[24px] leading-[1.4] text-foreground"
                  >
                    We help energy leaders figure out where AI actually helps,
                    and how to deploy it without taking unacceptable risks.
                  </Text>
                </div>
              </div>
            </FadeIn>
          </Container>
        </Section>

        {/* Use Cases Section */}
        <Section className="py-20" variant="card" pattern="grid-subtle" blend="elevated">
          <Container>
            <FadeIn>
              <SectionLabel className="mb-4">AI Applications</SectionLabel>
              <Heading as="h2" size="section" className="mb-6">
                Industry-Specific Use Cases
              </Heading>
              <Text variant="muted" className="max-w-2xl mb-12">
                Where AI actually improves energy operations, and what it takes
                to deploy it safely.
              </Text>
            </FadeIn>
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
            <FadeIn>
              <SectionLabel className="mb-4">Why Foremost</SectionLabel>
              <Heading as="h2" size="section" className="mb-12">
                AI Advisory Built for Energy
              </Heading>
            </FadeIn>
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {differentiators.map((item, index) => (
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
              <Heading as="h2" size="section" className="mb-8">
                AI Advisory for Similar Sectors
              </Heading>
            </FadeIn>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <div>
                  <LinkWithArrow href="/how-we-work" className="text-lg">
                    How We Work
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Our partnership model and approach
                  </Text>
                </div>
                <div>
                  <LinkWithArrow href="/how-we-think" className="text-lg">
                    How We Think
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    The beliefs that shape our advice
                  </Text>
                </div>
                <div>
                  <LinkWithArrow href="/who-we-are" className="text-lg">
                    Who We Are
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Our story and team
                  </Text>
                </div>
              </div>
            </FadeIn>
          </Container>
        </Section>

        {/* CTA Card */}
        <CTACard
          label="Get Started"
          topRightLink={{ text: "Contact", href: "/contact" }}
          heading="Ready to navigate AI with confidence?"
          buttonText="Schedule a Discussion"
          buttonHref="/contact"
        />
      </main>
      <Footer />
    </>
  );
}
