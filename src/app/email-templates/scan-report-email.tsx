import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Button,
  Row,
  Column,
  Preview,
} from "@react-email/components";
import type { ScanResult } from "@/lib/scanner/types";

interface ScanReportEmailProps {
  result: ScanResult;
  recipientName?: string;
}

export function ScanReportEmail({ result, recipientName }: ScanReportEmailProps) {
  // Pre-header text for inbox preview (under 90 chars)
  const preheaderText = `${result.opportunities.length} AI opportunities identified for ${result.businessName}`;

  // Design system aligned with Foremost (Factory.ai inspired)
  const colors = {
    background: "#eeeeee", // Warm light gray
    backgroundCard: "#fafafa", // Off-white
    foreground: "#020202", // Almost black
    accent: "#ee6018", // Orange accent
    accentLight: "#fef3ee", // Light orange tint
    muted: "#f5f5f5", // Warm gray
    mutedForeground: "#666260",
    border: "#b8b3b0", // Warm border
  };

  const complexityLabels = ["Trivial", "Low", "Medium", "High", "Complex"];

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
          @media only screen and (max-width: 600px) {
            .container { padding: 32px 16px !important; }
            h1 { font-size: 26px !important; }
            .cta-button { width: 100% !important; text-align: center !important; }
          }
        `}</style>
      </Head>
      <Preview>{preheaderText}</Preview>
      <Body
        style={{
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          margin: 0,
          padding: 0,
          backgroundColor: colors.background,
          color: colors.foreground,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {/* Top accent line */}
        <Section style={{ backgroundColor: colors.accent, height: "3px" }} />

        <Container
          style={{
            margin: "0 auto",
            padding: "48px 24px",
            maxWidth: "600px",
          }}
        >
          {/* Header */}
          <Section style={{ marginBottom: "48px" }}>
            <Text
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: colors.accent,
                margin: "0 0 24px 0",
              }}
            >
              AI Opportunity Report
            </Text>

            <Heading
              as="h1"
              style={{
                fontSize: "32px",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: colors.foreground,
                margin: 0,
              }}
            >
              {result.businessName}
            </Heading>

            <Text
              style={{
                fontSize: "13px",
                color: colors.mutedForeground,
                margin: "12px 0 0 0",
                letterSpacing: "-0.01em",
              }}
            >
              {result.industry} · {result.pagesAnalysed} pages analysed
            </Text>
          </Section>

          {/* Greeting */}
          <Section style={{ marginBottom: "40px" }}>
            <Text
              style={{
                fontSize: "14px",
                lineHeight: 1.7,
                color: colors.foreground,
                margin: 0,
              }}
            >
              {recipientName ? `${recipientName},` : "Hello,"}
            </Text>
            <Text
              style={{
                fontSize: "14px",
                lineHeight: 1.7,
                color: colors.foreground,
                margin: "16px 0 0 0",
              }}
            >
              We&apos;ve completed our analysis and identified{" "}
              <span style={{ color: colors.accent, fontWeight: 500 }}>
                {result.opportunities.length} high-impact opportunities
              </span>{" "}
              for AI integration in your business.
            </Text>
          </Section>

          {/* Divider */}
          <Hr style={{ borderColor: colors.border, borderWidth: "1px", margin: "0 0 40px 0" }} />

          {/* Summary */}
          <Section style={{ marginBottom: "48px" }}>
            <Text
              style={{
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: colors.mutedForeground,
                margin: "0 0 16px 0",
              }}
            >
              Executive Summary
            </Text>

            <Section
              style={{
                borderLeft: `3px solid ${colors.accent}`,
                paddingLeft: "20px",
              }}
            >
              <Text
                style={{
                  fontSize: "15px",
                  lineHeight: 1.8,
                  color: colors.foreground,
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                {result.summary}
              </Text>
            </Section>
          </Section>

          {/* Opportunities */}
          <Section style={{ marginBottom: "48px" }}>
            <Text
              style={{
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: colors.mutedForeground,
                margin: "0 0 24px 0",
              }}
            >
              Identified Opportunities
            </Text>

            {result.opportunities.map((opp, index) => (
              <Section
                key={opp.id}
                style={{
                  backgroundColor: colors.backgroundCard,
                  padding: "24px",
                  marginBottom: "16px",
                  borderRadius: "8px",
                }}
              >
                {/* Category & Number */}
                <Row>
                  <Column>
                    <Text
                      style={{
                        fontSize: "10px",
                        fontWeight: 500,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: colors.accent,
                        margin: 0,
                      }}
                    >
                      {opp.category}
                    </Text>
                  </Column>
                  <Column style={{ textAlign: "right" }}>
                    <Text
                      style={{
                        fontSize: "48px",
                        fontWeight: 300,
                        color: colors.border,
                        margin: 0,
                        lineHeight: 1,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Text>
                  </Column>
                </Row>

                {/* Title */}
                <Heading
                  as="h3"
                  style={{
                    fontSize: "18px",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: colors.foreground,
                    margin: "16px 0 8px 0",
                    lineHeight: 1.3,
                  }}
                >
                  {opp.title}
                </Heading>

                {/* Description */}
                <Text
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: colors.mutedForeground,
                    margin: "0 0 20px 0",
                  }}
                >
                  {opp.description}
                </Text>

                {/* Metrics */}
                <Row>
                  <Column style={{ width: "50%" }}>
                    <Text
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: colors.mutedForeground,
                        margin: "0 0 4px 0",
                      }}
                    >
                      Impact
                    </Text>
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: colors.accent,
                        margin: 0,
                      }}
                    >
                      {"■".repeat(opp.impact)}
                      <span style={{ color: colors.border }}>{"■".repeat(5 - opp.impact)}</span>
                    </Text>
                  </Column>
                  <Column style={{ width: "50%" }}>
                    <Text
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: colors.mutedForeground,
                        margin: "0 0 4px 0",
                      }}
                    >
                      Effort
                    </Text>
                    <Text
                      style={{
                        fontSize: "13px",
                        color: colors.foreground,
                        margin: 0,
                      }}
                    >
                      {complexityLabels[opp.complexity - 1]}
                    </Text>
                  </Column>
                </Row>

                {/* Pain Points */}
                {opp.painPointsSolved.length > 0 && (
                  <Section style={{ marginTop: "20px", paddingTop: "16px", borderTop: `1px solid ${colors.border}` }}>
                    <Text
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: colors.mutedForeground,
                        margin: "0 0 8px 0",
                      }}
                    >
                      Problems Solved
                    </Text>
                    {opp.painPointsSolved.map((point, i) => (
                      <Text
                        key={i}
                        style={{
                          fontSize: "12px",
                          lineHeight: 1.6,
                          color: colors.foreground,
                          margin: "0 0 4px 0",
                          paddingLeft: "12px",
                        }}
                      >
                        <span style={{ color: colors.accent }}>→</span> {point}
                      </Text>
                    ))}
                  </Section>
                )}
              </Section>
            ))}
          </Section>

          {/* CTA */}
          <Section
            style={{
              backgroundColor: colors.foreground,
              padding: "40px 32px",
              textAlign: "center",
              borderRadius: "8px",
            }}
          >
            <Heading
              as="h3"
              style={{
                fontSize: "20px",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: colors.background,
                margin: "0 0 12px 0",
              }}
            >
              Ready to discuss these opportunities?
            </Heading>
            <Text
              style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: "rgba(238,238,238,0.7)",
                margin: "0 0 28px 0",
              }}
            >
              Schedule a conversation with our AI advisors to explore how these opportunities could work for your business.
            </Text>
            <Button
              href="https://foremost.ai/contact"
              className="cta-button"
              style={{
                backgroundColor: colors.accent,
                color: "#ffffff",
                padding: "16px 40px",
                fontSize: "16px",
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-block",
                letterSpacing: "0.02em",
                borderRadius: "6px",
                minHeight: "44px",
              }}
            >
              Discuss with an Advisor →
            </Button>
          </Section>

          {/* Footer */}
          <Section style={{ marginTop: "48px" }}>
            <Hr style={{ borderColor: colors.border, margin: "0 0 24px 0" }} />
            <Text
              style={{
                fontSize: "11px",
                color: colors.mutedForeground,
                margin: 0,
                letterSpacing: "0.02em",
              }}
            >
              Generated by{" "}
              <Link href="https://foremost.ai" style={{ color: colors.accent, textDecoration: "none" }}>
                Foremost.ai
              </Link>{" "}
              AI Scanner · {new Date().toLocaleDateString("en-GB")}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ScanReportEmail;
