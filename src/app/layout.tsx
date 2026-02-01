import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion";
import { SkipLink, ScrollProgress, ErrorBoundary, ChatFallback } from "@/components/ui";
import {
  SchemaScript,
  organizationSchema,
  websiteSchema,
} from "@/components/seo";
import { ClaudeChat } from "@/components/chat";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://foremost.ai"),
  title: {
    default: "Board-Level AI Advisory - Strategic Clarity for Leaders | Foremost",
    template: "%s",
  },
  description:
    "Applied intelligence for the boardroom. We help boards and executive teams cut through AI noise with clarity, rigour, and measurable outcomes.",
  keywords: [
    "AI advisory",
    "board advisory",
    "AI strategy",
    "executive AI",
    "AI governance",
    "UK AI consultancy",
    "AI consulting",
    "board-level AI",
  ],
  authors: [{ name: "Foremost.ai" }],
  other: {
    "theme-color": "#eeeeee",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://foremost.ai",
    siteName: "Foremost.ai",
    title: "Board-Level AI Advisory - Strategic Clarity for Leaders | Foremost",
    description:
      "Applied intelligence for the boardroom. Cut through AI noise with clarity, rigour, and measurable outcomes.",
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
    title: "Board-Level AI Advisory - Strategic Clarity for Leaders | Foremost",
    description:
      "Applied intelligence for the boardroom. Cut through AI noise with clarity, rigour, and measurable outcomes.",
    images: ["https://foremost.ai/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <SchemaScript schema={[organizationSchema, websiteSchema]} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SkipLink />
        <MotionProvider>
          <ScrollProgress />
          {children}
          <ErrorBoundary fallback={<ChatFallback />}>
            <Suspense fallback={null}>
              <ClaudeChat />
            </Suspense>
          </ErrorBoundary>
        </MotionProvider>
      </body>
    </html>
  );
}
