"use client";

import { useState } from "react";
import { m, AnimatePresence, MotionConfig } from "framer-motion";
import { cn } from "@/lib/utils";
import { Heading } from "./heading";
import { Text } from "./text";
import { LinkWithArrow } from "./link-with-arrow";

interface SubService {
  title: string;
  description: string;
}

interface ServiceCategory {
  label: string;
  items: SubService[];
}

interface ServiceAccordionItemProps {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  categories?: ServiceCategory[];
  href: string;
  linkText: string;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

// Spring physics for natural motion
const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

function ServiceAccordionItem({
  number,
  title,
  subtitle,
  description,
  categories,
  href,
  linkText,
  isExpanded,
  onToggle,
  index,
}: ServiceAccordionItemProps) {
  const hasSubServices = categories && categories.length > 0;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.4, delay: index * 0.1 },
        y: { duration: 0.5, delay: index * 0.1, ease: easeOutExpo },
      }}
      className={cn(
        "rounded-lg border overflow-hidden",
        "bg-background-card transition-shadow duration-300",
        isExpanded
          ? "border-accent-orange/40 shadow-xl shadow-accent-orange/[0.08]"
          : "border-border hover:border-foreground-secondary/60"
      )}
    >
      {/* Header - Touch-friendly (min 44px target) */}
      <button
        onClick={onToggle}
        className={cn(
          "w-full text-left",
          // Mobile-first padding: comfortable touch on small screens
          "p-4 sm:p-5 md:p-6",
          // Touch target compliance
          "min-h-[88px]",
          "hover:bg-accent-orange/[0.02] transition-colors duration-150",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:shadow-[0_0_0_4px_rgba(238,96,24,0.12)]"
        )}
        aria-expanded={isExpanded}
      >
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            {/* Number + Subtitle row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <span
                className={cn(
                  "font-mono text-xs sm:text-sm transition-colors duration-200",
                  isExpanded ? "text-accent-orange" : "text-foreground-muted"
                )}
              >
                {number}
              </span>
              <span
                className={cn(
                  "font-mono text-[10px] sm:text-xs uppercase tracking-wider transition-colors duration-200",
                  isExpanded ? "text-accent-orange/70" : "text-foreground-muted/60"
                )}
              >
                {subtitle}
              </span>
            </div>
            <Heading as="h3" size="card" className="mb-1.5 sm:mb-2">
              {title}
            </Heading>
            <Text
              variant="muted"
              className="line-clamp-2 text-sm sm:text-base leading-relaxed"
            >
              {description}
            </Text>
          </div>

          {/* Expand/Collapse indicator - adequate touch size */}
          {hasSubServices && (
            <m.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={springTransition}
              className={cn(
                "flex-shrink-0 rounded-full border flex items-center justify-center transition-colors duration-200",
                // Touch-friendly size on mobile (44px), slightly smaller on desktop
                "w-10 h-10 sm:w-9 sm:h-9 md:w-8 md:h-8",
                isExpanded
                  ? "bg-accent-orange border-accent-orange"
                  : "bg-transparent border-border"
              )}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={cn(
                  "transition-colors duration-200",
                  isExpanded ? "text-white" : "text-foreground-muted"
                )}
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </m.div>
          )}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence initial={false}>
        {isExpanded && hasSubServices && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.4, ease: easeOutExpo },
                opacity: { duration: 0.3, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3, ease: [0.4, 0, 1, 1] },
                opacity: { duration: 0.2 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6">
              {/* Animated Divider */}
              <m.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
                className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4 sm:mb-5 md:mb-6 origin-left"
              />

              {/* Categories */}
              <div className="space-y-6 sm:space-y-7 md:space-y-8">
                {categories.map((category, categoryIndex) => (
                  <m.div
                    key={categoryIndex}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.15 + categoryIndex * 0.1,
                      ease: easeOutExpo,
                    }}
                  >
                    {category.label && (
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <m.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                            delay: 0.2 + categoryIndex * 0.1,
                          }}
                          className="w-1.5 h-1.5 rounded-full bg-accent-orange"
                        />
                        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-foreground-muted">
                          {category.label}
                        </span>
                      </div>
                    )}
                    {/* Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {category.items.map((item, itemIndex) => (
                        <m.div
                          key={itemIndex}
                          initial={{ opacity: 0, y: 16, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.2 + categoryIndex * 0.1 + itemIndex * 0.04,
                            ease: easeOutExpo,
                          }}
                          whileHover={{
                            y: -2,
                            transition: { duration: 0.2 },
                          }}
                          className={cn(
                            "group rounded-md bg-background/50 border border-border/50",
                            "hover:border-accent-orange/30 hover:bg-background hover:shadow-md hover:shadow-accent-orange/[0.04]",
                            "transition-shadow duration-200",
                            // Mobile-first padding
                            "p-3 sm:p-4"
                          )}
                        >
                          <h4 className="text-sm font-medium text-foreground mb-1 sm:mb-1.5 group-hover:text-accent-orange transition-colors duration-200">
                            {item.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                            {item.description}
                          </p>
                        </m.div>
                      ))}
                    </div>
                  </m.div>
                ))}
              </div>

              {/* Link with reveal animation */}
              <m.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4, ease: easeOutExpo }}
                className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-border/50"
              >
                <LinkWithArrow href={href}>{linkText}</LinkWithArrow>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Link when collapsed - with fade transition */}
      <AnimatePresence>
        {!isExpanded && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6"
          >
            <LinkWithArrow href={href}>{linkText}</LinkWithArrow>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

export interface ServiceData {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  categories?: ServiceCategory[];
  href: string;
  linkText: string;
}

interface ServiceAccordionProps {
  services: ServiceData[];
  className?: string;
}

export function ServiceAccordion({ services, className }: ServiceAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <MotionConfig reducedMotion="user">
      <div className={cn("flex flex-col gap-3 sm:gap-4", className)}>
        {services.map((service, index) => (
          <ServiceAccordionItem
            key={service.number}
            {...service}
            index={index}
            isExpanded={expandedIndex === index}
            onToggle={() =>
              setExpandedIndex(expandedIndex === index ? null : index)
            }
          />
        ))}
      </div>
    </MotionConfig>
  );
}
