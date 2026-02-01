"use client";

import { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center p-8 text-center",
            this.props.className
          )}
          role="alert"
        >
          <div
            className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4"
            aria-hidden="true"
          >
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-lg font-normal text-foreground mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-foreground-muted mb-4 max-w-sm">
            We encountered an unexpected error. Please try again.
          </p>
          <button
            onClick={this.handleReset}
            className={cn(
              "inline-flex items-center gap-2",
              "px-4 py-2 rounded-md",
              "bg-background-button text-foreground-light",
              "hover:bg-foreground/90",
              "transition-colors text-sm font-medium"
            )}
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized fallbacks for specific components
export function ScannerFallback() {
  return (
    <div className="min-h-[420px] flex flex-col items-center justify-center p-8 text-center">
      <div
        className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4"
        aria-hidden="true"
      >
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      <h3 className="text-lg font-normal text-foreground mb-2">
        Scanner unavailable
      </h3>
      <p className="text-sm text-foreground-muted">
        Please refresh the page to try again.
      </p>
    </div>
  );
}

export function ChatFallback() {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <div className="w-14 h-14 rounded-full bg-background-button/50 flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-foreground-muted" />
      </div>
    </div>
  );
}
