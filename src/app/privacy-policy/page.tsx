import { Metadata } from "next";
import { Container, Section } from "@/components/layout";
import { Heading, Text } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { SchemaScript, breadcrumbs } from "@/components/seo";

export const metadata: Metadata = {
  title: "Privacy Policy - Data Protection and Your Rights | Foremost",
  description:
    "Learn how Foremost.ai collects, uses, and protects your personal data. GDPR compliant privacy practices and your data rights explained.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy - Data Protection and Your Rights | Foremost",
    description:
      "Learn how Foremost.ai collects, uses, and protects your personal data. GDPR compliant privacy practices explained.",
    url: "https://foremost.ai/privacy-policy",
    type: "website",
    images: [
      {
        url: "https://foremost.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foremost.ai - Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - Data Protection and Your Rights | Foremost",
    description:
      "Learn how Foremost.ai collects, uses, and protects your personal data. GDPR compliant privacy practices.",
    images: ["https://foremost.ai/og-image.png"],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <SchemaScript schema={breadcrumbs.privacyPolicy} />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <Section className="pt-32 pb-12">
          <Container>
            <FadeIn>
              <div className="max-w-3xl">
                <Heading as="h1" size="page" className="mb-6">
                  Privacy Policy
                </Heading>
                <Text variant="muted" className="font-mono text-sm">
                  Last updated: January 2026
                </Text>
              </div>
            </FadeIn>
          </Container>
        </Section>

        {/* Content */}
        <Section className="py-12">
          <Container>
            <FadeIn>
              <div className="max-w-3xl prose prose-gray">
                <div className="space-y-12">
                  <section>
                    <Heading as="h2" size="card" className="mb-4">
                      1. Introduction
                    </Heading>
                    <Text variant="muted" className="leading-relaxed">
                      Foremost.ai (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy
                      and is committed to protecting your personal data. This
                      privacy policy explains how we collect, use, and safeguard
                      your information when you visit our website or engage with
                      our services.
                    </Text>
                  </section>

                  <section>
                    <Heading as="h2" size="card" className="mb-4">
                      2. Information We Collect
                    </Heading>
                    <Text variant="muted" className="leading-relaxed mb-4">
                      We may collect and process the following data:
                    </Text>
                    <ul className="space-y-2 text-foreground-muted">
                      <li className="flex gap-2">
                        <span className="text-accent-orange">•</span>
                        <span>
                          <strong className="text-foreground">Contact information:</strong> Name,
                          email address, and company details when you reach out
                          to us.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent-orange">•</span>
                        <span>
                          <strong className="text-foreground">Newsletter subscriptions:</strong>{" "}
                          Email address when you subscribe to our insights.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent-orange">•</span>
                        <span>
                          <strong className="text-foreground">Usage data:</strong> Anonymised
                          information about how you interact with our website.
                        </span>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <Heading as="h2" size="card" className="mb-4">
                      3. How We Use Your Information
                    </Heading>
                    <Text variant="muted" className="leading-relaxed mb-4">
                      We use your data to:
                    </Text>
                    <ul className="space-y-2 text-foreground-muted">
                      <li className="flex gap-2">
                        <span className="text-accent-orange">•</span>
                        <span>
                          Respond to your enquiries and provide our advisory
                          services
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent-orange">•</span>
                        <span>
                          Send you our quarterly newsletter (if subscribed)
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent-orange">•</span>
                        <span>Improve our website and user experience</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent-orange">•</span>
                        <span>Comply with legal obligations</span>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <Heading as="h2" size="card" className="mb-4">
                      4. Data Sharing
                    </Heading>
                    <Text variant="muted" className="leading-relaxed">
                      We do not sell your personal data. We may share your
                      information with trusted service providers who assist us
                      in operating our website and conducting our business,
                      provided they agree to keep your information confidential.
                    </Text>
                  </section>

                  <section>
                    <Heading as="h2" size="card" className="mb-4">
                      5. Your Rights
                    </Heading>
                    <Text variant="muted" className="leading-relaxed mb-4">
                      Under GDPR and UK data protection law, you have the right
                      to:
                    </Text>
                    <ul className="space-y-2 text-foreground-muted">
                      <li className="flex gap-2">
                        <span className="text-accent-orange">•</span>
                        <span>Access your personal data</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent-orange">•</span>
                        <span>Correct inaccurate data</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent-orange">•</span>
                        <span>Request deletion of your data</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent-orange">•</span>
                        <span>Object to processing of your data</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent-orange">•</span>
                        <span>Data portability</span>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <Heading as="h2" size="card" className="mb-4">
                      6. Cookies
                    </Heading>
                    <Text variant="muted" className="leading-relaxed">
                      We use essential cookies to ensure our website functions
                      correctly. We may also use analytics cookies to understand
                      how visitors interact with our site. You can control
                      cookie preferences through your browser settings.
                    </Text>
                  </section>

                  <section>
                    <Heading as="h2" size="card" className="mb-4">
                      7. Contact Us
                    </Heading>
                    <Text variant="muted" className="leading-relaxed">
                      For any questions about this privacy policy or your
                      personal data, please contact us at{" "}
                      <a
                        href="mailto:office@foremost.ai"
                        className="text-foreground hover:text-foreground-secondary transition-colors underline"
                      >
                        office@foremost.ai
                      </a>
                      .
                    </Text>
                  </section>
                </div>
              </div>
            </FadeIn>
          </Container>
        </Section>
      </main>
    </>
  );
}
