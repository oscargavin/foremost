import Link from "next/link";
import { cn } from "@/lib/utils";

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function AnimatedLink({
  href,
  children,
  className,
  external = false,
}: AnimatedLinkProps) {
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={href}
      className={cn(
        "relative inline-block text-foreground-muted hover:text-foreground transition-colors duration-200",
        "after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-left",
        "after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out",
        "hover:after:scale-x-100",
        className
      )}
      {...linkProps}
    >
      {children}
      {external && <span className="sr-only"> (opens in new tab)</span>}
    </Link>
  );
}
