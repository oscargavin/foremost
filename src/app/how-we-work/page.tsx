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
  TiltCard,
  Highlight,
} from "@/components/ui";
import { FadeIn, StaggerChildren, StaggerItem, TextReveal } from "@/components/motion";
import { SchemaScript, breadcrumbs } from "@/components/seo";

export const metadata: Metadata = {
  title: "AI Consulting Process | Foremost",
  description:
    "Our AI consulting process builds leadership capability, not dependency. Deep partnerships and strategies that belong to you.",
  alternates: {
    canonical: "/how-we-work",
  },
  openGraph: {
    title: "AI Consulting Process | Foremost",
    description:
      "Our AI consulting process builds leadership capability, not dependency. Deep partnerships and strategies that belong to you.",
    url: "https://foremost.ai/how-we-work",
    type: "website",
    images: [
      {
        url: "https://foremost.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foremost.ai - AI Consulting Process",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Consulting Process | Foremost",
    description:
      "Our AI consulting process builds leadership capability, not dependency. Deep partnerships and strategies that belong to you.",
    images: ["https://foremost.ai/og-image.png"],
  },
};

const approaches = [
  {
    title: "We Listen First, Then Challenge",
    description:
      "We spend the first part of any engagement just listening. Then we push back on assumptions. If you wanted validation, you'd have hired a different firm.",
    highlight: "push back on assumptions",
  },
  {
    title: "The Strategy Is Yours, Not Ours",
    description:
      "We don't arrive with frameworks to sell. You know your business. We help you think through the AI implications clearly enough to make your own decisions.",
    highlight: "make your own decisions",
  },
  {
    title: "Deep Partnerships, Small Client Count",
    description:
      "We take on fewer clients than we could. This isn't a scaling business. Good advisory work requires attention, and attention is finite.",
    highlight: "attention is finite",
  },
];

export default function HowWeWorkPage() {
  return (
    <>
      <SchemaScript schema={breadcrumbs.howWeWork} />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <Section className="pt-32 pb-20">
          <Container>
            <div className="max-w-4xl">
              <Heading as="h1" size="hero" className="mb-6">
                <TextReveal>
                  Our AI Consulting Partnership Model
                </TextReveal>
              </Heading>
              <FadeIn delay={0.4}>
                <Text
                  variant="bodyLarge"
                  mono
                  className="max-w-xl text-foreground-muted"
                >
                  The goal is to make you better at this, not to make you need
                  us forever.
                </Text>
              </FadeIn>
            </div>
          </Container>
        </Section>

        {/* Philosophy Section */}
        <Section className="py-20" variant="card" pattern="grid-subtle" blend="elevated">
          <Container>
            <div className="max-w-3xl">
              <FadeIn>
                <SectionLabel className="mb-4">Our Philosophy</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-8">
                <TextReveal>We Build Relationships, Not Dependencies</TextReveal>
              </Heading>
              <FadeIn delay={0.3}>
                <Text variant="muted" className="text-lg leading-relaxed">
                  Most consultancies create dependency. That's their business
                  model. Ours is the opposite: build your internal capability
                  until <Highlight>you don't need us anymore</Highlight>.
                </Text>
              </FadeIn>
            </div>
          </Container>
        </Section>

        {/* Approach Cards */}
        <Section className="py-20" blend="border">
          <Container>
            <FadeIn>
              <SectionLabel className="mb-4">Our Approach</SectionLabel>
            </FadeIn>
            <Heading as="h2" size="section" className="mb-12">
              <TextReveal>How We Partner With You</TextReveal>
            </Heading>
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {approaches.map((approach, index) => {
                const parts = approach.description.split(approach.highlight);
                return (
                  <StaggerItem key={index}>
                    <TiltCard className="h-full">
                      <Card className="h-full p-6">
                        <CardContent className="p-0">
                          <span className="font-mono text-sm text-foreground-muted mb-3 block">
                            0{index + 1}
                          </span>
                          <Heading as="h3" size="card" className="mb-4">
                            {approach.title}
                          </Heading>
                          <Text variant="muted">
                            {parts[0]}
                            <Highlight>{approach.highlight}</Highlight>
                            {parts[1]}
                          </Text>
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </Container>
        </Section>

        {/* Commitment Section */}
        <Section className="py-20" variant="card" pattern="grid-subtle" blend="elevated">
          <Container>
            <div className="max-w-3xl">
              <FadeIn>
                <SectionLabel className="mb-4">What We Deliver</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-8">
                <TextReveal>Our Commitment to Your Success</TextReveal>
              </Heading>
              <FadeIn delay={0.3}>
                <div className="space-y-8">
                  <Text variant="muted" className="text-lg leading-relaxed">
                    Long engagements aren't a sign of success.{" "}
                    <Highlight>Your team knowing what to do without calling us</Highlight> is.
                  </Text>
                  <blockquote className="border-l-2 border-accent-orange pl-6 py-2">
                    <Text
                      as="p"
                      className="text-[24px] leading-[1.4] text-foreground italic"
                    >
                      When we leave, you should feel more capable. Not more
                      dependent.
                    </Text>
                  </blockquote>
                </div>
              </FadeIn>
            </div>
          </Container>
        </Section>

        {/* Explore More */}
        <Section className="py-20" blend="border">
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
                    The four beliefs that shape our advice
                  </Text>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/who-we-are" className="text-lg">
                    Who We Are
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Our story, approach, and team
                  </Text>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/contact" className="text-lg">
                    Get in Touch
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Start a conversation
                  </Text>
                </div>
              </StaggerItem>
            </StaggerChildren>
          </Container>
        </Section>

        {/* CTA Card */}
        <CTACard
          label="Get Started"
          topRightLink={{ text: "Contact", href: "/contact" }}
          heading="Ready to build capability, not dependency?"
          buttonText="Schedule a Discussion"
          buttonHref="/contact"
        />
      </main>
      <Footer />
    </>
  );
}
