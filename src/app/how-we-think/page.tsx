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
            className={index === 0 ? "py-20 sm:py-24 md:py-28" : "py-16 sm:py-20"}
            pattern={index === 0 || index === 2 ? "diagonal" : "none"}
            blend={index === 0 || index === 2 ? "border" : undefined}
          >
            <Container>
              <div className="max-w-4xl mx-auto">
                <FadeIn>
                  <div>
                    {/* Title with number */}
                    <div className="mb-8 md:mb-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-accent-orange/10 flex items-center justify-center">
                          <span className="text-accent-orange font-mono text-sm font-medium">
                            {pillar.number}
                          </span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-accent-orange/30 to-transparent" />
                      </div>
                      <Heading as="h2" size="section" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[-0.02em] leading-[1.1]">
                        <TextReveal>{pillar.title}</TextReveal>
                      </Heading>
                    </div>

                    {/* Quote - alternate styles by index */}
                    <div className="relative mb-8 md:mb-10">
                      {index % 2 === 1 ? (
                        // Style A: Minimal with large orange quote mark
                        <div className="relative pl-8 sm:pl-12">
                          <div className="absolute left-0 top-0 text-[80px] sm:text-[100px] font-serif leading-none text-accent-orange/20 select-none pointer-events-none" style={{lineHeight: '0.7'}}>
                            &ldquo;
                          </div>
                          <blockquote className="relative">
                            <Text
                              as="p"
                              className="text-xl sm:text-2xl md:text-3xl leading-[1.4] text-foreground font-light italic mb-4"
                            >
                              {pillar.quote}
                            </Text>
                            <div className="flex items-center gap-2">
                              <div className="h-px w-8 bg-accent-orange" />
                              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent-orange">
                                Foremost Thinking
                              </span>
                            </div>
                          </blockquote>
                        </div>
                      ) : (
                        // Style B: Card with top accent - glassy with fade edges
                        <div className="relative overflow-hidden rounded-lg p-6 sm:p-8">
                          {/* Glassy background with fade */}
                          <div className="absolute inset-0 bg-background-card/40 backdrop-blur-sm" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background-card/20 to-transparent" />
                          <div className="absolute inset-0 border border-white/10 rounded-lg" />

                          {/* Top accent */}
                          <div className="absolute top-0 left-8 w-16 h-[3px] bg-accent-orange -translate-y-1/2 z-10" />

                          {/* Content */}
                          <div className="relative z-10">
                            <div className="mb-4">
                              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent-orange">
                                Foremost Thinking
                              </span>
                            </div>
                            <blockquote>
                              <Text
                                as="p"
                                className="text-xl sm:text-2xl md:text-3xl leading-[1.4] text-foreground font-light italic"
                              >
                                &ldquo;{pillar.quote}&rdquo;
                              </Text>
                            </blockquote>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <Text
                        variant="muted"
                        className="text-base sm:text-lg leading-relaxed max-w-2xl"
                      >
                        {pillar.description.split(pillar.highlight)[0]}
                        <Highlight>{pillar.highlight}</Highlight>
                        {pillar.description.split(pillar.highlight)[1]}
                      </Text>
                    </div>

                    {/* Link */}
                    <div>
                      <LinkWithArrow href="/contact">
                        See related services
                      </LinkWithArrow>
                    </div>
                  </div>
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
