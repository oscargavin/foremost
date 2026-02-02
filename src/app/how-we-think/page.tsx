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
import { SchemaScript, breadcrumbs } from "@/components/seo";

export const metadata: Metadata = {
  title: "AI Strategy Framework | Foremost",
  description:
    "Discover our AI strategy framework: strategic clarity, applied intelligence, human potential, and governance as enabler for business growth.",
  alternates: {
    canonical: "/how-we-think",
  },
  openGraph: {
    title: "AI Strategy Framework | Foremost",
    description:
      "Our AI strategy framework: strategic clarity, applied intelligence, human potential, and governance as enabler.",
    url: "https://foremost.ai/how-we-think",
    type: "website",
    images: [
      {
        url: "https://foremost.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foremost.ai - AI Strategy Framework",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Strategy Framework | Foremost",
    description:
      "Our AI strategy framework: strategic clarity, applied intelligence, human potential, and governance as enabler.",
    images: ["https://foremost.ai/og-image.png"],
  },
};

const pillars = [
  {
    id: "strategic-clarity",
    number: "01",
    title: "Strategic Clarity",
    quote:
      "There is no standalone AI strategy — only business strategies more or less accelerated by AI.",
    description:
      "Selling AI strategies is backwards. You have a business strategy. The question is whether AI helps, and how much.",
    highlight: "backwards",
  },
  {
    id: "applied-intelligence",
    number: "02",
    title: "Applied Intelligence",
    quote:
      "If it doesn't impact the P&L or the business model, it's a hobby.",
    description:
      "AI either changes your business model or makes operations cheaper. Pick one and measure it. Everything else is innovation theatre.",
    highlight: "innovation theatre",
  },
  {
    id: "human-potential",
    number: "03",
    title: "Human Potential & Imagination",
    quote:
      "The limit of AI is human imagination. We build structures that unleash it.",
    description:
      "Most AI projects stall because of people problems, not technical ones — fear, role confusion, politics. That's where the real work happens.",
    highlight: "people problems, not technical ones",
  },
  {
    id: "governance",
    number: "04",
    title: "Governance as Enabler",
    quote:
      "Good governance creates confidence. Clear direction and guardrails give organisations permission to move faster.",
    description:
      "Boards can't delegate AI to IT and hope for the best. They need to own direction. Good governance gives people permission to move.",
    highlight: "permission to move",
  },
];

export default function HowWeThinkPage() {
  return (
    <>
      <SchemaScript schema={breadcrumbs.howWeThink} />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <HeroSection variant="how-we-think">
          <Heading as="h1" size="hero" className="mb-6">
            <TextReveal>Our AI Strategy Philosophy</TextReveal>
          </Heading>
          <FadeIn delay={0.4}>
            <Text
              variant="bodyLarge"
              mono
              className="max-w-xl text-foreground-muted"
            >
              Four beliefs that shape our work. Unfashionable in an industry that loves hype — but why our advice works.
            </Text>
          </FadeIn>
        </HeroSection>

        {/* Pillars */}
        {pillars.map((pillar, index) => (
          <Section
            key={pillar.id}
            id={pillar.id}
            className={index === 0 ? "py-28" : "py-20"}
            variant={index % 2 === 0 ? "card" : "default"}
            pattern={index % 2 === 0 ? "grid-subtle" : "none"}
            blend={index % 2 === 0 ? "elevated" : "border"}
          >
            <Container>
              <div className="max-w-3xl">
                <FadeIn>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-accent-orange/10 flex items-center justify-center">
                      <span className="text-accent-orange font-mono text-sm font-medium">
                        {pillar.number}
                      </span>
                    </div>
                    <div className="w-8 h-px bg-border" />
                  </div>
                </FadeIn>

                <Heading as="h2" size="section" className="mb-8">
                  <TextReveal>{pillar.title}</TextReveal>
                </Heading>

                <FadeIn delay={0.3}>
                  <TiltCard className="mb-8">
                    <Card className="p-6">
                      <CardContent className="p-0">
                        <SectionLabel className="mb-4">
                          Foremost Thinking
                        </SectionLabel>
                        <blockquote className="border-l-2 border-accent-orange pl-6">
                          <Text
                            as="p"
                            className="text-[24px] leading-[1.4] text-foreground italic"
                          >
                            &ldquo;{pillar.quote}&rdquo;
                          </Text>
                        </blockquote>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </FadeIn>

                <FadeIn delay={0.4}>
                  <Text
                    variant="muted"
                    className="text-lg leading-relaxed mb-8"
                  >
                    {pillar.description.split(pillar.highlight)[0]}
                    <Highlight>{pillar.highlight}</Highlight>
                    {pillar.description.split(pillar.highlight)[1]}
                  </Text>

                  <LinkWithArrow href="/contact">
                    See related services
                  </LinkWithArrow>
                </FadeIn>
              </div>
            </Container>
          </Section>
        ))}

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
                    See how we apply these principles in practice
                  </Text>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="group">
                  <LinkWithArrow href="/who-we-are" className="text-lg">
                    About & Team
                  </LinkWithArrow>
                  <Text variant="muted" className="mt-2">
                    Meet the people behind the thinking
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
          label="Founding Engagements"
          topRightLink={{ text: "Limited Spots", href: "/contact" }}
          heading="Your competitors are moving. Are you?"
          description="Early movers in AI build advantages that compound. We'd rather help you lead than catch up."
          buttonText="Talk to Us"
          buttonHref="/contact"
        />
      </main>
    </>
  );
}
