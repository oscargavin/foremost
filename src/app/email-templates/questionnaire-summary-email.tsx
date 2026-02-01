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
  mode = 'quote',
  service,
}: QuestionnaireSummaryEmailProps) {
  // Generate pre-header text for inbox preview
  const preheaderText = service
    ? `New ${service} inquiry ready for review`
    : `New consultation inquiry completed - review responses`;

  // Design system aligned with Foremost
  const colors = {
    background: "#eeeeee",
    backgroundCard: "#fafafa",
    foreground: "#020202",
    accent: "#ee6018",
    accentLight: "#fef3ee",
    muted: "#f5f5f5",
    mutedForeground: "#666260",
    border: "#b8b3b0",
  };

  // Convert markdown to styled HTML for email
  const formatMarkdown = (text: string) => {
    return text
      // Main headings
      .replace(
        /^# (.*$)/gm,
        `<h1 style="font-size: 20px; font-weight: 500; letter-spacing: -0.02em; margin: 32px 0 16px 0; color: ${colors.foreground}; border-bottom: 1px solid ${colors.border}; padding-bottom: 12px;">$1</h1>`
      )
      // Subheadings
      .replace(
        /^## (.*$)/gm,
        `<h2 style="font-size: 16px; font-weight: 500; letter-spacing: -0.01em; margin: 24px 0 12px 0; color: ${colors.foreground};">$1</h2>`
      )
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight: 500; color: ${colors.foreground};">$1</strong>`)
      // Italic text
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Horizontal rules (---)
      .replace(/^---$/gm, `<hr style="border: none; border-top: 1px solid ${colors.border}; margin: 24px 0;" />`)
      // List items - wrap in styled list
      .replace(
        /^(\s*)-\s+(.*$)/gm,
        `<div style="display: flex; margin-bottom: 8px; padding-left: 0;"><span style="color: ${colors.accent}; margin-right: 8px;">→</span><span>$2</span></div>`
      )
      // Double line breaks
      .replace(/\n\n/g, "<br /><br />")
      // Single line breaks (be careful with this)
      .replace(/\n/g, "<br />");
  };

  const formattedSummary = formatMarkdown(summary);

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
          @media only screen and (max-width: 600px) {
            .container { padding: 32px 16px !important; }
            h1 { font-size: 24px !important; }
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
          <Section style={{ marginBottom: "40px" }}>
            <Text
              style={{
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: colors.accent,
                margin: "0 0 8px 0",
              }}
            >
              New Inquiry
            </Text>

            <Heading
              as="h1"
              style={{
                fontSize: "28px",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: colors.foreground,
                margin: 0,
              }}
            >
              Chat Questionnaire Completed
            </Heading>

            <Text
              style={{
                fontSize: "13px",
                color: colors.mutedForeground,
                margin: "12px 0 0 0",
              }}
            >
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </Text>
          </Section>

          {/* Intro */}
          <Section
            style={{
              backgroundColor: colors.backgroundCard,
              padding: "20px 24px",
              marginBottom: "32px",
              borderRadius: "8px",
            }}
          >
            <Text
              style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: colors.foreground,
                margin: 0,
              }}
            >
              A potential client has completed the intake questionnaire via the chat widget. Below is the AI-generated summary and full conversation history.
            </Text>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "0 0 32px 0" }} />

          {/* Summary Content */}
          <Section style={{ marginBottom: "32px" }}>
            <div
              style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: colors.foreground,
              }}
              dangerouslySetInnerHTML={{ __html: formattedSummary }}
            />
          </Section>

          {/* Footer */}
          <Hr style={{ borderColor: colors.border, margin: "32px 0 24px 0" }} />
          <Text
            style={{
              fontSize: "11px",
              color: colors.mutedForeground,
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
