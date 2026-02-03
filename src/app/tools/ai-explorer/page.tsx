import { Metadata } from "next";
import { Container, Section } from "@/components/layout";
import { AIExplorer } from "@/components/explorer";

export const metadata: Metadata = {
  title: "AI Use Case Explorer | Foremost.ai",
  description:
    "Discover strategic AI opportunities tailored to your business. Enter your website and get a personalised analysis of how AI can transform your operations.",
  alternates: {
    canonical: "/tools/ai-explorer",
  },
  openGraph: {
    title: "AI Use Case Explorer | Foremost.ai",
    description:
      "Discover strategic AI opportunities tailored to your business. Free analysis tool from Foremost.ai.",
    url: "https://foremost.ai/tools/ai-explorer",
    type: "website",
    images: [
      {
        url: "https://foremost.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Use Case Explorer - Foremost.ai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Use Case Explorer | Foremost.ai",
    description:
      "Discover strategic AI opportunities tailored to your business. Free analysis tool from Foremost.ai.",
    images: ["https://foremost.ai/og-image.png"],
  },
};

export default function AIExplorerPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      {/* Top spacing to clear navbar */}
      <div className="pt-4 sm:pt-8 md:pt-12 lg:pt-16" />

      {/* Main tool section */}
      <Section className="py-8 sm:py-12 md:py-16 lg:py-20 min-h-[85vh]">
        <Container>
          <AIExplorer />
        </Container>
      </Section>
    </main>
  );
}
