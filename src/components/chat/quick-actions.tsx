"use client";

import { quickActions } from "@/lib/chat/data";
import type { OrchestratorMode } from "@/lib/chat/types";
import {
  ClipboardList,
  Briefcase,
  MessageCircle,
  Mail,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  ClipboardList,
  Briefcase,
  MessageCircle,
  Mail,
};

interface QuickActionsProps {
  onSelect: (mode: OrchestratorMode | 'contact') => void;
}

export function QuickActions({ onSelect }: QuickActionsProps) {
  return (
    <div className="flex flex-col h-full px-3 sm:px-4 py-4 sm:py-6">
      {/* Greeting bubble */}
      <div className="mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="inline-block max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 bg-background-card border border-border rounded-lg rounded-tl-none">
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Hello. I&apos;m here to help you explore AI advisory solutions for your organisation.
          </p>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1.5 font-mono">
            Choose an option or type your question below.
          </p>
        </div>
      </div>

      {/* Quick actions grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
        {quickActions.map((action, index) => {
          const Icon = iconMap[action.icon] || MessageCircle;
          return (
            <button
              key={action.id}
              onClick={() => onSelect(action.id as OrchestratorMode | 'contact')}
              className="group flex flex-col items-center justify-center p-3 sm:p-4 min-h-[90px] sm:min-h-[100px] border border-border rounded-lg bg-background-card hover:border-accent-orange hover:bg-accent-orange/5 active:bg-accent-orange/10 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
              style={{
                animationDelay: `${150 + index * 75}ms`,
                animationFillMode: 'backwards',
              }}
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform text-foreground-muted group-hover:text-accent-orange">
                <Icon className="w-full h-full" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground mb-0.5 sm:mb-1 text-center">
                {action.label}
              </span>
              <span className="text-[10px] sm:text-[11px] text-foreground-muted text-center leading-tight hidden sm:block font-mono">
                {action.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile hint - only show on mobile where descriptions are hidden */}
      <p className="text-[10px] text-foreground-muted mt-3 text-center sm:hidden font-mono">
        Tap an option to get started
      </p>
    </div>
  );
}
