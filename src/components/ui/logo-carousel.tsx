"use client";

import { useState, useEffect, useRef, memo } from "react";
import { m, useReducedMotion, useMotionValue, useAnimationFrame } from "motion/react";
import { Text } from "./text";

const clients = [
  { name: "Meridian Capital", initials: "MC" },
  { name: "Northbridge Partners", initials: "NP" },
  { name: "Atlas Industries", initials: "AI" },
  { name: "Vanguard Health", initials: "VH" },
  { name: "Sterling Finance", initials: "SF" },
  { name: "Apex Manufacturing", initials: "AM" },
  { name: "Horizon Logistics", initials: "HL" },
  { name: "Pinnacle Group", initials: "PG" },
  { name: "Evergreen Capital", initials: "EC" },
  { name: "Blackstone Advisory", initials: "BA" },
  { name: "Quantum Dynamics", initials: "QD" },
  { name: "Oaktree Holdings", initials: "OH" },
  { name: "Summit Partners", initials: "SP" },
  { name: "Granite Systems", initials: "GS" },
  { name: "Cardinal Health Group", initials: "CH" },
  { name: "Regency Investments", initials: "RI" },
];

const LogoItem = memo(function LogoItem({
  client,
  isHovered,
}: {
  client: (typeof clients)[number];
  isHovered: boolean;
}) {
  return (
    <m.div
      className="flex items-center gap-2.5 text-foreground-muted px-4 sm:px-6 shrink-0 cursor-default"
      whileHover={{ scale: 1.02 }}
      animate={{
        opacity: isHovered ? 0.6 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <m.span
        className="w-9 h-9 rounded-md bg-surface-subtle flex items-center justify-center text-xs font-mono"
        whileHover={{
          scale: 1.08,
          backgroundColor: "rgba(0,0,0,0.05)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {client.initials}
      </m.span>
      <span className="text-sm font-medium tracking-tight whitespace-nowrap">
        {client.name}
      </span>
    </m.div>
  );
});

export function LogoCarousel() {
  const prefersReducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const x = useMotionValue(0);

  // Measure track width for animation
  useEffect(() => {
    if (containerRef.current) {
      const firstTrack = containerRef.current.querySelector(
        "[data-track]"
      ) as HTMLElement;
      if (firstTrack) {
        setTrackWidth(firstTrack.offsetWidth);
      }
    }
  }, []);

  // Pixels per second for consistent speed
  const speed = trackWidth / 40;

  // Continuous animation using useAnimationFrame for smooth pause/resume
  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || isPaused || trackWidth === 0) return;

    // Move based on delta time for consistent speed regardless of frame rate
    const movement = (delta / 1000) * speed;
    let newX = x.get() - movement;

    // Loop back when we've scrolled one full track width
    if (newX <= -trackWidth) {
      newX = newX + trackWidth;
    }

    x.set(newX);
  });

  return (
    <div className="py-10 sm:py-12 md:py-14 border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-9">
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
        >
          <Text
            variant="small"
            className="text-foreground-subtle text-center mb-8"
          >
            Trusted by leadership teams at
          </Text>
        </m.div>
      </div>

      {/* Carousel container with gradient masks */}
      <m.div
        ref={containerRef}
        className="relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredIndex(null);
        }}
      >
        {/* Left gradient mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        {/* Right gradient mask */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <m.div
          className="flex"
          style={{ x, willChange: "transform" }}
        >
          {/* First set of logos */}
          <div data-track className="flex items-center py-2 shrink-0">
            {clients.map((client, index) => (
              <div
                key={client.name}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <LogoItem
                  client={client}
                  isHovered={hoveredIndex !== null && hoveredIndex !== index}
                />
              </div>
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div
            className="flex items-center py-2 shrink-0"
            aria-hidden="true"
          >
            {clients.map((client, index) => (
              <div
                key={`dup-${client.name}`}
                onMouseEnter={() => setHoveredIndex(index + clients.length)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <LogoItem
                  client={client}
                  isHovered={
                    hoveredIndex !== null &&
                    hoveredIndex !== index + clients.length
                  }
                />
              </div>
            ))}
          </div>
        </m.div>
      </m.div>
    </div>
  );
}
