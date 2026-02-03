"use client";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { FadeIn } from "@/components/motion";

interface CTACardProps {
  label?: string;
  topRightLink?: {
    text: string;
    href: string;
  };
  heading: string;
  description?: string;
  buttonText: string;
  buttonHref: string;
  className?: string;
}

export function CTACard({
  label,
  topRightLink,
  heading,
  description,
  buttonText,
  buttonHref,
  className,
}: CTACardProps) {
  return (
    <div className={cn("py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-9", className)}>
      <FadeIn>
        <div className="max-w-7xl mx-auto">
          {/* Editorial frame */}
          <div className="relative border border-white/10 bg-background-dark">
            {/* Corner accent marks */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent-orange" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-accent-orange" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-accent-orange" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent-orange" />

            {/* Split screen layout */}
            <div className="grid md:grid-cols-2 gap-0 md:divide-x divide-white/10">
              {/* Left: Editorial quote/heading */}
              <div className="p-8 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center border-b md:border-b-0 border-white/10 bg-background-dark">
                {topRightLink && (
                  <div className="mb-8 md:mb-12">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                      {topRightLink.text}
                    </span>
                  </div>
                )}

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-[-0.02em] text-white font-light mb-0">
                  {heading}
                </h2>

                {label && (
                  <div className="mt-8 md:mt-12 pt-6 border-t border-white/10">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                      {label}
                    </span>
                  </div>
                )}
              </div>

              {/* Right: Description and action */}
              <div className="p-8 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center bg-background-dark">
                {description && (
                  <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/50 mb-10 md:mb-12 max-w-lg">
                    {description}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <Button href={buttonHref} size="lg" variant="secondary" magnetic>
                    {buttonText}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="ml-2"
                    >
                      <path
                        d="M3.333 8h9.334M8.667 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>

                  {topRightLink && (
                    <a
                      href={topRightLink.href}
                      className="text-sm text-white/40 hover:text-white/70 transition-colors font-mono"
                    >
                      or {topRightLink.text.toLowerCase()} →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
