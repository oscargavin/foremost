"use client";

import { useEffect } from "react";
import { MessageSquare, X, Send, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useChatContext } from "./chat-context";
import { QuickActions } from "./quick-actions";
import { ServiceSelector } from "./service-selector";
import { servicePaths } from "@/lib/chat/data";

// FAB Button
export function ChatFAB() {
  const { state, actions } = useChatContext();

  return (
    <button
      onClick={actions.open}
      className={cn(
        "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50",
        "w-14 h-14 rounded-full",
        "bg-background-button hover:bg-background-button/90 text-foreground-light",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-300 active:scale-95",
        "flex items-center justify-center",
        state.isOpen && "opacity-0 pointer-events-none scale-90"
      )}
      aria-label="Open chat"
    >
      <MessageSquare className="w-6 h-6" />
    </button>
  );
}

// Chat Frame (window container)
export function ChatFrame({ children }: { children: React.ReactNode }) {
  const { state } = useChatContext();

  return (
    <div
      className={cn(
        "fixed z-50",
        "inset-0 sm:inset-auto sm:bottom-6 sm:right-6",
        "w-full sm:w-[400px] h-full sm:h-[600px] sm:max-h-[calc(100vh-48px)]",
        "bg-background border-0 sm:border sm:border-border rounded-none sm:rounded-xl shadow-2xl",
        "flex flex-col overflow-hidden",
        "transition-all duration-300 sm:origin-bottom-right",
        state.isOpen
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 sm:scale-95 translate-y-full sm:translate-y-4 pointer-events-none"
      )}
    >
      {children}
    </div>
  );
}

