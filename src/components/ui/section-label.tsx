import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  showDot?: boolean;
  className?: string;
}

export function SectionLabel({
  children,
  showDot = true,
  className,
}: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showDot && (
        <span className="w-2 h-2 rounded-full bg-accent-orange flex-shrink-0" />
      )}
      <span className="font-mono text-sm uppercase tracking-[-0.0175rem] text-foreground">
        {children}
      </span>
    </div>
  );
}
