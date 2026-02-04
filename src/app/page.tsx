import { Metadata } from "next";
import { Suspense } from "react";
import { Container, Section } from "@/components/layout";
import {
  Button,
  Heading,
  Text,
  SectionLabel,
  LinkWithArrow,
  CTACard,
  LogoCarousel,
  HeroSection,
  IndustryFinder,
  Testimonials,
  ServiceAccordion,
  type ServiceData,
} from "@/components/ui";
import { FadeIn, StaggerChildren, StaggerItem, TextReveal } from "@/components/motion";
import {
  SchemaScript,
  professionalServiceSchema,
  breadcrumbs,
} from "@/components/seo";
// Loading skeletons for Suspense boundaries

function IndustryFinderSkeleton() {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="text-foreground-muted text-sm font-mono">Loading...</div>
    </div>
  );
}

function TestimonialsSkeleton() {
  return (
    <Section className="py-20">
      <Container>
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-foreground-muted text-sm font-mono">Loading testimonials...</div>
        </div>
      </Container>
    </Section>
  );
}

export const metadata: Metadata = {
  title: "Foremost.ai | Board-Level AI Advisory",
  description:
    "Applied intelligence for boards and executive teams. Strategic AI advisory that brings clarity, confidence, and measurable outcomes.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Foremost.ai | Board-Level AI Advisory",
    description:
      "Applied intelligence for boards and executive teams. Strategic AI advisory that brings clarity, confidence, and measurable outcomes.",
    url: "https://foremost.ai",
    type: "website",
    images: [
      {
        url: "https://foremost.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foremost.ai - Board-Level AI Advisory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foremost.ai | Board-Level AI Advisory",
    description:
      "Applied intelligence for boards and executive teams. Strategic AI advisory that brings clarity, confidence, and measurable outcomes.",
    images: ["https://foremost.ai/og-image.png"],
  },
};

const services: ServiceData[] = [
  {
    number: "01",
    title: "Strategic Clarity",
    subtitle: "From noise to clear priorities",
    description:
      "There's a lot of noise out there. We help you cut through it, find where AI actually accelerates your goals, and move forward with clear priorities.",
    href: "/how-we-think#strategic-clarity",
    linkText: "Explore strategic clarity",
    categories: [
      {
        label: "",
        items: [
          {
            title: "Business Strategy First, AI Second",
            description:
              "We start with your business strategy and competitive positioning, then find where AI creates genuine advantage.",
          },
          {
            title: "Enterprise AI Strategic Positioning",
            description:
              "Clarify where AI will create advantage, and where it won't. Define strategic posture and 12-18 month priorities.",
          },
          {
            title: "AI Readiness & Constraints Diagnostic",
            description:
              "Assess your ability to execute — data foundations, security, talent, governance. Get a pragmatic plan to remove bottlenecks.",
          },
          {
            title: "GenAI vs Analytics Decision Discipline",
            description:
              "Clear logic for when to use generative AI, traditional analytics, automation, or process redesign.",
          },
          {
            title: "Executive & Board Education",
            description:
              "Targeted briefings designed for governance, not evangelism. The right questions leaders should be asking.",
          },
          {
            title: "AI Investment & Vendor Strategy",
            description:
              "Discipline for platform and partner decisions. Clear build/buy/partner logic to prevent tool sprawl.",
          },
        ],
      },
    ],
  },
  {
    number: "02",
    title: "Applied Intelligence",
    subtitle: "From pilots to scaled value",
    description:
      "AI creates value two ways: reimagining your business model, or making operations more efficient. We make sure whichever path you choose hits the P&L.",
    href: "/how-we-think#applied-intelligence",
    linkText: "Explore applied intelligence",
    categories: [
      {
        label: "Reimagination — New Business Models",
        items: [
          {
            title: "Ecosystem & Interaction Reimagination",
            description:
              "Reimagine how you interact with customers, suppliers, and employees to transform service models.",
          },
          {
            title: "Core Value Chain Transformation",
            description:
              "Redesign critical business functions to apply AI for distinct, long-term competitive advantage.",
          },
          {
            title: "Proprietary AI Product Creation",
            description:
              "Develop AI-enabled products where ownership creates defensive moats. Scale, monetisation, governance built in.",
          },
          {
            title: "Human-Agent Workflow Design",
            description:
              "Design the new operating model where humans and AI agents collaborate. Automation that amplifies judgement.",
          },
        ],
      },
      {
        label: "Efficiency — Productivity & Performance",
        items: [
          {
            title: "Identifying What Moves the Needle",
            description:
              "Examine workflows and data to find where AI creates real value. Each use case assessed for P&L impact and risk.",
          },
          {
            title: "Value-First Use Case Delivery",
            description:
              "Take high-ROI use cases from concept to production. Delivered into real workflows, measured, and scaled.",
          },
          {
            title: "AI for Core Functions",
            description:
              "Targeted AI in Operations (copilots), Marketing (personalisation), and Finance (forecasting).",
          },
          {
            title: "Accelerating Executive Decisions",
            description:
              "Improve decision speed and quality through forecasting, scenario analysis, and executive-ready narratives.",
          },
        ],
      },
    ],
  },
  {
    number: "03",
    title: "Human Potential & Imagination",
    subtitle: "Elevating people with AI",
    description:
      "AI projects succeed or fail with people. We design organisations where human judgement stays central — and imagination gets unlocked, not stalled by fear.",
    href: "/how-we-think#human-potential",
    linkText: "Explore human potential",
    categories: [
      {
        label: "",
        items: [
          {
            title: "Embedding AI in Your Organisation",
            description:
              "Define how AI is governed and delivered — roles, responsibilities, data ownership, and delivery teams.",
          },
          {
            title: "Work Redesign & Job Architecture",
            description:
              "Focus on tasks, not titles. Map what's automated, augmented, or redesigned for workforce transition.",
          },
          {
            title: "Leadership & Manager Enablement",
            description:
              "Support for leaders navigating uncertainty: setting direction, managing AI-augmented teams, leading change.",
          },
          {
            title: "Adoption & Change Programmes",
            description:
              "Manage the human side of AI transformation through clear narratives, champion networks, and adoption metrics.",
          },
          {
            title: "AI Literacy & Capability Building",
            description:
              "Tiered learning: Board oversight essentials, executive value-and-risk immersion, practitioner guides.",
          },
          {
            title: "Unlocking Human-AI Potential",
            description:
              "Structured spaces for co-creation and innovation. Better outcomes through clear interfaces and escalation paths.",
          },
        ],
      },
    ],
  },
  {
    number: "04",
    title: "Governance as Enabler",
    subtitle: "Guardrails for speed with confidence",
    description:
      "Good governance speeds you up. It gives teams the guardrails they need to move with conviction.",
    href: "/how-we-think#governance",
    linkText: "Explore AI governance",
    categories: [
      {
        label: "",
        items: [
          {
            title: "Board AI Oversight & Stewardship",
            description:
              "Practical tools for active governance: AI posture, risk appetite, oversight cadences, escalation thresholds.",
          },
          {
            title: "Responsible & Ethical AI in Practice",
            description:
              "Translate principles into reality through bias testing, risk assessments, and embedded control libraries.",
          },
          {
            title: "AI Risk Assessment & Continuous Monitoring",
            description:
              "Integrate AI into enterprise risk management with defined appetites, ongoing monitoring, and escalation.",
          },
          {
            title: "Regulatory & EU AI Act Readiness",
            description:
              "Anticipate regulation through system inventories, risk classification, and compliance gap remediation.",
          },
          {
            title: "Model Risk & Assurance",
            description:
              "Clear standards for deployment: accuracy, reliability, explainability, and independent testing.",
          },
          {
            title: "Third-Party & Vendor AI Risk",
            description:
              "Manage external exposure through contractual safeguards, audit rights, and incident protocols.",
          },
        ],
      },
    ],
  },
];


export default function Home() {
  return (
    <>
      <SchemaScript schema={[professionalServiceSchema, breadcrumbs.home]} />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <HeroSection>
          <Heading as="h1" size="hero" className="mb-6">
            <TextReveal>
              Applied intelligence for the boardroom.
            </TextReveal>
          </Heading>
          <FadeIn delay={0.4}>
            <Text
              variant="bodyLarge"
              mono
              className="max-w-xl text-foreground-muted"
            >
              We help boards and executive teams cut through AI noise and get to clear priorities that actually move the business.
            </Text>
            <div className="mt-10 flex flex-col sm:flex-row items-start gap-6">
              <Button href="/contact" size="lg" magnetic>
                Talk to a Founder
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="ml-1"
                >
                  <path
                    d="M3.333 8h9.334M8.667 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <LinkWithArrow href="/how-we-think" className="sm:mt-2.5">
                See How We Think
              </LinkWithArrow>
            </div>
            <div className="mt-10 pt-6 border-t border-border/40">
              <p className="text-sm text-foreground-subtle font-mono">
                Now accepting founding clients · Direct founder access
              </p>
            </div>
          </FadeIn>
        </HeroSection>

        {/* Logo Carousel */}
        <LogoCarousel />

        {/* Foremost Thinking Section */}
        <Section className="py-16 sm:py-20 md:py-24" pattern="grid-subtle" blend="border">
          <Container>
            <FadeIn>
              <SectionLabel className="mb-8">Foremost Thinking</SectionLabel>
            </FadeIn>
            <blockquote className="max-w-3xl">
              <p className="text-[33px] leading-[1.2] tracking-[-0.5px] text-foreground">
                <TextReveal>
                  {`"We don't sell AI strategies. We sharpen business strategies for an AI-enabled world."`}
                </TextReveal>
              </p>
            </blockquote>
            <FadeIn delay={0.6}>
              <div className="mt-8">
                <LinkWithArrow href="/how-we-think">
                  Explore Our Thinking
                </LinkWithArrow>
              </div>
            </FadeIn>
          </Container>
        </Section>

        {/* Strategic Clarity Section */}
        <Section className="py-16 sm:py-20 md:py-24" blend="border">
          <Container>
            <div className="mb-12">
              <FadeIn>
                <SectionLabel className="mb-4">What We Do</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-4">
                <TextReveal>Strategically applied intelligence</TextReveal>
              </Heading>
              <FadeIn delay={0.4}>
                <Text
                  variant="bodyLarge"
                  mono
                  className="max-w-2xl text-foreground-muted"
                >
                  For boards and executive teams who want to stop circling and start deciding.
                </Text>
              </FadeIn>
            </div>

            <FadeIn delay={0.2}>
              <ServiceAccordion services={services} />
            </FadeIn>
          </Container>
        </Section>

        {/* AI Explorer CTA */}
        <Section className="py-20 sm:py-24 md:py-28">
          <Container>
            <FadeIn>
              <div className="max-w-4xl">
                {/* Top label */}
                <div className="flex items-center gap-3 mb-8 md:mb-10">
                  <span className="w-2 h-2 rounded-full bg-accent-orange" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-subtle">
                    Interactive Tool
                  </span>
                </div>

                {/* Heading */}
                <Heading as="h2" size="section" className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-light tracking-[-0.03em] leading-[1.05] mb-6 md:mb-8 max-w-3xl">
                  <TextReveal>Explore your AI opportunities</TextReveal>
                </Heading>

                {/* Description */}
                <Text className="text-lg sm:text-xl md:text-2xl text-foreground-muted leading-relaxed max-w-2xl mb-10 md:mb-12">
                  Enter your website and get a personalised analysis of strategic AI opportunities tailored to your business priorities.
                </Text>

                {/* Button and metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <Button href="/tools/ai-explorer" size="lg" magnetic>
                    Try the AI Explorer
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="ml-2"
                    >
                      <path
                        d="M3.333 8h9.334M8.667 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                  <p className="text-sm text-foreground-subtle font-mono tracking-wide">
                    ~45 seconds · Multi-step analysis
                  </p>
                </div>
              </div>
            </FadeIn>
          </Container>
        </Section>

        {/* Industries Section - Conversational Search */}
        <Section className="py-16 sm:py-20 md:py-24" variant="card" pattern="grid-subtle" blend="elevated">
          <Container>
            <div className="mb-12">
              <FadeIn>
                <SectionLabel className="mb-4">Find Your Industry</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section" className="mb-4">
                <TextReveal>AI advisory for your sector</TextReveal>
              </Heading>
              <FadeIn delay={0.4}>
                <Text
                  variant="bodyLarge"
                  mono
                  className="max-w-2xl text-foreground-muted"
                >
                  Generic AI advice is useless. Tell us your industry; we&apos;ll show you what matters.
                </Text>
              </FadeIn>
            </div>

            <FadeIn delay={0.2}>
              <Suspense fallback={<IndustryFinderSkeleton />}>
                <IndustryFinder />
              </Suspense>
            </FadeIn>
          </Container>
        </Section>

        {/* Testimonials */}
        <Suspense fallback={<TestimonialsSkeleton />}>
          <Testimonials />
        </Suspense>

        {/* Insights Section */}
        <Section className="py-16 sm:py-20 md:py-24" variant="card" blend="elevated">
          <Container>
            <div className="mb-10 md:mb-12">
              <FadeIn>
                <SectionLabel className="mb-4">From the Practice</SectionLabel>
              </FadeIn>
              <Heading as="h2" size="section">
                <TextReveal>Insights</TextReveal>
              </Heading>
            </div>

            <FadeIn delay={0.2}>
              <div className="max-w-2xl">
                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent mb-8" />

                {/* Article Card */}
                <article className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-orange" />
                    <span className="font-mono text-xs text-foreground-muted uppercase tracking-wider">
                      Thought Leadership · 2025
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-normal text-foreground mb-4 tracking-tight leading-tight">
                    Beyond the Hype: 12 Things Every Business Leader Needs to Know About AI
                  </h3>

                  <p className="text-foreground-muted leading-relaxed mb-6 max-w-xl">
                    A practical framework for understanding AI&apos;s strategic potential — why it&apos;s comparable to electrification, and how to redesign business processes rather than merely automate existing ones.
                  </p>

                  <div className="flex items-center gap-4">
                    <a
                      href="https://www.amcham.lu/newsletter/vitalij-farafonov-beyond-the-hype-12-things-every-business-leader-needs-to-know-about-ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-foreground hover:text-accent-orange transition-colors duration-200 group/link"
                    >
                      <span className="font-medium">Read Article</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="transition-transform duration-200 group-hover/link:translate-x-1"
                      >
                        <path
                          d="M3.333 8h9.334M8.667 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                    <span className="text-foreground-subtle text-sm font-mono">
                      AmCham Luxembourg
                    </span>
                  </div>
                </article>
              </div>
            </FadeIn>
          </Container>
        </Section>

        {/* CTA Card */}
        <CTACard
          topRightLink={{ text: "Get in touch", href: "/contact" }}
          heading="Let's talk about what's actually on your mind."
          description="We take on a small number of clients. That's intentional — good advice takes attention."
          buttonText="Start a Conversation"
          buttonHref="/contact"
        />
      </main>
    </>
  );
}
