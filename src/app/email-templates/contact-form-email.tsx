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
  Row,
  Column,
} from "@react-email/components";

interface ContactFormEmailProps {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export function ContactFormEmail({
  name,
  email,
  company,
  message,
}: ContactFormEmailProps) {
  const preheaderText = `New contact from ${name}${company ? ` at ${company}` : ""}`;

  // Factory.ai Design System
  const colors = {
    background: "#eeeeee",
    backgroundCard: "#fafafa",
    foreground: "#020202",
    accent: "#ee6018",
    accentBorder: "#d15010",
    mutedForeground: "#5c5855",
    subtleForeground: "#8a8380",
    border: "#b8b3b0",
  };

  const fonts = {
    sans: "Geist, 'Geist Fallback', ui-sans-serif, system-ui, sans-serif",
    mono: "'Geist Mono', 'Geist Mono Fallback', ui-monospace, monospace",
  };

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
              <span style={{ color: colors.accent }}>●</span> Contact Form
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
              New Message from {name}
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

          {/* Contact Details Card */}
          <Section
            style={{
              backgroundColor: colors.backgroundCard,
              border: `1px solid ${colors.border}`,
              padding: "24px",
              marginBottom: "32px",
              borderRadius: "6px",
            }}
          >
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: "12px",
                fontWeight: 400,
                letterSpacing: "-0.24px",
                textTransform: "uppercase",
                color: colors.foreground,
                margin: "0 0 20px 0",
              }}
            >
              <span style={{ color: colors.accent }}>●</span> 01 — Contact Details
            </Text>

            <Row style={{ marginBottom: "12px" }}>
              <Column style={{ width: "80px" }}>
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
                  Name
                </Text>
              </Column>
              <Column>
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: colors.foreground,
                    margin: 0,
                  }}
                >
                  {name}
                </Text>
              </Column>
            </Row>

            <Row style={{ marginBottom: "12px" }}>
              <Column style={{ width: "80px" }}>
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
                  Email
                </Text>
              </Column>
              <Column>
                <Link
                  href={`mailto:${email}`}
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: colors.accent,
                    textDecoration: "none",
                  }}
                >
                  {email}
                </Link>
              </Column>
            </Row>

            {company && (
              <Row>
                <Column style={{ width: "80px" }}>
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
                    Company
                  </Text>
                </Column>
                <Column>
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: colors.foreground,
                      margin: 0,
                    }}
                  >
                    {company}
                  </Text>
                </Column>
              </Row>
            )}
          </Section>

          {/* Message */}
          <Section style={{ marginBottom: "32px" }}>
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
              <span style={{ color: colors.accent }}>●</span> 02 — Message
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
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "21px",
                  letterSpacing: "-0.28px",
                  color: colors.foreground,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                }}
              >
                {message}
              </Text>
            </Section>
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
            Submitted via{" "}
            <Link
              href="https://foremost.ai/contact"
              style={{ color: colors.accent, textDecoration: "none" }}
            >
              Foremost.ai
            </Link>{" "}
            Contact Form
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ContactFormEmail;
