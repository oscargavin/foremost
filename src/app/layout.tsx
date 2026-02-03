import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion";
import { Navbar, Footer } from "@/components/layout";
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
    default: "Foremost.ai | Board-Level AI Advisory",
    template: "%s",
  },
  description:
    "Applied intelligence for boards and executive teams. We help leaders navigate AI with clarity, confidence, and measurable outcomes. Strategic AI advisory for UK and EU organisations.",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://foremost.ai",
    siteName: "Foremost.ai",
    title: "Foremost.ai | Board-Level AI Advisory",
    description:
      "Applied intelligence for boards and executive teams. Strategic AI advisory that brings clarity, confidence, and measurable outcomes.",
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
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eeeeee" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
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
          <Navbar />
          {children}
          <Footer />
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
