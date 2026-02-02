"use client";

import { servicePaths } from "@/lib/chat/data";
import type { ServiceSlug } from "@/lib/chat/types";
import {
  Compass,
  GraduationCap,
  CheckSquare,
  Eye,
  Users,
  Shield,
} from "lucide-react";

const serviceIcons: Record<ServiceSlug, typeof Compass> = {
  'ai-strategy': Compass,
  'board-education': GraduationCap,
  'readiness-assessment': CheckSquare,
  'implementation-oversight': Eye,
  'vendor-evaluation': Users,
  'risk-governance': Shield,
};

interface ServiceSelectorProps {
  onSelect: (service: ServiceSlug) => void;
  onBack: () => void;
}

export function ServiceSelector({ onSelect, onBack }: ServiceSelectorProps) {
  return (
    <div className="flex flex-col h-full px-3 sm:px-4 py-4 sm:py-6">
      {/* Back button */}
      <div className="mb-3 sm:mb-4 animate-in fade-in duration-200">
        <button
          onClick={onBack}
          className="text-xs sm:text-sm text-foreground-muted hover:text-foreground transition-colors flex items-center gap-1 font-mono"
        >
          <span>&larr;</span>
          <span>Back</span>
        </button>
      </div>

      {/* Greeting bubble */}
      <div className="mb-4 sm:mb-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="inline-block max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 bg-background-card border border-border rounded-lg rounded-tl-none">
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Which advisory service are you interested in?
          </p>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1 font-mono">
            I&apos;ll ask a few tailored questions to understand your needs.
          </p>
        </div>
      </div>

      {/* Services list */}
      <div className="grid gap-1.5 sm:gap-2 flex-1 overflow-y-auto">
        {Object.values(servicePaths).map((service, index) => {
          const Icon = serviceIcons[service.slug];
          return (
            <button
              key={service.slug}
              onClick={() => onSelect(service.slug)}
              className="group flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 border border-border rounded-lg bg-background-card hover:border-accent-orange hover:bg-accent-orange/5 active:bg-accent-orange/10 transition-[border-color,background-color] duration-200 text-left animate-in fade-in slide-in-from-bottom-2"
              style={{
                animationDelay: `${150 + index * 50}ms`,
                animationFillMode: 'backwards',
              }}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-accent-orange/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-orange/20 transition-colors">
                <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-accent-orange" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs sm:text-sm font-medium text-foreground block">
                  {service.title}
                </span>
                <span className="text-[10px] sm:text-[11px] text-foreground-muted font-mono">
                  {service.questions.length} questions
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
