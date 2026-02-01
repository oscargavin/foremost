"use client";

import { m } from "motion/react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion";
import { SectionLabel } from "./section-label";
import { Heading } from "./heading";

const testimonials = [
  {
    quote:
      "Foremost helped us cut through 18 months of AI pilots going nowhere. Within 90 days, we had a clear roadmap and our first production deployment affecting real revenue.",
    name: "Sarah Chen",
    title: "Chief Strategy Officer",
    company: "Meridian Capital",
    metric: "90 days to production",
  },
  {
    quote:
      "Most consultants gave us a 200-page report. Foremost gave us three decisions that mattered and helped us make them. Our board finally understands our AI strategy.",
    name: "James Thornton",
    title: "CEO",
    company: "Northbridge Partners",
    metric: "3 key decisions",
  },
  {
    quote:
      "They didn't try to sell us AI everything. They helped us identify the two processes where AI would actually move the needle, then made sure it happened.",
    name: "Dr. Priya Sharma",
    title: "Chief Operating Officer",
    company: "Vanguard Health Systems",
    metric: "2 high-impact processes",
  },
];

// Stagger container variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
} as const;

// Card variants with spring physics
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

// Metric badge variants
const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 25,
      delay: 0.1,
    },
  },
};

interface TestimonialsProps {
  className?: string;
}

export function Testimonials({ className }: TestimonialsProps) {
  return (
    <div className={cn("py-12 sm:py-16 md:py-20", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-9">
        <FadeIn>
          <div className="mb-12">
            <SectionLabel className="mb-4">What Leaders Say</SectionLabel>
            <Heading as="h2" size="section">
              Results that matter
            </Heading>
          </div>
        </FadeIn>

        <m.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {testimonials.map((testimonial) => (
            <m.div
              key={testimonial.name}
              variants={cardVariants}
              whileHover={{
                y: -4,
                boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.12)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="h-full p-4 sm:p-6 bg-background-card border border-border rounded-[6px] flex flex-col cursor-default"
            >
              <m.div className="mb-4" variants={badgeVariants}>
                <span className="inline-block px-3 py-1 bg-accent-orange/10 text-accent-orange text-sm font-mono rounded-full">
                  {testimonial.metric}
                </span>
              </m.div>
              <blockquote className="flex-1 mb-6">
                <p className="text-foreground leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <m.div
                  className="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center text-sm font-medium text-foreground-muted"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </m.div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-foreground-muted">
                    {testimonial.title}, {testimonial.company}
                  </p>
                </div>
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </div>
  );
}
