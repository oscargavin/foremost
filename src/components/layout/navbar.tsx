"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback, useLayoutEffect, useMemo } from "react";
import { m, AnimatePresence } from "motion/react";
import { Container } from "./container";
import { Button } from "@/components/ui";
import { useScrollDirection } from "@/hooks";

const navLinks = [
  { href: "/who-we-are", label: "Who We Are" },
  { href: "/how-we-think", label: "How We Think" },
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

  // Refs for sliding underline
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [isUnderlineVisible, setIsUnderlineVisible] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Find which nav item is active (-1 if none) - memoized to prevent recalculation
  const activeIndex = useMemo(() => {
    if (pathname.startsWith("/industries")) {
      return navLinks.length; // Industries is the last item
    }
    return navLinks.findIndex((link) => pathname.startsWith(link.href));
  }, [pathname]);

  // Measure and update underline position
  const updateUnderlinePosition = useCallback(() => {
    const container = navContainerRef.current;

    if (activeIndex === -1 || !container) {
      setIsUnderlineVisible(false);
      return;
    }

    const activeElement = navItemRefs.current[activeIndex];
    if (!activeElement) {
      setIsUnderlineVisible(false);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeElement.getBoundingClientRect();

    setUnderlineStyle({
      left: activeRect.left - containerRect.left,
      width: activeRect.width,
    });
    setIsUnderlineVisible(true);
    setHasInitialized(true);
  }, [activeIndex]);

  // Update on pathname change and initial mount
  useLayoutEffect(() => {
    updateUnderlinePosition();
  }, [pathname, updateUnderlinePosition]);

  // Update on window resize
  useEffect(() => {
    const handleResize = () => updateUnderlinePosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateUnderlinePosition]);

  // Check if a link is the current page - memoized to prevent recalculation per render
  const isCurrentPage = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
    [pathname]
  );

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
          <div className="hidden md:flex items-center gap-8 relative" ref={navContainerRef}>
            {/* Shared sliding underline */}
            <m.span
              className="absolute -bottom-1 h-[2px] bg-accent-orange pointer-events-none"
              style={{ borderRadius: "1px 0.5px" }}
              initial={false}
              animate={{
                left: underlineStyle.left,
                width: underlineStyle.width,
                opacity: isUnderlineVisible ? 1 : 0,
              }}
              transition={{
                left: { type: "spring", stiffness: 380, damping: 30 },
                width: { type: "spring", stiffness: 380, damping: 30 },
                opacity: { duration: hasInitialized ? 0.2 : 0 },
              }}
              aria-hidden="true"
            />

            {navLinks.map((link, index) => {
              const isActive = isCurrentPage(link.href);
              return (
                <Link
                  key={link.href}
                  ref={(el) => { navItemRefs.current[index] = el; }}
                  href={link.href}
                  className={`relative text-base transition-colors duration-200 ${
                    isActive
                      ? "text-foreground"
                      : "text-foreground-secondary hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Industries Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {(() => {
                const isIndustryActive = pathname.startsWith("/industries");
                return (
                  <button
                    ref={(el) => {
                      dropdownButtonRef.current = el;
                      navItemRefs.current[navLinks.length] = el;
                    }}
                    onClick={() => setIndustriesOpen(!industriesOpen)}
                    onKeyDown={handleDropdownKeyDown}
                    className={`relative flex items-center gap-1 text-base transition-colors duration-200 ${
                      isIndustryActive
                        ? "text-foreground"
                        : "text-foreground-secondary hover:text-foreground"
                    }`}
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
                );
              })()}
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
                    {industryLinks.map((link, index) => {
                      const isActive = isCurrentPage(link.href);
                      return (
                        <Link
                          key={link.href}
                          ref={(el) => {
                            dropdownItemsRef.current[index] = el;
                          }}
                          href={link.href}
                          role="menuitem"
                          className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-150 focus:outline-none ${
                            isActive
                              ? "text-foreground bg-accent-orange/[0.08]"
                              : "text-foreground-secondary hover:text-foreground hover:bg-background-card focus:bg-background-card"
                          }`}
                          onClick={() => {
                            setIndustriesOpen(false);
                            setFocusedDropdownIndex(-1);
                          }}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {/* Small dot indicator for active industry */}
                          <span
                            className={`w-1.5 h-1.5 rounded-full bg-accent-orange transition-opacity duration-200 ${
                              isActive ? "opacity-100" : "opacity-0"
                            }`}
                            aria-hidden="true"
                          />
                          {link.label}
                        </Link>
                      );
                    })}
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              className="text-base text-foreground-secondary hover:text-foreground transition-colors duration-200"
            >
              Contact
            </Link>
            <m.div whileTap={{ scale: 0.97 }} className="relative group">
              <Link
                href="/book"
                className="relative inline-flex items-center gap-2.5 px-4 py-2 h-9 bg-accent-orange text-white text-base font-normal rounded-[4px] overflow-hidden transition-all duration-200 hover:bg-accent-orange-light hover:shadow-lg hover:shadow-accent-orange/25"
              >
                {/* Shimmer effect on hover */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative">Book a Call</span>
                {/* Arrow icon */}
                <svg
                  className="relative w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </m.div>
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
            <div className="relative w-6 h-6" aria-hidden="true">
              {/* Animated hamburger lines that morph to X */}
              <m.span
                className="absolute left-0 w-6 h-[1.5px] bg-foreground rounded-full origin-center"
                style={{ top: mobileMenuOpen ? 11 : 6 }}
                animate={{
                  top: mobileMenuOpen ? 11 : 6,
                  rotate: mobileMenuOpen ? 45 : 0,
                }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              />
              <m.span
                className="absolute left-0 top-[11px] w-6 h-[1.5px] bg-foreground rounded-full"
                animate={{
                  opacity: mobileMenuOpen ? 0 : 1,
                  scaleX: mobileMenuOpen ? 0 : 1,
                }}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              />
              <m.span
                className="absolute left-0 w-6 h-[1.5px] bg-foreground rounded-full origin-center"
                style={{ top: mobileMenuOpen ? 11 : 16 }}
                animate={{
                  top: mobileMenuOpen ? 11 : 16,
                  rotate: mobileMenuOpen ? -45 : 0,
                }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </button>
        </nav>
      </Container>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <m.div
            id="mobile-menu"
            ref={mobileMenuRef}
            key="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-14 sm:top-16 z-40 bg-background overflow-y-auto overscroll-contain safe-area-pb"
          >
            {/* Decorative orange accent bar with spring physics */}
            <m.div
              className="absolute top-0 left-0 right-0 h-[2px] bg-accent-orange origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0, transition: { duration: 0.15 } }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                delay: 0.1
              }}
            />

            <div className="flex flex-col px-6 pt-6 pb-8">
              <nav aria-label="Mobile navigation">
                {/* Main Navigation Links - Staggered with variants */}
                <m.ul
                  className="space-y-0"
                  role="list"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.06,
                        delayChildren: 0.1
                      }
                    }
                  }}
                >
                  {navLinks.map((link, index) => {
                    const isActive = isCurrentPage(link.href);
                    return (
                      <m.li
                        key={link.href}
                        variants={{
                          hidden: { opacity: 0, x: -24 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 28
                            }
                          }
                        }}
                      >
                        <Link
                          href={link.href}
                          className={`group flex items-center gap-4 min-h-[56px] py-3 border-b border-border/40 transition-colors duration-200 active:bg-surface-subtle/50 ${
                            isActive
                              ? "text-foreground"
                              : "text-foreground-secondary"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {/* Index number */}
                          <span
                            className={`text-[11px] font-mono tabular-nums w-5 transition-colors duration-200 ${
                              isActive ? "text-accent-orange" : "text-foreground-muted"
                            }`}
                            aria-hidden="true"
                          >
                            0{index + 1}
                          </span>
                          <span className="text-[26px] tracking-[-0.02em] font-light flex-1">
                            {link.label}
                          </span>
                          {/* Arrow indicator for active */}
                          {isActive && (
                            <m.span
                              className="text-accent-orange"
                              aria-hidden="true"
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                  d="M4 10h12M12 6l4 4-4 4"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </m.span>
                          )}
                        </Link>
                      </m.li>
                    );
                  })}
                </m.ul>

                {/* Industries Section */}
                <m.div
                  className="mt-8"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8, transition: { duration: 0.1 } }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    delay: 0.35,
                  }}
                >
                  <span
                    className="text-[11px] uppercase tracking-[0.2em] text-foreground-muted mb-4 block font-medium"
                    id="mobile-industries-label"
                  >
                    Industries
                  </span>
                  <m.ul
                    className="grid grid-cols-2 gap-x-4 gap-y-1"
                    role="list"
                    aria-labelledby="mobile-industries-label"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.04,
                          delayChildren: 0.4
                        }
                      }
                    }}
                  >
                    {industryLinks.map((link) => {
                      const isActive = isCurrentPage(link.href);
                      return (
                        <m.li
                          key={link.href}
                          variants={{
                            hidden: { opacity: 0, y: 8 },
                            visible: {
                              opacity: 1,
                              y: 0,
                              transition: {
                                type: "spring",
                                stiffness: 500,
                                damping: 30
                              }
                            }
                          }}
                        >
                          <Link
                            href={link.href}
                            className={`flex items-center gap-2.5 min-h-[44px] py-2 text-[15px] transition-colors duration-200 active:text-foreground ${
                              isActive
                                ? "text-foreground"
                                : "text-foreground-secondary"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                            aria-current={isActive ? "page" : undefined}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full bg-accent-orange transition-opacity duration-200 flex-shrink-0 ${
                                isActive ? "opacity-100" : "opacity-0"
                              }`}
                              aria-hidden="true"
                            />
                            <span className={isActive ? "" : "-ml-4"}>
                              {link.label}
                            </span>
                          </Link>
                        </m.li>
                      );
                    })}
                  </m.ul>
                </m.div>
              </nav>

              {/* Footer CTA */}
              <m.div
                className="mt-10 pt-6 border-t border-border/40 space-y-3"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, transition: { duration: 0.1 } }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  delay: 0.5,
                }}
              >
                <Link
                  href="/book"
                  className="relative group flex items-center justify-center gap-2.5 w-full h-[52px] bg-accent-orange text-white text-base font-normal rounded-[4px] overflow-hidden transition-all duration-200 active:scale-[0.98] hover:bg-accent-orange-light hover:shadow-lg hover:shadow-accent-orange/25"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {/* Shimmer effect */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative">Book a Call</span>
                  {/* Arrow icon */}
                  <svg
                    className="relative w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full h-[52px] bg-background text-foreground text-base font-normal border border-border-secondary rounded-[4px] transition-colors duration-200 hover:bg-background-card hover:border-foreground-subtle active:scale-[0.98]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
}
