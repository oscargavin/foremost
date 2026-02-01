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
  title: "AI Consulting for Professional Services | Foremost",
  description:
    "Expert AI consulting for law firms, accounting practices, and consultancies. Document analysis and knowledge management.",
  keywords: [
    "AI consulting for professional services",
    "AI for law firms",
    "AI for accounting firms",
    "legal AI consulting",
    "professional services AI strategy",
    "document analysis AI",
    "due diligence automation",
  ],
  alternates: {
    canonical: "/industries/professional-services",
  },
  openGraph: {
    title: "AI Consulting for Professional Services | Foremost",
    description:
      "Expert AI consulting for law firms, accounting practices, and consultancies. Document analysis and knowledge management.",
    url: `${BASE_URL}/industries/professional-services`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Foremost.ai - AI Consulting for Professional Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Consulting for Professional Services | Foremost",
    description:
      "Expert AI consulting for law firms, accounting practices, and consultancies. Document analysis, due diligence automation, and knowledge management.",
    images: [`${BASE_URL}/og-image.png`],
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Industries", url: `${BASE_URL}/industries` },
  { name: "Professional Services", url: `${BASE_URL}/industries/professional-services` },
]);

const useCases = [
  {
    title: "Document Analysis & Review",
    description:
      "Review thousands of contracts in hours instead of weeks. AI surfaces key clauses, risks, and anomalies. The expert still makes the call.",
  },
  {
    title: "Due Diligence Automation",
    description:
      "M&A due diligence that doesn't require an army of juniors. AI finds the material issues faster. Partners spend time on judgement calls, not document review.",
  },
  {
    title: "Knowledge Management",
    description:
      "Decades of expertise trapped in emails and matter files. AI makes it searchable. New associates perform like five-year veterans.",
  },
  {
    title: "Client Insights & Relationship Intelligence",
    description:
      "Cross-selling opportunities hidden in client data. AI spots patterns across interactions. Partners get briefed before meetings.",
  },
  {
    title: "Workflow Automation",
    description:
      "Time entry, document generation, client onboarding - grunt work that eats billable hours. Automate it. Free up people for work clients actually pay for.",
  },
];

const differentiators = [
  {
    title: "Confidentiality-First Approach",
    description:
      "Client confidentiality isn't optional. We design AI solutions that respect ethical walls and keep sensitive data where it belongs. Most vendors don't think about this until it's too late.",
  },
  {
    title: "Knowledge Worker Expertise",
    description:
      "AI that tries to replace partners will fail. AI that makes them more effective will succeed. We know the difference.",
  },
  {
    title: "Partnership Economics",
    description:
      "We understand how partnerships work: the politics, the compensation structures, the reluctance to invest in things that benefit the next generation. We design around it.",
  },
];

const relatedIndustries = [
  {
    title: "Financial Services",
    description: "AI advisory for regulated industries with similar confidentiality and compliance requirements.",
    href: "/industries/financial-services",
  },
  {
    title: "Healthcare",
    description: "AI consulting for organisations where expertise, judgement, and ethical considerations are paramount.",
    href: "/industries/healthcare",
  },
];

export default function ProfessionalServicesPage() {
  return (
    <>
      <SchemaScript schema={breadcrumbSchema} />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <Section className="pt-32 pb-20">
          <Container>
            <FadeIn>
              <div className="max-w-4xl">
                <SectionLabel className="mb-6">Industries</SectionLabel>
                <Heading as="h1" size="hero" className="mb-6">
                  AI Advisory for Professional Services
                </Heading>
                <Text
                  variant="bodyLarge"
                  mono
                  className="max-w-xl text-foreground-muted"
                >
                  AI advisory for firms where expertise is the product and
                  confidentiality is non-negotiable.
                </Text>
              </div>
            </FadeIn>
          </Container>
        </Section>

        {/* Challenge Section */}
        <Section className="py-20" pattern="grid-subtle" blend="border">
          <Container>
            <FadeIn>
              <div className="max-w-3xl">
                <SectionLabel className="mb-8">The Challenge</SectionLabel>
                <Heading as="h2" size="section" className="mb-8">
                  AI Promises Much, But Professional Services Firms Face Unique Barriers
                </Heading>
                <div className="space-y-6">
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Law firms and consultancies are built on human expertise. The
                    business model is: smart people thinking hard about client
                    problems. AI challenges that model in uncomfortable ways.
                  </Text>
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Add partnership politics, client confidentiality requirements,
                    and regulators watching closely, and you understand why most
                    firms are stuck. Scattered pilots. No coherent strategy.
                    Growing pressure from clients who assume you're already using
                    AI.
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
              <SectionLabel className="mb-4">Use Cases</SectionLabel>
              <Heading as="h2" size="section" className="mb-6">
                AI Applications for Professional Services
              </Heading>
              <Text variant="muted" className="text-lg mb-12 max-w-2xl">
                Where AI actually helps professional services firms, and what
                it takes to make it work.
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
              <Heading as="h2" size="section" className="mb-6">
                AI Advisory Built for Professional Services
              </Heading>
              <Text variant="muted" className="text-lg mb-12 max-w-2xl">
                Why professional services firms work with us instead of
                generalist technology consultancies.
              </Text>
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
