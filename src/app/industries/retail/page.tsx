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
  { name: "Industries", url: `${BASE_URL}/industries` },
  { name: "Retail", url: `${BASE_URL}/industries/retail` },
]);

const useCases = [
  {
    title: "Demand Forecasting",
    description:
      "Better predictions mean less dead stock and fewer empty shelves. The models exist. Getting them to work with your data is the challenge.",
  },
  {
    title: "Personalisation at Scale",
    description:
      "Product recommendations that actually feel relevant. Done badly, it's creepy. Done well, customers buy more and come back.",
  },
  {
    title: "Inventory Optimisation",
    description:
      "Right stock, right place, right time. Sounds obvious. Most retailers still get it wrong because their systems don't talk to each other.",
  },
  {
    title: "Dynamic Pricing Intelligence",
    description:
      "Pricing that responds to demand in real-time. Works brilliantly online. Harder in stores. Either way, you need the data infrastructure first.",
  },
  {
    title: "Customer Experience Enhancement",
    description:
      "AI chatbots that don't infuriate customers. They're getting better. They still need careful design and human escalation paths.",
  },
];

const whyForemost = [
  {
    title: "Omnichannel Expertise",
    description:
      "Stores, e-commerce, marketplaces - they all have different data, different systems, different challenges. AI that works in one channel often breaks in another.",
  },
  {
    title: "Customer-Centric Approach",
    description:
      "AI that optimises operations but annoys customers is a bad trade. We start with what customers actually want, then figure out how AI helps deliver it.",
  },
  {
    title: "Practical Implementation Focus",
    description:
      "We've seen too many retail AI pilots that never scale. Our advice focuses on what actually works when you roll it out to hundreds of stores.",
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
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <Section className="pt-32 pb-20">
          <Container>
            <FadeIn>
              <div className="max-w-4xl">
                <SectionLabel className="mb-6">Retail</SectionLabel>
                <Heading as="h1" size="hero" className="mb-6">
                  AI Advisory for Retail
                </Heading>
                <Text
                  variant="bodyLarge"
                  mono
                  className="max-w-xl text-foreground-muted"
                >
                  AI advisory for retailers who want results, not impressive
                  demos.
                </Text>
              </div>
            </FadeIn>
          </Container>
        </Section>

        {/* Industry Challenge Section */}
        <Section className="py-20">
          <Container>
            <FadeIn>
              <div className="max-w-3xl">
                <SectionLabel className="mb-8">The Challenge</SectionLabel>
                <Heading as="h2" size="section" className="mb-8">
                  Retail Is Being Reshaped by AI
                </Heading>
                <div className="space-y-6">
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Customers expect everything to be seamless, personalised, and
                    instant. They don't care that your systems are held together
                    with duct tape. They just leave.
                  </Text>
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Meanwhile, margins are shrinking, supply chains are
                    unpredictable, and your competitors are talking about AI
                    transformations. Most of them are struggling to get past the
                    pilot stage, but you can't afford to assume you have time.
                  </Text>
                  <Text
                    as="p"
                    className="text-[24px] leading-[1.4] text-foreground"
                  >
                    AI will reshape retail. The question is whether you're
                    driving that change or reacting to it.
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
                Retail AI Use Cases That Drive Value
              </Heading>
              <Text variant="muted" className="max-w-2xl mb-12">
                Where AI actually improves retail performance, and what it takes
                to make it work.
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
                Retail AI Advisory That Delivers
              </Heading>
            </FadeIn>
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
                    Our partnership model for retail transformation
                  </Text>
                </div>
                <div>
                  <LinkWithArrow href="/how-we-think" className="text-lg">
                    How We Think
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    The principles guiding our AI advisory
                  </Text>
                </div>
                <div>
                  <LinkWithArrow href="/who-we-are" className="text-lg">
                    Who We Are
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Meet the team behind Foremost
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
