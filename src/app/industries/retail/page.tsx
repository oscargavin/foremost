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
  title: "AI Consulting for Retail & E-commerce | Foremost",
  description:
    "Expert AI consulting for retail and e-commerce. Transform your business with demand forecasting, personalisation, and inventory optimisation.",
  alternates: {
    canonical: "/industries/retail",
  },
  openGraph: {
    title: "AI Consulting for Retail & E-commerce | Foremost",
    description:
      "Expert AI consulting for retail. Demand forecasting, personalisation, and inventory optimisation for e-commerce.",
    url: "https://foremost.ai/industries/retail",
    type: "website",
    images: [
      {
        url: "https://foremost.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foremost.ai - AI Consulting for Retail",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Consulting for Retail & E-commerce | Foremost",
    description:
      "Expert AI consulting for retail and e-commerce. Transform your business with demand forecasting, personalisation, and customer experience solutions.",
    images: ["https://foremost.ai/og-image.png"],
  },
};

const retailBreadcrumbs = generateBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Retail", url: `${BASE_URL}/industries/retail` },
]);

const useCases = [
  {
    title: "Demand Forecasting",
    description:
      "Better predictions mean less dead stock and fewer empty shelves. The models exist; getting them to work with your data is the challenge.",
  },
  {
    title: "Personalisation at Scale",
    description:
      "Product recommendations that feel relevant. Done badly, it's creepy. Done well, customers buy more and return.",
  },
  {
    title: "Inventory Optimisation",
    description:
      "Right stock, right place, right time. Sounds obvious — most retailers still get it wrong because their systems don't talk.",
  },
  {
    title: "Dynamic Pricing Intelligence",
    description:
      "Pricing that responds to demand in real-time. Works brilliantly online, harder in stores. Either way, data infrastructure comes first.",
  },
  {
    title: "Customer Experience Enhancement",
    description:
      "AI chatbots that don't infuriate customers. They're getting better, but still need careful design and human escalation paths.",
  },
];

const whyForemost = [
  {
    title: "Omnichannel Expertise",
    description:
      "Stores, e-commerce, marketplaces — different data, different systems, different challenges. AI that works in one channel often breaks in another.",
  },
  {
    title: "Customer-Centric Approach",
    description:
      "AI that optimises operations but annoys customers is a bad trade. We start with what customers want, then figure out how AI delivers it.",
  },
  {
    title: "Practical Implementation Focus",
    description:
      "We've seen too many retail AI pilots that never scale. Our advice focuses on what works when you roll it out to hundreds of stores.",
  },
];

const relatedIndustries = [
  {
    title: "Manufacturing",
    description: "AI advisory for supply chain optimisation and operational efficiency across your value chain.",
    href: "/industries/manufacturing",
  },
  {
    title: "Financial Services",
    description: "AI consulting for customer analytics, fraud detection, and personalisation at scale.",
    href: "/industries/financial-services",
  },
];

export default function RetailIndustryPage() {
  return (
    <>
      <SchemaScript schema={retailBreadcrumbs} />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <HeroSection variant="industry-retail">
          <Heading as="h1" size="hero" className="mb-6">
            <TextReveal>AI Advisory for Retail</TextReveal>
          </Heading>
          <FadeIn delay={0.4}>
            <Text
              variant="bodyLarge"
              mono
              className="max-w-xl text-foreground-muted"
            >
              AI advisory for retailers who want results, not impressive
              demos.
            </Text>
          </FadeIn>
        </HeroSection>

        {/* Industry Challenge Section */}
        <Section className="py-20" pattern="grid-subtle" blend="border">
          <Container>
            <div className="max-w-3xl">
              <FadeIn>
                <SectionLabel className="mb-8">The Challenge</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-8">
                <TextReveal>Retail Is Being Reshaped by AI</TextReveal>
              </Heading>
              <FadeIn delay={0.3}>
                <div className="space-y-6">
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Customers expect seamless, personalised, instant. They don't
                    care that your systems are held together with duct tape.
                    They just leave.
                  </Text>
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Meanwhile, margins shrink, supply chains are unpredictable,
                    and competitors talk about AI transformations. Most struggle
                    past the pilot stage, but you can't assume you have time.
                  </Text>
                  <Text
                    as="p"
                    className="text-[24px] leading-[1.4] text-foreground"
                  >
                    AI will reshape retail. The question is whether you're
                    driving change or reacting to it.
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
                <SectionLabel className="mb-4">AI Applications</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-6">
                <TextReveal>Retail AI Use Cases That Drive Value</TextReveal>
              </Heading>
              <FadeIn delay={0.4}>
                <Text variant="muted" className="max-w-2xl">
                  Where AI actually improves retail performance, and what it takes
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
              <Heading as="h2" size="section">
                <TextReveal>Retail AI Advisory That Delivers</TextReveal>
              </Heading>
            </div>
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {whyForemost.map((reason, index) => (
                <StaggerItem key={index}>
                  <Card className="h-full p-6">
                    <CardContent className="p-0">
                      <Heading as="h3" size="card" className="mb-4">
                        {reason.title}
                      </Heading>
                      <Text variant="muted">{reason.description}</Text>
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
                    Our partnership model for retail transformation
                  </Text>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/how-we-think" className="text-lg">
                    How We Think
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    The principles guiding our AI advisory
                  </Text>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/who-we-are" className="text-lg">
                    Who We Are
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Meet the team behind Foremost
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
          heading="Retail moves fast. So does AI. You should too."
          description="Founding clients work with us directly and pay less than those who come later."
          buttonText="Talk to Us"
          buttonHref="/contact"
        />
      </main>
    </>
  );
}