// Chat Header
export function ChatHeader() {
  const { state, actions, meta } = useChatContext();

  const getSubtitle = () => {
    if (meta.showQuickActions) return "How can we help today?";
    if (meta.showServiceSelector) return "Explore our services";
    if (state.mode === "quote" && state.flowStarted) return "Quick consultation quiz";
    if (state.mode === "services" && state.service) return servicePaths[state.service].title;
    if (state.mode === "freeform" && state.flowStarted) return "Ask us anything";
    return "";
  };

  return (
    <div className="flex items-start justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))] border-b border-border bg-background-card">
      <div className="flex-1">
        <h2 className="text-lg font-normal text-foreground tracking-tight">
          Foremost<span className="text-accent-orange">.</span>ai
        </h2>
        <p className="text-xs text-foreground-muted mt-1 font-mono">
          {getSubtitle()}
        </p>

        {/* Progress indicator */}
        {state.flowStarted && meta.questionCount > 0 && (
          <div className="mt-3">
            <div className="h-px bg-border">
              <div
                className="h-full bg-accent-orange transition-all duration-500"
                style={{
                  width: `${Math.min((Math.min(meta.assistantMessageCount, meta.questionCount) / meta.questionCount) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-[10px] tracking-[0.1em] uppercase text-foreground-muted mt-2 font-mono">
              {meta.assistantMessageCount > meta.questionCount
                ? "Questions complete"
                : `${Math.min(meta.assistantMessageCount, meta.questionCount)} of ${meta.questionCount} questions`}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {state.flowStarted && (
          <button
            onClick={actions.reset}
            className="text-[10px] text-foreground-muted hover:text-foreground transition-colors font-mono"
          >
            Start over
          </button>
        )}
        <button
          onClick={actions.close}
          className="p-2.5 sm:p-1.5 -mr-1 sm:mr-0 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-md hover:bg-background transition-colors text-foreground-muted hover:text-foreground"
          aria-label="Close chat"
        >
          <X className="w-6 h-6 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}

// Chat Body
export function ChatBody() {
  const { state, actions, meta } = useChatContext();
  const router = useRouter();

  // Scroll to bottom when messages change
  useEffect(() => {
    meta.messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [meta.visibleMessages, meta.messagesEndRef]);

  // Get question number for a message
  const getQuestionNumber = (index: number) => {
    const assistantMessages = meta.visibleMessages.filter((msg) => msg.role === "assistant");
    const msg = meta.visibleMessages[index];
    const assistantIndex = assistantMessages.findIndex((m) => m.id === msg.id);

    if (assistantIndex >= meta.questionCount) {
      return null;
    }

    return assistantIndex + 1;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {meta.showQuickActions && (
        <QuickActions onSelect={actions.selectMode} />
      )}

      {meta.showServiceSelector && (
        <ServiceSelector
          onSelect={actions.selectService}
          onBack={() => actions.selectMode("idle")}
        />
      )}

      {(state.flowStarted ||
        (state.mode !== "idle" && state.mode !== "services")) &&
        !meta.showQuickActions &&
        !meta.showServiceSelector && (
          <div className="p-4 space-y-4">
            {meta.visibleMessages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] p-3 rounded-lg",
                    message.role === "user"
                      ? "bg-accent-orange/10 text-foreground rounded-br-none"
                      : "bg-background-card border border-border rounded-bl-none"
                  )}
                >
                  {/* Question number badge for assistant messages */}
                  {message.role === "assistant" &&
                    (state.mode === "quote" || state.mode === "services") &&
                    getQuestionNumber(index) && (
                      <div className="text-[10px] font-mono text-accent-orange mb-1.5">
                        Question {getQuestionNumber(index)}
                      </div>
                    )}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading states */}
            {(meta.showInitialLoading || meta.showResponseLoading) && (
              <div className="flex justify-start">
                <div className="max-w-[85%] p-3 bg-background-card border border-border rounded-lg rounded-bl-none">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Post-questionnaire CTA */}
            {meta.isQuestionnaireDone && !meta.isLoading && (
              <div className="pt-4 border-t border-border mt-4">
                <p className="text-sm text-foreground-muted mb-3 font-mono">
                  Ready to discuss your requirements?
                </p>
                <button
                  onClick={() => {
                    router.push("/contact");
                    actions.close();
                  }}
                  className={cn(
                    "w-full flex items-center justify-center gap-2",
                    "bg-background-button hover:bg-background-button/90 text-foreground-light",
                    "py-3 rounded-lg text-sm font-medium",
                    "transition-all duration-200 active:scale-[0.98]"
                  )}
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <div ref={meta.messagesEndRef} />
          </div>
        )}
    </div>
  );
}

// Chat Input
export function ChatInput() {
  const { state, actions, meta } = useChatContext();

  const getPlaceholder = () => {
    if (meta.showQuickActions) return "Or type your question...";
    if (meta.showServiceSelector) return "Select a service above...";
    return "Type your response...";
  };

  return (
    <div className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-border bg-background-card">
      <form onSubmit={actions.submitForm} className="flex items-center gap-2">
        <input
          type="text"
          value={state.input}
          onChange={(e) => actions.setInput(e.target.value)}
          placeholder={getPlaceholder()}
          disabled={meta.isLoading || meta.showServiceSelector}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !meta.isLoading &&
              state.input.trim() &&
              !meta.showServiceSelector
            ) {
              e.preventDefault();
              actions.submitForm(e as unknown as React.FormEvent<HTMLFormElement>);
            }
          }}
          className={cn(
            "flex-1 px-3 py-2.5 rounded-lg",
            "bg-background border border-border",
            "text-sm text-foreground placeholder:text-foreground-subtle",
            "focus:outline-none focus:ring-2 focus:ring-accent-orange/30",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors"
          )}
        />
        <button
          type="submit"
          disabled={meta.isLoading || !state.input.trim() || meta.showServiceSelector}
          className={cn(
            "p-2.5 rounded-lg",
            "bg-accent-orange hover:bg-accent-orange-light text-white",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200 active:scale-95"
          )}
          aria-label="Send message"
        >
          {meta.isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}

// Compound component export
export const Chat = {
  FAB: ChatFAB,
  Frame: ChatFrame,
  Header: ChatHeader,
  Body: ChatBody,
  Input: ChatInput,
};
