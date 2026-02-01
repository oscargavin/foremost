"use client";

import { m } from "motion/react";
import { Text } from "./text";

const clients = [
  { name: "Meridian Capital", initials: "MC" },
  { name: "Northbridge Partners", initials: "NP" },
  { name: "Atlas Industries", initials: "AI" },
  { name: "Vanguard Health", initials: "VH" },
  { name: "Sterling Finance", initials: "SF" },
  { name: "Apex Manufacturing", initials: "AM" },
];

// Stagger container for viewport-triggered animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

export function LogoCarousel() {
  return (
    <div className="py-8 sm:py-10 md:py-12 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-9">
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
        >
          <Text variant="small" className="text-foreground-subtle text-center mb-8">
            Trusted by leadership teams at
          </Text>
        </m.div>
        <m.div
          className="flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-8 md:gap-x-12 gap-y-4 sm:gap-y-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {clients.map((client) => (
            <m.div
              key={client.name}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors duration-200 cursor-default"
            >
              <m.span
                className="w-8 h-8 rounded bg-surface-subtle flex items-center justify-center text-xs font-mono"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {client.initials}
              </m.span>
              <span className="text-sm font-medium tracking-tight">
                {client.name}
              </span>
            </m.div>
          ))}
        </m.div>
      </div>
    </div>
  );
}
