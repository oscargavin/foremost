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
      "AI that helps clinicians, not replaces them. The goal is better diagnoses, faster. The clinician always has final say.",
  },
  {
    title: "Drug Discovery & Development",
    description:
      "Molecule screening and trial optimisation that actually speeds up R&D. Pharma companies waste years on dead ends - AI can help avoid some of them.",
  },
  {
    title: "Patient Flow Optimisation",
    description:
      "Bed management and scheduling that reduces waiting times. Sounds simple. Getting it to work with NHS systems is not.",
  },
  {
    title: "Medical Imaging Analysis",
    description:
      "AI-assisted radiology that catches things humans miss. Already proven to work. The challenge is deployment and trust.",
  },
  {
    title: "Predictive Diagnostics",
    description:
      "Identifying patients at risk before they deteriorate. Intervention is cheaper than emergency care. The data to do this already exists.",
  },
];

const whyForemost = [
  {
    title: "Patient Safety First",
    description:
      "Healthcare AI that harms patients is worse than no AI at all. We start every conversation with duty of care, not efficiency metrics.",
  },
  {
    title: "Regulatory Compliance",
    description:
      "MHRA, NHS Digital, EU MDR - we know what these bodies actually require. Most AI projects fail regulatory review because nobody thought about it early enough.",
  },
  {
    title: "Ethical AI by Design",
    description:
      "Bias in healthcare AI has real consequences. We build in fairness checks from the start, not as an afterthought.",
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
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <Section className="pt-32 pb-20">
          <Container>
            <FadeIn>
              <div className="max-w-4xl">
                <SectionLabel className="mb-6">Healthcare</SectionLabel>
                <Heading as="h1" size="hero" className="mb-6">
                  AI Advisory for Healthcare
                </Heading>
                <Text
                  variant="bodyLarge"
                  mono
                  className="max-w-xl text-foreground-muted"
                >
                  AI advisory for healthcare organisations where patient safety
                  comes before efficiency gains.
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
                <SectionLabel className="mb-8">The Challenge</SectionLabel>
                <Heading as="h2" size="section" className="mb-8">
                  Healthcare AI Demands a Different Approach
                </Heading>
                <div className="space-y-6">
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Healthcare AI is different. Get it wrong and people get hurt.
                    NHS trusts can't just "move fast and break things". Pharma
                    companies face years of regulatory scrutiny. Healthtech startups
                    need clinical validation before they can scale.
                  </Text>
                  <Text variant="muted" className="text-lg leading-relaxed">
                    The technology vendors rarely mention this. They show demos.
                    They don't show what it takes to deploy safely in a clinical
                    environment.
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
                AI Applications in Healthcare
              </Heading>
              <Text variant="muted" className="max-w-2xl mb-12">
                Where AI actually works in healthcare, and what it takes to
                deploy it safely.
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
                Healthcare AI Consulting Built on Trust
              </Heading>
              <Text variant="muted" className="max-w-2xl mb-12">
                Why healthcare organisations choose us over generalist AI
                consultancies.
              </Text>
            </FadeIn>
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
                    Our partnership model for healthcare AI
                  </Text>
                </div>
                <div>
                  <LinkWithArrow href="/how-we-think" className="text-lg">
                    How We Think
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    The beliefs that guide our healthcare AI advice
                  </Text>
                </div>
                <div>
                  <LinkWithArrow href="/who-we-are" className="text-lg">
                    Who We Are
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Meet our healthcare AI advisory team
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
