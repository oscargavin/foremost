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
  title: "AI Consulting for Healthcare | Foremost",
  description:
    "Expert AI consulting for NHS trusts, pharmaceutical companies, and healthtech firms. Patient safety and regulatory compliance at the core.",
  alternates: {
    canonical: "/industries/healthcare",
  },
  openGraph: {
    title: "AI Consulting for Healthcare | Foremost",
    description:
      "Expert AI consulting for NHS trusts, pharma, and healthtech. Patient safety and regulatory compliance at the core.",
    url: `${BASE_URL}/industries/healthcare`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Foremost.ai - AI Consulting for Healthcare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Consulting for Healthcare | Foremost",
    description:
      "Expert AI consulting for healthcare. Helping NHS trusts, pharma, and healthtech implement AI with patient safety and compliance at the core.",
    images: [`${BASE_URL}/og-image.png`],
  },
};

const healthcareBreadcrumbs = generateBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Industries", url: `${BASE_URL}/industries` },
  { name: "Healthcare", url: `${BASE_URL}/industries/healthcare` },
]);

const useCases = [
  {
    title: "Clinical Decision Support",
    description:
      "AI that helps clinicians, not replaces them. Better diagnoses, faster — but the clinician decides.",
  },
  {
    title: "Drug Discovery & Development",
    description:
      "Molecule screening and trial optimisation that speeds up R&D. Pharma companies waste years on dead ends; AI helps avoid some.",
  },
  {
    title: "Patient Flow Optimisation",
    description:
      "Bed management and scheduling that cuts waiting times. Sounds simple — getting it to work with NHS systems isn't.",
  },
  {
    title: "Medical Imaging Analysis",
    description:
      "AI-assisted radiology that catches what humans miss. Proven to work; the challenge is deployment and trust.",
  },
  {
    title: "Predictive Diagnostics",
    description:
      "Identifying at-risk patients before they deteriorate. Intervention beats emergency care. The data already exists.",
  },
];

const whyForemost = [
  {
    title: "Patient Safety First",
    description:
      "Healthcare AI that harms patients is worse than none. We start every conversation with duty of care, not efficiency metrics.",
  },
  {
    title: "Regulatory Compliance",
    description:
      "MHRA, NHS Digital, EU MDR — we know what these bodies require. Most AI projects fail regulatory review because nobody thought about it early.",
  },
  {
    title: "Ethical AI by Design",
    description:
      "Bias in healthcare AI has real consequences. We build fairness checks from the start, not as an afterthought.",
  },
];

const relatedIndustries = [
  {
    title: "Financial Services",
    description: "AI advisory for highly regulated industries with similar compliance and data protection requirements.",
    href: "/industries/financial-services",
  },
  {
    title: "Professional Services",
    description: "AI consulting for knowledge-intensive organisations where expertise and judgement are paramount.",
    href: "/industries/professional-services",
  },
];

export default function HealthcarePage() {
  return (
    <>
      <SchemaScript schema={healthcareBreadcrumbs} />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <HeroSection variant="industry-healthcare">
          <Heading as="h1" size="hero" className="mb-6">
            <TextReveal>AI Advisory for Healthcare</TextReveal>
          </Heading>
          <FadeIn delay={0.4}>
            <Text
              variant="bodyLarge"
              mono
              className="max-w-xl text-foreground-muted"
            >
              AI advisory for healthcare organisations where patient safety
              comes before efficiency gains.
            </Text>
          </FadeIn>
        </HeroSection>

        {/* Industry Challenges Section */}
        <Section className="py-20" pattern="grid-subtle" blend="border">
          <Container>
            <div className="max-w-3xl">
              <FadeIn>
                <SectionLabel className="mb-8">The Challenge</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-8">
                <TextReveal>Healthcare AI Demands a Different Approach</TextReveal>
              </Heading>
              <FadeIn delay={0.3}>
                <div className="space-y-6">
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Healthcare AI is different — get it wrong and people get hurt.
                    NHS trusts can't "move fast and break things." Pharma
                    companies face years of regulatory scrutiny. Healthtech startups
                    need clinical validation before they scale.
                  </Text>
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Vendors rarely mention this. They show demos, not what it
                    takes to deploy safely in a clinical environment.
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
                <TextReveal>AI Applications in Healthcare</TextReveal>
              </Heading>
              <FadeIn delay={0.4}>
                <Text variant="muted" className="max-w-2xl">
                  Where AI actually works in healthcare, and what it takes to
                  deploy it safely.
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
                <TextReveal>Healthcare AI Consulting Built on Trust</TextReveal>
              </Heading>
              <FadeIn delay={0.4}>
                <Text variant="muted" className="max-w-2xl">
                  Why healthcare organisations choose us over generalist AI
                  consultancies.
                </Text>
              </FadeIn>
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
                  <LinkWithArrow href="/how-we-work" className="text-lg">
                    How We Work
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Our partnership model for healthcare AI
                  </Text>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/how-we-think" className="text-lg">
                    How We Think
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    The beliefs that guide our healthcare AI advice
                  </Text>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/who-we-are" className="text-lg">
                    Who We Are
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Meet our healthcare AI advisory team
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
          heading="Healthcare AI moves fast. Better to lead than chase."
          description="Founding clients work with us directly and pay less than those who come later."
          buttonText="Talk to Us"
          buttonHref="/contact"
        />
      </main>
    </>
  );
}
