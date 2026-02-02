import { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "./booking-form";

export const metadata: Metadata = {
  title: "Book a Call | Foremost",
  description:
    "Schedule a consultation call with our AI strategy experts. Pick a time that works for you.",
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    title: "Book a Call | Foremost",
    description:
      "Schedule a consultation call with our AI strategy experts. Pick a time that works for you.",
    url: "https://foremost.ai/book",
    type: "website",
    images: [
      {
        url: "https://foremost.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Foremost.ai - Book a Call",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Call | Foremost",
    description:
      "Schedule a consultation call with our AI strategy experts. Pick a time that works for you.",
    images: ["https://foremost.ai/og-image.png"],
  },
};

function BookingFormSkeleton() {
  return (
    <div className="flex">
      {/* Left panel skeleton */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] bg-background-card bg-pattern-grid-subtle border-r border-border p-12 flex-col justify-between">
        <div className="space-y-8">
          <div className="w-48 h-8 bg-surface-subtle rounded animate-pulse" />
          <div className="space-y-3">
            <div className="w-full h-4 bg-surface-subtle rounded animate-pulse" />
            <div className="w-3/4 h-4 bg-surface-subtle rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-surface-subtle animate-pulse" />
              <div className="w-24 h-4 bg-surface-subtle rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      {/* Right panel skeleton */}
      <div className="flex-1 p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-lg space-y-8">
          <div className="space-y-4">
            <div className="w-32 h-6 bg-surface-subtle rounded animate-pulse" />
            <div className="w-64 h-10 bg-surface-subtle rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="aspect-square bg-surface-subtle rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Suspense fallback={<BookingFormSkeleton />}>
        <BookingForm />
      </Suspense>
    </main>
  );
}
