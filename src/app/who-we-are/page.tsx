import { Metadata } from "next";
import { Container, Section } from "@/components/layout";
import {
  Heading,
  Text,
  SectionLabel,
  LinkWithArrow,
  Card,
  CardContent,
  CTACard,
  TiltCard,
  Highlight,
  HeroSection,
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

const values = [
  {
    name: "Clarity",
    description: "If we can't explain it simply, we don't understand it well enough.",
  },
  {
    name: "Rigour",
    description: "We follow evidence, even when it's unfashionable.",
  },
  {
    name: "Integrity",
    description: "We'd rather lose the work than give bad advice.",
  },
  {
    name: "Impact",
    description: "Slide decks don't count. Did anything actually change?",
  },
];

export default function WhoWeArePage() {
  return (
    <>
      <SchemaScript schema={[breadcrumbs.whoWeAre, founderSchema]} />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <HeroSection variant="who-we-are">
          <Heading as="h1" size="hero" className="mb-6">
            <TextReveal>
              About Foremost.
            </TextReveal>
          </Heading>
          <FadeIn delay={0.4}>
            <Text
              variant="bodyLarge"
              mono
              className="max-w-xl text-foreground-muted"
            >
              Clarity, confidence, and meaningful progress for leaders embracing AI.
            </Text>
          </FadeIn>
        </HeroSection>

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
                    We started Foremost because we kept seeing the same thing: boards drowning in AI pitches, vendors selling solutions, consultancies selling methodologies — but <Highlight>nobody sitting with leadership</Highlight> and helping them think through what AI actually meant for their business.
                  </Text>
                  <Text variant="muted" className="text-lg leading-relaxed">
                    <Highlight>Technology alone doesn't transform organisations; people do.</Highlight> Most of our work focuses on the human side — the fears, the politics, the dynamics that determine whether AI initiatives fly or stall.
                  </Text>
                  <Text variant="muted" className="text-lg leading-relaxed">
                    UK and EU businesses need to get serious about AI or fall behind. We help them move — thoughtfully, strategically, with governance that speeds things up rather than slowing them down.
                  </Text>
                </div>
              </FadeIn>
            </div>
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
                <StaggerItem key={index} className="h-full">
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
              <StaggerItem className="h-full">
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
                        Spent years as a non-executive director watching boards drown in AI pitches — too much hype, not enough practical guidance. Founded Foremost to fix that. MIT AI programme, but more importantly: someone who&apos;s sat through the board meetings and knows which questions actually matter.
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

              <StaggerItem className="h-full">
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
                        "next big thing" cycles — seen what sticks, what doesn't.
                        Now helps companies figure out technology strategy and
                        get business, product, and engineering teams talking.
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

              <StaggerItem className="h-full">
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
                  A curated network of domain experts in specific verticals, regulatory frameworks, and technical implementation. When your challenge requires specialist knowledge, we bring in people who&apos;ve done it before.
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
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/how-we-think" className="text-lg">
                    How We Think
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Our four core beliefs and how we work
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
          label="Ready to bring clarity to your AI agenda?"
          topRightLink={{ text: "Start a Conversation", href: "/contact" }}
          heading="We take few clients so we can go deep."
          description="You work with the founders directly. No handoffs, no layers."
          buttonText="Start a Conversation"
          buttonHref="/contact"
        />
      </main>
    </>
  );
}
