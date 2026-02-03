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
  { name: "Professional Services", url: `${BASE_URL}/industries/professional-services` },
]);

const useCases = [
  {
    title: "Document Analysis & Review",
    description:
      "Review thousands of contracts in hours instead of weeks. AI surfaces key clauses, risks, anomalies. The expert still decides.",
  },
  {
    title: "Due Diligence Automation",
    description:
      "M&A due diligence without an army of juniors. AI finds material issues faster; partners spend time on judgement calls, not document review.",
  },
  {
    title: "Knowledge Management",
    description:
      "Decades of expertise trapped in emails and matter files. AI makes it searchable — new associates perform like five-year veterans.",
  },
  {
    title: "Client Insights & Relationship Intelligence",
    description:
      "Cross-selling opportunities hidden in client data. AI spots patterns across interactions; partners get briefed before meetings.",
  },
  {
    title: "Workflow Automation",
    description:
      "Time entry, document generation, client onboarding — grunt work that eats billable hours. Automate it; free people for work clients pay for.",
  },
];

const differentiators = [
  {
    title: "Confidentiality-First Approach",
    description:
      "Client confidentiality isn't optional. We design AI that respects ethical walls and keeps sensitive data where it belongs. Most vendors think about this too late.",
  },
  {
    title: "Knowledge Worker Expertise",
    description:
      "AI that tries to replace partners will fail. AI that makes them more effective will succeed. We know the difference.",
  },
  {
    title: "Partnership Economics",
    description:
      "We understand partnerships: the politics, compensation structures, reluctance to invest in things that benefit the next generation. We design around it.",
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
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <HeroSection variant="industry-professional">
          <Heading as="h1" size="hero" className="mb-6">
            <TextReveal>AI Advisory for Professional Services</TextReveal>
          </Heading>
          <FadeIn delay={0.4}>
            <Text
              variant="bodyLarge"
              mono
              className="max-w-xl text-foreground-muted"
            >
              AI advisory for firms where expertise is the product and
              confidentiality is non-negotiable.
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
                <TextReveal>AI Promises Much, But Professional Services Firms Face Unique Barriers</TextReveal>
              </Heading>
              <FadeIn delay={0.3}>
                <div className="space-y-6">
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Law firms and consultancies are built on human expertise —
                    smart people thinking hard about client problems. AI
                    challenges that model in uncomfortable ways.
                  </Text>
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Add partnership politics, confidentiality requirements, and
                    regulators watching closely. Most firms are stuck: scattered
                    pilots, no coherent strategy, growing pressure from clients
                    who assume you're already using AI.
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
                <SectionLabel className="mb-4">Use Cases</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-6">
                <TextReveal>AI Applications for Professional Services</TextReveal>
              </Heading>
              <FadeIn delay={0.4}>
                <Text variant="muted" className="text-lg max-w-2xl">
                  Where AI actually helps professional services firms, and what
                  it takes to make it work.
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
                <TextReveal>AI Advisory Built for Professional Services</TextReveal>
              </Heading>
              <FadeIn delay={0.4}>
                <Text variant="muted" className="text-lg max-w-2xl">
                  Why professional services firms work with us instead of
                  generalist technology consultancies.
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
                    How We Work
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Our partnership model and approach
                  </Text>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/how-we-think" className="text-lg">
                    How We Think
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    The beliefs that shape our advice
                  </Text>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/who-we-are" className="text-lg">
                    Who We Are
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Our story and team
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
          heading="AI changes how professional services work. Lead or follow."
          description="Founding clients work with us directly and pay less than those who come later."
          buttonText="Talk to Us"
          buttonHref="/contact"
        />
      </main>
    </>
  );
}
