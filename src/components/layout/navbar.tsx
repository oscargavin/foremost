"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "motion/react";
import { Container } from "./container";
import { Button } from "@/components/ui";
import { useScrollDirection } from "@/hooks";

const navLinks = [
  { href: "/who-we-are", label: "Who We Are" },
  { href: "/how-we-think", label: "How We Think" },
  { href: "/how-we-work", label: "How We Work" },
  { href: "/careers", label: "Careers" },
];

const industryLinks = [
  { href: "/industries/financial-services", label: "Financial Services" },
  { href: "/industries/healthcare", label: "Healthcare" },
  { href: "/industries/retail", label: "Retail" },
  { href: "/industries/manufacturing", label: "Manufacturing" },
  { href: "/industries/professional-services", label: "Professional Services" },
  { href: "/industries/energy", label: "Energy" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const { scrollDirection, isAtTop } = useScrollDirection({ threshold: 10 });

  // Hide navbar when scrolling down (unless mobile menu is open)
  const shouldHide = scrollDirection === "down" && !isAtTop && !mobileMenuOpen;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [focusedDropdownIndex, setFocusedDropdownIndex] = useState(-1);

  // Check if a link is the current page
  const isCurrentPage = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIndustriesOpen(false);
        setFocusedDropdownIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle dropdown keyboard navigation
  const handleDropdownKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!industriesOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setIndustriesOpen(true);
          setFocusedDropdownIndex(0);
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setIndustriesOpen(false);
          setFocusedDropdownIndex(-1);
          dropdownButtonRef.current?.focus();
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusedDropdownIndex((prev) =>
            prev < industryLinks.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedDropdownIndex((prev) =>
            prev > 0 ? prev - 1 : industryLinks.length - 1
          );
          break;
        case "Home":
          e.preventDefault();
          setFocusedDropdownIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedDropdownIndex(industryLinks.length - 1);
          break;
        case "Tab":
          setIndustriesOpen(false);
          setFocusedDropdownIndex(-1);
          break;
      }
    },
    [industriesOpen]
  );

  // Focus dropdown item when index changes
  useEffect(() => {
    if (focusedDropdownIndex >= 0 && industriesOpen) {
      dropdownItemsRef.current[focusedDropdownIndex]?.focus();
    }
  }, [focusedDropdownIndex, industriesOpen]);

  // Handle mobile menu keyboard navigation
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };

    // Trap focus within mobile menu
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !mobileMenuRef.current) return;

      const focusableElements = mobileMenuRef.current.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleFocusTrap);

    // Focus first link when menu opens
    const timer = setTimeout(() => {
      const firstLink = mobileMenuRef.current?.querySelector("a");
      firstLink?.focus();
    }, 100);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleFocusTrap);
      clearTimeout(timer);
    };
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <m.header
      className="sticky top-0 z-50 h-14 sm:h-16 md:h-[65px] bg-background"
      initial={false}
      animate={{
        y: shouldHide ? "-100%" : 0,
      }}
      transition={{
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <Container className="h-full">
        <nav className="flex items-center justify-between h-full" aria-label="Main navigation">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center group"
            aria-label="Foremost.ai - Go to homepage"
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <span className="font-sans text-xl tracking-tight text-foreground">
              foremost<span className="text-accent-orange transition-transform duration-200 inline-block group-hover:scale-125 animate-logo-pulse" aria-hidden="true">.</span>ai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base text-foreground-secondary hover:text-foreground transition-colors duration-200"
                aria-current={isCurrentPage(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}

            {/* Industries Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                ref={dropdownButtonRef}
                onClick={() => setIndustriesOpen(!industriesOpen)}
                onKeyDown={handleDropdownKeyDown}
                className="flex items-center gap-1 text-base text-foreground-secondary hover:text-foreground transition-colors duration-200"
                aria-expanded={industriesOpen}
                aria-haspopup="menu"
                aria-controls="industries-menu"
              >
                Industries
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                  className={`transition-transform duration-200 ${industriesOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <AnimatePresence>
                {industriesOpen && (
                  <m.div
                    id="industries-menu"
                    role="menu"
                    aria-label="Industries"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute top-full left-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg py-2"
                    onKeyDown={handleDropdownKeyDown}
                  >
                    {industryLinks.map((link, index) => (
                      <Link
                        key={link.href}
                        ref={(el) => {
                          dropdownItemsRef.current[index] = el;
                        }}
                        href={link.href}
                        role="menuitem"
                        className="block px-4 py-2 text-sm text-foreground-secondary hover:text-foreground hover:bg-background-card focus:bg-background-card focus:outline-none transition-colors duration-150"
                        onClick={() => {
                          setIndustriesOpen(false);
                          setFocusedDropdownIndex(-1);
                        }}
                        aria-current={isCurrentPage(link.href) ? "page" : undefined}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button href="/contact" variant="primary">
              Contact
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={mobileMenuButtonRef}
            className="md:hidden p-3 -mr-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-foreground"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </nav>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            id="mobile-menu"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden bg-background border-t border-border overflow-hidden"
          >
            <Container className="py-6">
              <nav aria-label="Mobile navigation">
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg text-foreground-secondary hover:text-foreground transition-colors duration-200 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isCurrentPage(link.href) ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {/* Mobile Industries Section */}
                  <div className="pt-4 border-t border-border">
                    <span className="text-sm text-foreground-muted mb-3 block" id="mobile-industries-label">
                      Industries
                    </span>
                    <div className="flex flex-col gap-2" role="list" aria-labelledby="mobile-industries-label">
                      {industryLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          role="listitem"
                          className="text-base text-foreground-secondary hover:text-foreground transition-colors duration-200 py-1 pl-2"
                          onClick={() => setMobileMenuOpen(false)}
                          aria-current={isCurrentPage(link.href) ? "page" : undefined}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <Button href="/contact" variant="primary" className="w-full">
                      Contact
                    </Button>
                  </div>
                </div>
              </nav>
            </Container>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
}
