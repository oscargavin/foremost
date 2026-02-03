import { Metadata } from "next";
import { Container, Section } from "@/components/layout";
import {
  Heading,
  Text,
  SectionLabel,
  LinkWithArrow,
  CTACard,
  Card,
  CardContent,
  TiltCard,
  Highlight,
  HeroSection,
} from "@/components/ui";
import { FadeIn, StaggerChildren, StaggerItem, TextReveal } from "@/components/motion";
import { SchemaScript, breadcrumbs } from "@/components/seo";

export const metadata: Metadata = {
  title: "AI Consulting Careers - Join Our Advisory Team | Foremost",
  description:
    "Join Foremost and shape the future of board-level AI advisory. We seek strategic thinkers who value clarity, rigour, and meaningful impact.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "AI Consulting Careers - Join Our Advisory Team | Foremost",
    description:
      "Join Foremost and shape the future of board-level AI advisory. We seek strategic thinkers who value clarity, rigour, and meaningful impact.",
    url: "https://foremost.ai/careers",
    type: "website",
    images: [
      {
        url: "https://foremost.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foremost.ai - AI Consulting Careers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Consulting Careers - Join Our Advisory Team | Foremost",
    description:
      "Join Foremost and shape the future of board-level AI advisory. We seek strategic thinkers who value clarity and impact.",
    images: ["https://foremost.ai/og-image.png"],
  },
};

const qualities = [
  {
    title: "Clear Communicators",
    description:
      "People who explain complex things simply. If you can't make a board understand it, you don't understand it.",
    highlight: "explain complex things simply",
  },
  {
    title: "Active Listeners",
    description:
      "Advisors who listen more than they talk. The client knows their business; you're there to help them think, not show off.",
    highlight: "help them think",
  },
  {
    title: "Results-Focused",
    description:
      "People frustrated by impressive slides that change nothing. Outcomes matter, not outputs.",
    highlight: "Outcomes matter, not outputs",
  },
  {
    title: "Internationally Mobile",
    description:
      "Happy working across the UK and Europe. Travel is part of the job.",
    highlight: "Travel is part of the job",
  },
];

export default function CareersPage() {
  return (
    <>
      <SchemaScript schema={breadcrumbs.careers} />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <HeroSection variant="careers">
          <Heading as="h1" size="hero" className="mb-6">
            <TextReveal>Join Foremost.</TextReveal>
          </Heading>
          <FadeIn delay={0.4}>
            <Text
              variant="bodyLarge"
              mono
              className="max-w-xl text-foreground-muted"
            >
              We're looking for people who'd rather give honest advice than impressive presentations.
            </Text>
          </FadeIn>
        </HeroSection>

        {/* Introduction */}
        <Section className="py-28" variant="card" pattern="grid-subtle" blend="elevated">
          <Container>
            <div className="max-w-3xl">
              <FadeIn>
                <SectionLabel className="mb-4">The Opportunity</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-8">
                <TextReveal>Advisory that matters</TextReveal>
              </Heading>
              <FadeIn delay={0.3}>
                <Text variant="muted" className="text-lg leading-relaxed">
                  We advise boards and executives on AI — the technology and the organisational reality. The politics, the fear, the concerns that never make it into strategy documents. If you're good at <Highlight>reading rooms and cutting through noise</Highlight>, we should talk.
                </Text>
              </FadeIn>
            </div>
          </Container>
        </Section>

        {/* What We Look For */}
        <Section className="py-20" blend="border">
          <Container>
            <FadeIn>
              <SectionLabel className="mb-4">Candidate Profile</SectionLabel>
            </FadeIn>
            <Heading as="h2" size="section" className="mb-12">
              <TextReveal>What We Look For</TextReveal>
            </Heading>

            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {qualities.map((quality, index) => {
                const parts = quality.description.split(quality.highlight);
                return (
                  <StaggerItem key={index}>
                    <TiltCard className="h-full">
                      <Card className="h-full p-6">
                        <CardContent className="p-0">
                          <div className="w-10 h-10 rounded-lg bg-accent-orange/10 flex items-center justify-center mb-4">
                            <span className="text-accent-orange font-mono text-sm font-medium">
                              0{index + 1}
                            </span>
                          </div>
                          <Heading as="h3" size="card" className="mb-3">
                            {quality.title}
                          </Heading>
                          <Text variant="muted">
                            {parts[0]}
                            <Highlight>{quality.highlight}</Highlight>
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

        {/* Culture */}
        <Section className="py-20" variant="card" pattern="grid-subtle" blend="elevated">
          <Container>
            <div className="max-w-3xl">
              <FadeIn>
                <SectionLabel className="mb-4">Working at Foremost</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-8">
                <TextReveal>Our Culture</TextReveal>
              </Heading>
              <FadeIn delay={0.3}>
                <Text
                  as="p"
                  className="text-[24px] leading-[1.4] text-foreground mb-6"
                >
                  Small team. No layers. Direct work with clients who actually want <Highlight>honest advice, not validation</Highlight>.
                </Text>
              </FadeIn>
              <FadeIn delay={0.5}>
                <Text variant="muted" className="text-lg">
                  Sound interesting? Get in touch.
                </Text>
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
                  <LinkWithArrow href="/who-we-are" className="text-lg">
                    Who We Are
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Our story, approach, and values
                  </Text>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/how-we-think" className="text-lg">
                    How We Think
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    The beliefs that guide our work
                  </Text>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/how-we-work" className="text-lg">
                    How We Work
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Our partnership approach
                  </Text>
                </div>
              </StaggerItem>
            </StaggerChildren>
          </Container>
        </Section>

        {/* CTA Card */}
        <CTACard
          label="Join Us"
          topRightLink={{ text: "Contact", href: "/contact" }}
          heading="Think you'd fit? Let's talk."
          buttonText="Get in Touch"
          buttonHref="/contact"
        />
      </main>
    </>
  );
}
