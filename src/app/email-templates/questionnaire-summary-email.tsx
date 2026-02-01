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
  Preview,
} from "@react-email/components";

interface QuestionnaireSummaryEmailProps {
  summary: string;
  mode?: string;
  service?: string;
}

export function QuestionnaireSummaryEmail({
  summary,
  mode = "quote",
  service,
}: QuestionnaireSummaryEmailProps) {
  const preheaderText = service
    ? `New ${service} inquiry ready for review`
    : `New consultation inquiry completed - review responses`;

  // Factory.ai Design System
  const colors = {
    background: "#eeeeee",
    backgroundCard: "#fafafa",
    foreground: "#020202",
    accent: "#ee6018",
    accentLight: "#ef6f2e",
    mutedForeground: "#5c5855",
    subtleForeground: "#8a8380",
    border: "#b8b3b0",
  };

  const fonts = {
    sans: "Geist, 'Geist Fallback', ui-sans-serif, system-ui, sans-serif",
    mono: "'Geist Mono', 'Geist Mono Fallback', ui-monospace, monospace",
  };

  // Convert markdown to styled HTML for email
  const formatMarkdown = (text: string) => {
    return text
      // Main headings
      .replace(
        /^# (.*$)/gm,
        `<h1 style="font-family: ${fonts.sans}; font-size: 24px; font-weight: 400; letter-spacing: 0; line-height: 24px; margin: 32px 0 16px 0; color: ${colors.foreground}; border-bottom: 1px solid ${colors.border}; padding-bottom: 12px;">$1</h1>`
      )
      // Subheadings
      .replace(
        /^## (.*$)/gm,
        `<h2 style="font-family: ${fonts.sans}; font-size: 18px; font-weight: 400; letter-spacing: -0.36px; margin: 24px 0 12px 0; color: ${colors.foreground};">$2</h2>`
      )
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight: 400; color: ${colors.foreground};">$1</strong>`)
      // Italic text
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Horizontal rules (---)
      .replace(/^---$/gm, `<hr style="border: none; border-top: 1px solid ${colors.border}; margin: 24px 0;" />`)
      // List items
      .replace(
        /^(\s*)-\s+(.*$)/gm,
        `<div style="display: flex; margin-bottom: 8px; padding-left: 0;"><span style="color: ${colors.accent}; margin-right: 8px;">→</span><span>$2</span></div>`
      )
      // Double line breaks
      .replace(/\n\n/g, "<br /><br />")
      // Single line breaks
      .replace(/\n/g, "<br />");
  };

  const formattedSummary = formatMarkdown(summary);

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
            h1 { font-size: 24px !important; }
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
          <Section style={{ marginBottom: "40px" }}>
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
              <span style={{ color: colors.accent }}>●</span> New Inquiry
            </Text>

            <Heading
              as="h1"
              style={{
                fontSize: "32px",
                fontWeight: 400,
                letterSpacing: "-1.44px",
                lineHeight: "32px",
                color: colors.foreground,
                margin: 0,
              }}
            >
              Chat Questionnaire Completed
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
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Section>

          {/* Intro */}
          <Section
            style={{
              backgroundColor: colors.backgroundCard,
              border: `1px solid ${colors.border}`,
              padding: "20px 24px",
              marginBottom: "32px",
              borderRadius: "6px",
            }}
          >
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "21px",
                letterSpacing: "-0.28px",
                color: colors.foreground,
                margin: 0,
              }}
            >
              A potential client has completed the intake questionnaire via the chat widget. Below is the AI-generated summary and full conversation history.
            </Text>
          </Section>

          <Hr style={{ border: "none", borderTop: `1px solid ${colors.border}`, margin: "0 0 32px 0" }} />

          {/* Summary Content */}
          <Section style={{ marginBottom: "32px" }}>
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "21px",
                letterSpacing: "-0.28px",
                color: colors.foreground,
              }}
              dangerouslySetInnerHTML={{ __html: formattedSummary }}
            />
          </Section>

          {/* Footer */}
          <Hr style={{ border: "none", borderTop: `1px solid ${colors.border}`, margin: "32px 0 24px 0" }} />
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
            Captured via{" "}
            <Link href="https://foremost.ai" style={{ color: colors.accent, textDecoration: "none" }}>
              Foremost.ai
            </Link>{" "}
            Chat Widget
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default QuestionnaireSummaryEmail;
