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
  const preheaderText = `${result.opportunities.length} AI opportunities identified for ${result.businessName}`;

  // Factory.ai Design System
  const colors = {
    background: "#eeeeee",
    backgroundCard: "#fafafa",
    foreground: "#020202",
    accent: "#ee6018",
    accentLight: "#ef6f2e",
    accentBorder: "#d15010",
    mutedForeground: "#5c5855",
    subtleForeground: "#8a8380",
    border: "#b8b3b0",
    darkBg: "#1f1d1c",
    lightOnDark: "#eeeeee",
    mutedOnDark: "#ccc9c7",
  };

  const fonts = {
    sans: "Geist, 'Geist Fallback', ui-sans-serif, system-ui, sans-serif",
    mono: "'Geist Mono', 'Geist Mono Fallback', ui-monospace, monospace",
  };

  const complexityLabels = ["Trivial", "Low", "Medium", "High", "Complex"];

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
        <style>{`
          :root { color-scheme: light only; }
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
          fontFamily: fonts.sans,
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
                fontFamily: fonts.mono,
                fontSize: "12px",
                fontWeight: 400,
                letterSpacing: "-0.24px",
                textTransform: "uppercase",
                color: colors.foreground,
                margin: "0 0 24px 0",
              }}
            >
              <span style={{ color: colors.accent }}>●</span> AI Opportunity Report
            </Text>

            <Heading
              as="h1"
              style={{
                fontSize: "48px",
                fontWeight: 400,
                letterSpacing: "-1.44px",
                lineHeight: "48px",
                color: colors.foreground,
                margin: 0,
              }}
            >
              {result.businessName}
            </Heading>

            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: "14px",
                fontWeight: 400,
                letterSpacing: "-0.28px",
                color: colors.mutedForeground,
                margin: "16px 0 0 0",
              }}
            >
              {result.industry} · {result.pagesAnalysed} pages analysed
            </Text>
          </Section>

          {/* Greeting */}
          <Section style={{ marginBottom: "40px" }}>
            <Text
              style={{
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "24px",
                color: colors.foreground,
                margin: 0,
              }}
            >
              {recipientName ? `${recipientName},` : "Hello,"}
            </Text>
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: "21.6px",
                letterSpacing: "-0.36px",
                color: colors.mutedForeground,
                margin: "16px 0 0 0",
              }}
            >
              We&apos;ve completed our analysis and identified{" "}
              <span style={{ color: colors.accentLight }}>
                {result.opportunities.length} high-impact opportunities
              </span>{" "}
              for AI integration in your business.
            </Text>
          </Section>

          {/* Divider */}
          <Hr style={{ border: "none", borderTop: `1px solid ${colors.border}`, margin: "0 0 40px 0" }} />

          {/* Summary */}
          <Section style={{ marginBottom: "48px" }}>
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: "12px",
                fontWeight: 400,
                letterSpacing: "-0.24px",
                textTransform: "uppercase",
                color: colors.foreground,
                margin: "0 0 16px 0",
              }}
            >
              <span style={{ color: colors.accent }}>●</span> 01 — Executive Summary
            </Text>

            <Section
              style={{
                borderLeft: `3px solid ${colors.accent}`,
                paddingLeft: "20px",
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.mono,
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "25.6px",
                  letterSpacing: "-0.32px",
                  color: colors.foreground,
                  margin: 0,
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
                fontFamily: fonts.mono,
                fontSize: "12px",
                fontWeight: 400,
                letterSpacing: "-0.24px",
                textTransform: "uppercase",
                color: colors.foreground,
                margin: "0 0 24px 0",
              }}
            >
              <span style={{ color: colors.accent }}>●</span> 02 — Identified Opportunities
            </Text>

            {result.opportunities.map((opp, index) => (
              <Section
                key={opp.id}
                style={{
                  backgroundColor: colors.backgroundCard,
                  border: `1px solid ${colors.border}`,
                  padding: "24px",
                  marginBottom: "16px",
                  borderRadius: "6px",
                }}
              >
                {/* Category & Number */}
                <Row>
                  <Column>
                    <Text
                      style={{
                        fontFamily: fonts.mono,
                        fontSize: "12px",
                        fontWeight: 400,
                        letterSpacing: "-0.24px",
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
                        fontWeight: 400,
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
                    fontSize: "24px",
                    fontWeight: 400,
                    letterSpacing: "0",
                    lineHeight: "24px",
                    color: colors.foreground,
                    margin: "16px 0 8px 0",
                  }}
                >
                  {opp.title}
                </Heading>

                {/* Description */}
                <Text
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "21px",
                    letterSpacing: "-0.28px",
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
                        fontFamily: fonts.mono,
                        fontSize: "12px",
                        fontWeight: 400,
                        letterSpacing: "-0.24px",
                        textTransform: "uppercase",
                        color: colors.subtleForeground,
                        margin: "0 0 4px 0",
                      }}
                    >
                      Impact
                    </Text>
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
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
                        fontFamily: fonts.mono,
                        fontSize: "12px",
                        fontWeight: 400,
                        letterSpacing: "-0.24px",
                        textTransform: "uppercase",
                        color: colors.subtleForeground,
                        margin: "0 0 4px 0",
                      }}
                    >
                      Effort
                    </Text>
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
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
                        fontFamily: fonts.mono,
                        fontSize: "12px",
                        fontWeight: 400,
                        letterSpacing: "-0.24px",
                        textTransform: "uppercase",
                        color: colors.subtleForeground,
                        margin: "0 0 8px 0",
                      }}
                    >
                      Problems Solved
                    </Text>
                    {opp.painPointsSolved.map((point, i) => (
                      <Text
                        key={i}
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          lineHeight: "22.4px",
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

          {/* CTA - Dark Section */}
          <Section
            style={{
              backgroundColor: colors.darkBg,
              padding: "48px 32px",
              textAlign: "center",
              borderRadius: "16px",
            }}
          >
            <Heading
              as="h3"
              style={{
                fontSize: "24px",
                fontWeight: 400,
                letterSpacing: "0",
                lineHeight: "24px",
                color: colors.lightOnDark,
                margin: "0 0 12px 0",
              }}
            >
              Ready to discuss these opportunities?
            </Heading>
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "21px",
                letterSpacing: "-0.28px",
                color: colors.mutedOnDark,
                margin: "0 0 28px 0",
              }}
            >
              Schedule a conversation with our AI advisors to explore how these opportunities could work for your business.
            </Text>
            <Button
              href="https://foremost.ai/contact"
              className="cta-button"
              style={{
                backgroundColor: colors.background,
                color: colors.foreground,
                border: `1px solid ${colors.border}`,
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: 400,
                textDecoration: "none",
                display: "inline-block",
                borderRadius: "4px",
              }}
            >
              Discuss with an Advisor →
            </Button>
          </Section>

          {/* Footer */}
          <Section style={{ marginTop: "48px" }}>
            <Hr style={{ border: "none", borderTop: `1px solid ${colors.border}`, margin: "0 0 24px 0" }} />
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: "12px",
                fontWeight: 400,
                letterSpacing: "-0.24px",
                color: colors.subtleForeground,
                margin: 0,
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
