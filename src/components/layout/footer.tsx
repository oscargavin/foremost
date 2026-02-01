import Link from "next/link";
import { Container } from "./container";
import { AnimatedLink } from "@/components/ui";

const exploreLinks = [
  { href: "/who-we-are", label: "Who We Are" },
  { href: "/how-we-think", label: "How We Think" },
  { href: "/how-we-work", label: "How We Work" },
  { href: "/careers", label: "Careers" },
];

const connectLinks = [
  { href: "mailto:office@foremost.ai", label: "office@foremost.ai" },
  { href: "/contact", label: "Schedule a Discussion" },
  { href: "https://linkedin.com/company/foremost-ai", label: "LinkedIn", external: true },
];

const industryLinks = [
  { href: "/industries/financial-services", label: "Financial Services" },
  { href: "/industries/healthcare", label: "Healthcare" },
  { href: "/industries/retail", label: "Retail" },
  { href: "/industries/manufacturing", label: "Manufacturing" },
  { href: "/industries/professional-services", label: "Professional Services" },
  { href: "/industries/energy", label: "Energy" },
];

export function Footer() {
  return (
    <footer className="bg-background-card border-t border-border mt-20" role="contentinfo">
      <Container className="py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
            <Link href="/" className="inline-block" aria-label="Foremost.ai - Go to homepage">
              <span className="font-sans text-xl tracking-tight text-foreground">
                foremost<span className="text-accent-orange inline-block animate-logo-pulse" aria-hidden="true">.</span>ai
              </span>
            </Link>
            <p className="mt-4 font-mono text-sm text-foreground-muted leading-relaxed">
              Applied intelligence for leadership.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-sans text-foreground mb-4">Explore</h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <AnimatedLink href={link.href} className="text-sm">
                    {link.label}
                  </AnimatedLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-sm font-sans text-foreground mb-4">Industries</h3>
            <ul className="space-y-3">
              {industryLinks.map((link) => (
                <li key={link.href}>
                  <AnimatedLink href={link.href} className="text-sm">
                    {link.label}
                  </AnimatedLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-sans text-foreground mb-4">Connect</h3>
            <ul className="space-y-3">
              {connectLinks.map((link) => (
                <li key={link.href}>
                  <AnimatedLink
                    href={link.href}
                    className="text-sm"
                    external={link.external}
                  >
                    {link.label}
                  </AnimatedLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-sans text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <AnimatedLink href="/privacy-policy" className="text-sm">
                  Privacy Policy
                </AnimatedLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-foreground-muted">
            © {new Date().getFullYear()} Foremost.ai. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
