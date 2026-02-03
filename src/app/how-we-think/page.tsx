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
      "There's no such thing as an AI strategy — only business strategies that AI accelerates, or doesn't.",
    description:
      "Everyone's drowning in AI noise. We help boards and executive teams cut through it, focus on what matters, and make confident choices.",
    highlight: "cut through it",
  },
  {
    id: "applied-intelligence",
    number: "02",
    title: "Applied Intelligence",
    quote:
      "If it doesn't hit the P&L or change the business model, it's a hobby.",
    description:
      "AI creates value two ways: rethinking business models or driving productivity. Pick one and measure it. Everything else is innovation theatre.",
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
      "Good governance gives people permission to move faster. It turns risk management into a competitive advantage.",
    description:
      "Boards can't delegate AI to IT and hope for the best. They need to own direction, ask the hard questions, and guide trade-offs. Good governance speeds things up.",
    highlight: "speeds things up",
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
            <TextReveal>Clarity in Complexity.</TextReveal>
          </Heading>
          <FadeIn delay={0.4}>
            <Text
              variant="bodyLarge"
              mono
              className="max-w-xl text-foreground-muted"
            >
              Business strategy, accelerated by intelligence, not isolated &ldquo;AI projects.&rdquo; Four beliefs guide our advice.
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

        {/* How This Shapes Our Work */}
        <Section className="py-20" variant="card" pattern="grid-subtle" blend="elevated">
          <Container>
            <FadeIn>
              <SectionLabel className="mb-4">How This Shapes Our Work</SectionLabel>
            </FadeIn>
            <Heading as="h2" size="section" className="mb-16">
              <TextReveal>Principles in Practice</TextReveal>
            </Heading>

            <div className="space-y-0">
              {/* Principle 01 */}
              <StaggerChildren>
                <StaggerItem>
                  <div className="group grid grid-cols-[auto_1fr] gap-6 sm:gap-10 py-10 border-t border-border">
                    <div className="relative">
                      <span className="font-mono text-[72px] sm:text-[96px] font-light leading-none text-accent-orange/15 select-none">
                        01
                      </span>
                    </div>
                    <div className="pt-2 sm:pt-4 max-w-2xl">
                      <Heading as="h3" size="card" className="mb-3 text-xl sm:text-2xl">
                        Listen First, Then Challenge
                      </Heading>
                      <Text variant="muted" className="text-base sm:text-lg leading-relaxed">
                        We spend the first part of any engagement listening. Then we <Highlight>push back on assumptions</Highlight>. If you wanted validation, you&apos;d have hired a different firm.
                      </Text>
                    </div>
                  </div>
                </StaggerItem>

                {/* Principle 02 */}
                <StaggerItem>
                  <div className="group grid grid-cols-[auto_1fr] gap-6 sm:gap-10 py-10 border-t border-border">
                    <div className="relative">
                      <span className="font-mono text-[72px] sm:text-[96px] font-light leading-none text-accent-orange/15 select-none">
                        02
                      </span>
                    </div>
                    <div className="pt-2 sm:pt-4 max-w-2xl">
                      <Heading as="h3" size="card" className="mb-3 text-xl sm:text-2xl">
                        Your Strategy, Not Ours
                      </Heading>
                      <Text variant="muted" className="text-base sm:text-lg leading-relaxed">
                        We don&apos;t arrive with frameworks to sell. You know your business; we help you think through the AI implications <Highlight>clearly enough to decide</Highlight>.
                      </Text>
                    </div>
                  </div>
                </StaggerItem>

                {/* Principle 03 */}
                <StaggerItem>
                  <div className="group grid grid-cols-[auto_1fr] gap-6 sm:gap-10 py-10 border-t border-border border-b">
                    <div className="relative">
                      <span className="font-mono text-[72px] sm:text-[96px] font-light leading-none text-accent-orange/15 select-none">
                        03
                      </span>
                    </div>
                    <div className="pt-2 sm:pt-4 max-w-2xl">
                      <Heading as="h3" size="card" className="mb-3 text-xl sm:text-2xl">
                        Deep Partnerships, Few Clients
                      </Heading>
                      <Text variant="muted" className="text-base sm:text-lg leading-relaxed">
                        We take on fewer clients than we could. Good advisory requires attention, and <Highlight>attention is finite</Highlight>.
                      </Text>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerChildren>
            </div>

            <FadeIn delay={0.4}>
              <div className="mt-16 max-w-3xl">
                <Text
                  as="p"
                  className="text-[28px] sm:text-[33px] leading-[1.25] tracking-[-0.5px] text-foreground"
                >
                  &ldquo;The goal is <span className="text-accent-orange">capability</span>, not dependency. A good engagement ends with you needing us less.&rdquo;
                </Text>
              </div>
            </FadeIn>
          </Container>
        </Section>

        {/* Explore More */}
        <Section className="py-20" variant="card" blend="elevated">
          <Container>
            <FadeIn>
              <SectionLabel className="mb-4">Continue Exploring</SectionLabel>
            </FadeIn>
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
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
          label="Ready to put this thinking to work?"
          topRightLink={{ text: "Schedule a Discussion", href: "/contact" }}
          heading="Your competitors are moving. Are you?"
          description="Early movers build advantages that compound. We'd rather help you lead than catch up."
          buttonText="Start a Conversation"
          buttonHref="/contact"
        />
      </main>
    </>
  );
}
