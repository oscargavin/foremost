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
  WhoWeAreAnimation,
} from "@/components/ui";
import { FadeIn, StaggerChildren, StaggerItem, TextReveal } from "@/components/motion";
import { SchemaScript, breadcrumbs, founderSchema } from "@/components/seo";

export const metadata: Metadata = {
  title: "Meet Our AI Consulting Team | Foremost",
  description:
    "Meet our AI consulting team built by practitioners, for leaders. We bring clarity, rigour, and integrity to board-level AI strategy.",
  alternates: {
    canonical: "/who-we-are",
  },
  openGraph: {
    title: "Meet Our AI Consulting Team | Foremost",
    description:
      "Meet our AI consulting team built by practitioners, for leaders. We bring clarity, rigour, and integrity to board-level AI strategy.",
    url: "https://foremost.ai/who-we-are",
    type: "website",
    images: [
      {
        url: "https://foremost.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foremost.ai - AI Consulting Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet Our AI Consulting Team | Foremost",
    description:
      "Meet our AI consulting team built by practitioners, for leaders. We bring clarity, rigour, and integrity to board-level AI strategy.",
    images: ["https://foremost.ai/og-image.png"],
  },
};

const differentiators = [
  {
    title: "We think in business outcomes, not technology features",
    description:
      "We don't care what's technically impressive. We care whether it moves your P&L or changes your business model.",
    highlight: "moves your P&L or changes your business model",
  },
  {
    title: "We build capability, not dependency",
    description:
      "A good engagement ends with you needing us less, not more. That's the only honest measure of success.",
    highlight: "needing us less, not more",
  },
  {
    title: "We speak truth to power",
    description:
      "If an AI initiative is a bad idea, we'll say so. Boards get enough people telling them what they want to hear.",
    highlight: "we'll say so",
  },
];

const values = [
  {
    name: "Clarity",
    description: "If we can't explain it simply, we don't understand it well enough.",
  },
  {
    name: "Rigour",
    description: "We follow the evidence, even when it's unfashionable.",
  },
  {
    name: "Integrity",
    description: "We'd rather lose the work than give bad advice.",
  },
  {
    name: "Impact",
    description:
      "Slide decks don't count. Did it change anything?",
  },
];

export default function WhoWeArePage() {
  return (
    <>
      <SchemaScript schema={[breadcrumbs.whoWeAre, founderSchema]} />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <Section className="pt-32 pb-20 relative overflow-hidden">
          <WhoWeAreAnimation />
          <Container className="relative z-10">
            <div className="max-w-2xl">
              <Heading as="h1" size="hero" className="mb-6">
                <TextReveal>
                  About Foremost: AI Advisory for Boards and Executives
                </TextReveal>
              </Heading>
              <FadeIn delay={0.4}>
                <Text
                  variant="bodyLarge"
                  mono
                  className="max-w-md text-foreground-muted"
                >
                  We help boards and executives make sense of AI. Not the hype.
                  The actual business implications.
                </Text>
              </FadeIn>
            </div>
          </Container>
        </Section>

        {/* Story Section */}
        <Section className="py-28" variant="card" pattern="grid-subtle" blend="elevated">
          <Container>
            <div className="max-w-3xl">
              <FadeIn>
                <SectionLabel className="mb-4">Our Story</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-8">
                <TextReveal>Built by practitioners, for leaders</TextReveal>
              </Heading>
              <FadeIn delay={0.3}>
                <div className="space-y-6">
                  <Text variant="muted" className="text-lg leading-relaxed">
                    We started Foremost because we kept seeing the same problem.
                    Boards drowning in AI pitches from vendors and consultants,
                    but nobody helping them think through what it actually meant
                    for their specific business. <Highlight>Everyone was selling solutions.
                    Nobody was helping them understand the problem.</Highlight>
                  </Text>
                  <Text variant="muted" className="text-lg leading-relaxed">
                    <Highlight>Most AI projects fail because of people, not technology.</Highlight>{" "}
                    The fears, the politics, the organisational dynamics that
                    nobody wants to talk about. That's where we spend most of
                    our time.
                  </Text>
                  <Text variant="muted" className="text-lg leading-relaxed">
                    UK and EU businesses need to get serious about AI or they'll
                    be left behind. We're here to help them do that without
                    making expensive mistakes.
                  </Text>
                </div>
              </FadeIn>
            </div>
          </Container>
        </Section>

        {/* Differentiators Section */}
        <Section className="py-20" blend="border">
          <Container>
            <FadeIn>
              <SectionLabel className="mb-4">Our Approach</SectionLabel>
            </FadeIn>
            <Heading as="h2" size="section" className="mb-12">
              <TextReveal>What makes us different</TextReveal>
            </Heading>

            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {differentiators.map((item, index) => {
                const parts = item.description.split(item.highlight);
                return (
                  <StaggerItem key={index}>
                    <TiltCard className="h-full">
                      <Card className="h-full p-6">
                        <CardContent className="p-0">
                          <span className="font-mono text-sm text-foreground-muted mb-3 block">
                            0{index + 1}
                          </span>
                          <Heading as="h3" size="card" className="mb-4">
                            {item.title}
                          </Heading>
                          <Text variant="muted">
                            {parts[0]}
                            <Highlight>{item.highlight}</Highlight>
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

        {/* Values Section */}
        <Section className="py-20" variant="card" pattern="grid-subtle" blend="elevated">
          <Container>
            <FadeIn>
              <SectionLabel className="mb-4">Our Values</SectionLabel>
            </FadeIn>
            <Heading as="h2" size="section" className="mb-12">
              <TextReveal>What we stand for</TextReveal>
            </Heading>

            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {values.map((value, index) => (
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
                          {value.name}
                        </Heading>
                        <Text variant="muted">
                          {value.description}
                        </Text>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </Container>
        </Section>

        {/* Team Section */}
        <Section className="py-20" blend="border">
          <Container>
            <FadeIn>
              <SectionLabel className="mb-4">Team</SectionLabel>
            </FadeIn>
            <Heading as="h2" size="section" className="mb-12">
              <TextReveal>Where rigorous thinking meets practical execution.</TextReveal>
            </Heading>

            <StaggerChildren className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <StaggerItem>
                <TiltCard className="h-full">
                  <Card className="h-full p-6">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-11 h-11 rounded-full bg-accent-orange/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-accent-orange font-mono text-base">VF</span>
                        </div>
                        <div>
                          <Heading as="h3" size="card" className="mb-0 text-lg">
                            Vitalij Farafonov
                          </Heading>
                          <Text
                            variant="small"
                            className="text-foreground-muted font-mono"
                          >
                            Founder & Managing Partner
                          </Text>
                        </div>
                      </div>
                      <Text variant="muted" className="text-sm flex-grow">
                        Spent years as a non-executive director watching boards
                        drown in AI pitches. Too much hype, not enough practical
                        guidance. Founded Foremost to fix that. MIT AI programme,
                        but more importantly, someone who's sat through the board
                        meetings and knows which questions actually matter.
                      </Text>
                      <div className="mt-5">
                        <LinkWithArrow
                          href="https://linkedin.com/in/vitalijfarafonov"
                          external
                        >
                          LinkedIn
                        </LinkWithArrow>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </StaggerItem>

              <StaggerItem>
                <TiltCard className="h-full">
                  <Card className="h-full p-6">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-11 h-11 rounded-full bg-accent-orange/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-accent-orange font-mono text-base">LO</span>
                        </div>
                        <div>
                          <Heading as="h3" size="card" className="mb-0 text-lg">
                            Larry Ockene
                          </Heading>
                          <Text
                            variant="small"
                            className="text-foreground-muted font-mono"
                          >
                            Co-founder
                          </Text>
                        </div>
                      </div>
                      <Text variant="muted" className="text-sm flex-grow">
                        Forty years building software at Amazon and Microsoft.
                        Led engineering and product teams through countless
                        "next big thing" cycles—he's seen what sticks and what
                        doesn't. Now helps companies figure out technology
                        strategy and get business, product, and engineering
                        teams actually talking to each other.
                      </Text>
                      <div className="mt-5">
                        <LinkWithArrow
                          href="https://linkedin.com/in/larryockene"
                          external
                        >
                          LinkedIn
                        </LinkWithArrow>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </StaggerItem>

              <StaggerItem>
                <TiltCard className="h-full">
                  <Card className="h-full p-6">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-11 h-11 rounded-full bg-accent-orange/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-accent-orange font-mono text-base">OG</span>
                        </div>
                        <div>
                          <Heading as="h3" size="card" className="mb-0 text-lg">
                            Oscar Gavin
                          </Heading>
                          <Text
                            variant="small"
                            className="text-foreground-muted font-mono"
                          >
                            Co-founder
                          </Text>
                        </div>
                      </div>
                      <Text variant="muted" className="text-sm flex-grow">
                        Building AI systems since 2019—everything from constraint
                        programming to the latest agentic architectures. Full stack
                        developer who's shipped LLM applications for UK and European
                        businesses. Particularly interested in how agents reason and
                        remember. Sheffield (BSc AI & CS), St Andrews (MSc AI).
                      </Text>
                      <div className="mt-5">
                        <LinkWithArrow
                          href="https://linkedin.com/in/oscargavin"
                          external
                        >
                          LinkedIn
                        </LinkWithArrow>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </StaggerItem>
            </StaggerChildren>
          </Container>
        </Section>

        {/* The Network Section */}
        <Section className="py-20" variant="card" blend="elevated">
          <Container>
            <div className="max-w-3xl">
              <FadeIn>
                <SectionLabel className="mb-4">The Network</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-8">
                <TextReveal>Subject Matter Experts</TextReveal>
              </Heading>
              <FadeIn delay={0.3}>
                <Text variant="muted" className="text-lg leading-relaxed">
                  We don't pretend to know everything. When your challenge
                  requires specialist knowledge - regulatory, technical, or
                  sector-specific - we bring in people who've done it before.
                </Text>
              </FadeIn>
            </div>
          </Container>
        </Section>

        {/* Explore More */}
        <Section className="py-20" pattern="grid-subtle" blend="border">
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
                    Our four core beliefs
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
          heading="Ready to bring clarity to your AI agenda?"
          buttonText="Start a Conversation"
          buttonHref="/contact"
        />
      </main>
      <Footer />
    </>
  );
}
