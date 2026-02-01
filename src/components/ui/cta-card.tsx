import Link from "next/link";
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
  label = "Get Started",
  topRightLink,
  heading,
  description,
  buttonText,
  buttonHref,
  className,
}: CTACardProps) {
  return (
    <div className={cn("py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-9", className)}>
      <FadeIn>
        <div className="max-w-3xl mx-auto">
          <div
            className={cn(
              "relative",
              "bg-background-button rounded-lg p-5 sm:p-8 md:p-10"
            )}
            style={{
              border: "3px dashed rgba(255, 255, 255, 0.4)",
            }}
          >
            {/* Subtle diagonal lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  -55deg,
                  transparent,
                  transparent 8px,
                  rgba(255,255,255,0.04) 8px,
                  rgba(255,255,255,0.04) 9px
                )`,
              }}
            />

            {/* Content */}
            <div className="relative">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-12 sm:mb-16 md:mb-20">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-orange flex-shrink-0" />
                {topRightLink && (
                  <span className="font-mono text-xs uppercase tracking-widest text-white/40">
                    {topRightLink.text}
                  </span>
                )}
              </div>

              {/* Main content */}
              <div className="max-w-xl mb-12 sm:mb-16 md:mb-20">
                <h2 className="text-[28px] sm:text-[36px] md:text-[42px] leading-[1.15] tracking-[-0.02em] text-white mb-6">
                  {heading}
                </h2>

                {description && (
                  <p className="text-base sm:text-lg text-white/50 font-mono mb-8">
                    {description}
                  </p>
                )}

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
              </div>

              {/* Bottom bar */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <span className="font-mono text-xs uppercase tracking-widest text-white/30">
                  {label}
                </span>
                <span className="font-mono text-xs text-white/30">
                  foremost.ai
                </span>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
