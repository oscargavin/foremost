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
  title: "AI Consulting for Financial Services | Foremost",
  description:
    "Expert AI consulting for banks, asset managers, and insurers. We bring regulatory expertise and a security-first approach to AI adoption.",
  alternates: {
    canonical: "/industries/financial-services",
  },
  openGraph: {
    title: "AI Consulting for Financial Services | Foremost",
    description:
      "Expert AI consulting for banks, asset managers, and insurers. Regulatory expertise and security-first AI adoption.",
    url: "https://foremost.ai/industries/financial-services",
    type: "website",
    images: [
      {
        url: "https://foremost.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foremost.ai - AI Consulting for Financial Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Consulting for Financial Services | Foremost",
    description:
      "Expert AI consulting for financial services. Regulatory expertise, security-first approach, and measurable outcomes.",
    images: ["https://foremost.ai/og-image.png"],
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Financial Services", url: `${BASE_URL}/industries/financial-services` },
]);

const useCases = [
  {
    title: "Risk Modelling & Credit Assessment",
    description:
      "AI that improves credit decisions while staying explainable for regulators. The hard part isn't the algorithm — it's proving fairness.",
  },
  {
    title: "Fraud Detection & Prevention",
    description:
      "Real-time detection that catches sophisticated schemes without drowning your team in false positives. Balance is tricky.",
  },
  {
    title: "Algorithmic Trading & Market Analysis",
    description:
      "AI that processes market data faster than humans. The question is whether risk management keeps up.",
  },
  {
    title: "Regulatory Compliance & Reporting",
    description:
      "KYC/AML processes that adapt when regulations change. Most compliance AI breaks the moment rules shift.",
  },
  {
    title: "Customer Analytics & Personalisation",
    description:
      "Product recommendations based on actual behaviour. Done right, improves retention. Done wrong, irritates customers.",
  },
  {
    title: "Claims Processing & Underwriting",
    description:
      "Faster insurance decisions without unfair outcomes. The FCA cares about both.",
  },
];

const differentiators = [
  {
    title: "Deep Regulatory Expertise",
    description:
      "FCA, PRA, MiFID II, GDPR — we know what regulators actually care about. Generic AI advice that ignores compliance is useless.",
  },
  {
    title: "Security-First Approach",
    description:
      "Financial services have strict security requirements for good reason. We design AI strategies your CISO will approve.",
  },
  {
    title: "Board-Level Understanding",
    description:
      "We explain AI in terms boards understand: risk, return, capital allocation — not technical jargon.",
  },
];

const relatedIndustries = [
  {
    title: "Professional Services",
    description: "AI consulting for law firms, accounting practices, and consultancies with similar compliance and confidentiality requirements.",
    href: "/industries/professional-services",
  },
  {
    title: "Healthcare",
    description: "AI advisory for organisations navigating complex regulatory environments and data sensitivity challenges.",
    href: "/industries/healthcare",
  },
];

export default function FinancialServicesPage() {
  return (
    <>
      <SchemaScript schema={breadcrumbSchema} />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <HeroSection variant="industry-financial">
          <Heading as="h1" size="hero" className="mb-6">
            <TextReveal>AI Advisory for Financial Services</TextReveal>
          </Heading>
          <FadeIn delay={0.4}>
            <Text
              variant="bodyLarge"
              mono
              className="max-w-xl text-foreground-muted"
            >
              AI advisory for banks, asset managers, and insurers who can't
              afford to get compliance wrong.
            </Text>
          </FadeIn>
        </HeroSection>

        {/* Challenge Section */}
        <Section className="py-20" pattern="grid-subtle" blend="border">
          <Container>
            <div className="max-w-3xl">
              <FadeIn>
                <SectionLabel className="mb-8">The Challenge</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-8">
                <TextReveal>AI Adoption in a Regulated Environment</TextReveal>
              </Heading>
              <FadeIn delay={0.3}>
                <div className="space-y-6">
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Financial services AI is harder than other sectors. The FCA
                    wants explainability; the PRA wants stability; customers
                    want instant everything. One compliance failure costs more
                    than ten successful projects saved.
                  </Text>
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Add legacy systems that predate the internet, data trapped
                    in silos, and a talent market where everyone competes for
                    the same people. Most AI pilots stall before production.
                  </Text>
                  <Text
                    as="p"
                    className="text-[24px] leading-[1.4] text-foreground"
                  >
                    The question is how to use AI without breaking anything.
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
                <SectionLabel className="mb-4">Industry Applications</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-6">
                <TextReveal>AI Use Cases for Financial Services</TextReveal>
              </Heading>
              <FadeIn delay={0.4}>
                <Text variant="muted" className="max-w-2xl">
                  Where AI actually helps in financial services, and what it takes
                  to make it work.
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
                <SectionLabel className="mb-4">Why Foremost</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-6">
                <TextReveal>Your Partner for Financial Services AI</TextReveal>
              </Heading>
              <FadeIn delay={0.4}>
                <Text variant="muted" className="max-w-2xl">
                  Why financial services firms work with us instead of generalist
                  consultancies.
                </Text>
              </FadeIn>
            </div>
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
                    The beliefs that shape our AI advisory
                  </Text>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/how-we-think" className="text-lg">
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
          heading="In financial services, fast followers still lose."
          description="Founding clients work with us directly and pay less than those who come later."
          buttonText="Talk to Us"
          buttonHref="/contact"
        />
      </main>
    </>
  );
}
