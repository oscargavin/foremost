"use client";

import { m } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LinkWithArrowProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function LinkWithArrow({
  href,
  children,
  className,
  external = false,
}: LinkWithArrowProps) {
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <m.div
      className={cn("inline-flex items-center gap-1 group", className)}
      whileHover="hover"
    >
      <Link
        href={href}
        className="text-base font-normal text-foreground hover:text-foreground-secondary transition-colors duration-200"
        {...linkProps}
      >
        {children}
      </Link>
      <m.svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-foreground"
        variants={{
          hover: { x: 4 },
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <path
          d="M3.333 8h9.334M8.667 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </m.svg>
    </m.div>
  );
}
