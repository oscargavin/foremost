"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, ArrowRight } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { QuickActions } from "./quick-actions";
import { ServiceSelector } from "./service-selector";
import type { OrchestratorMode, ServiceSlug } from "@/lib/chat/types";
import { servicePaths } from "@/lib/chat/data";

export function ClaudeChat() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  // Orchestrator state
  const [orchestratorMode, setOrchestratorMode] = useState<OrchestratorMode>('idle');
  const [selectedService, setSelectedService] = useState<ServiceSlug | null>(null);
  const [flowStarted, setFlowStarted] = useState(false);

  // Manual input state (AI SDK 5.0 no longer manages this)
  const [input, setInput] = useState("");

  // Use AI SDK's useChat hook with new API
  const {
    messages,
    status,
    sendMessage,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        orchestratorMode,
        selectedService,
      },
    }),
    onFinish: ({ message, messages: allMessages }) => {
      // Check if this is the final questionnaire message
      const assistantMessages = allMessages.filter(
        (msg) => msg.role === "assistant"
      );

      const questionCount = orchestratorMode === 'services' && selectedService
        ? servicePaths[selectedService].questions.length
        : 5;

      if (assistantMessages.length === questionCount && message.role === "assistant") {
        sendSummaryEmail(allMessages, getMessageContent(message));
      }
    },
  });

  // Derive loading state from status
  const isLoading = status === "streaming" || status === "submitted";

  // Helper to get text content from a message
  const getMessageContent = (message: typeof messages[0]): string => {
    if (!message.parts) return "";
    return message.parts
      .filter((part): part is { type: "text"; text: string } => part.type === "text")
      .map((part) => part.text)
      .join("");
  };

  // Handle quick action selection
  const handleQuickAction = (mode: OrchestratorMode | 'contact') => {
    if (mode === 'contact') {
      // Navigate to contact page
      router.push('/contact');
      setIsOpen(false);
      return;
    }

    setOrchestratorMode(mode);

    if (mode === 'quote' || mode === 'freeform') {
      // Start the conversation flow
      startConversationFlow(mode);
    }
    // 'services' mode shows the service selector, handled by render
  };

  // Handle service selection
  const handleServiceSelect = (service: ServiceSlug) => {
    setSelectedService(service);
    startConversationFlow('services', service);
  };

  // Start conversation flow
  const startConversationFlow = (mode: OrchestratorMode, service?: ServiceSlug) => {
    setFlowStarted(true);
    isInitializedRef.current = true;

    // Trigger the initial message
    sendMessage({ text: "(initialize)" });
  };

  // Handle free-form input when in idle mode
  const handleIdleSubmit = () => {
    if (!input.trim()) return;

    // Switch to freeform mode and send the message
    setOrchestratorMode('freeform');
    setFlowStarted(true);
    sendMessage({ text: input });
    setInput("");
  };

  // Function to send the summary email
  const sendSummaryEmail = async (chatMessages: typeof messages, summary: string) => {
    try {
      await fetch("/api/chat/send-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: chatMessages,
          summary: summary,
          orchestratorMode,
          selectedService,
        }),
      });
    } catch (error) {
      console.error("Error sending summary email:", error);
    }
  };

  // Custom submit handler
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // If in idle mode, handle differently
    if (orchestratorMode === 'idle' && !flowStarted) {
      handleIdleSubmit();
      return;
    }

    sendMessage({ text: input });
    setInput("");
  };

  // Reset to initial state
  const handleReset = () => {
    setOrchestratorMode('idle');
    setSelectedService(null);
    setFlowStarted(false);
    setMessages([]);
    setInput("");
    isInitializedRef.current = false;
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter out initialization messages from view
  const visibleMessages = messages.filter((msg) => {
    const content = getMessageContent(msg);
    const isEmptyOrInit =
      msg.role === "user" &&
      (content === "" || content === "(initialize)");
    const isEmptyAssistant =
      msg.role === "assistant" && content.trim() === "";

    return !isEmptyOrInit && !isEmptyAssistant;
  });

  // Determine what to show in the body
  const showQuickActions = orchestratorMode === 'idle' && !flowStarted && visibleMessages.length === 0;
  const showServiceSelector = orchestratorMode === 'services' && !selectedService && !flowStarted;

  const showInitialLoading =
    isOpen &&
    flowStarted &&
    ((isLoading && visibleMessages.length === 0) ||
      (flowStarted && visibleMessages.length === 0));

  const showResponseLoading =
    isLoading &&
    visibleMessages.length > 0 &&
    visibleMessages[visibleMessages.length - 1].role === "user";

  // Get progress info
  const questionCount = orchestratorMode === 'services' && selectedService
    ? servicePaths[selectedService].questions.length
    : orchestratorMode === 'quote' ? 5 : 0;

  const assistantMessageCount = visibleMessages.filter((m) => m.role === "assistant").length;
  const isQuestionnaireDone = questionCount > 0 && assistantMessageCount >= questionCount;

  // Get the current question number
  const getQuestionNumber = (index: number) => {
    const visibleAssistantMessages = visibleMessages.filter(
      (msg) => msg.role === "assistant"
    );
    const assistantIndex = visibleAssistantMessages.findIndex(
      (msg) => msg.id === visibleMessages[index].id
    );

    if (assistantIndex >= questionCount) {
      return null; // Summary/post-questionnaire messages
    }

    return assistantIndex + 1;
  };

  return (
    <>
      {/* Chat FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50",
          "w-14 h-14 rounded-full",
          "bg-background-button hover:bg-background-button/90 text-foreground-light",
          "shadow-lg hover:shadow-xl",
          "transition-all duration-300 active:scale-95",
          "flex items-center justify-center",
          isOpen && "opacity-0 pointer-events-none scale-90"
        )}
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat window - full screen on mobile, popover on desktop */}
      <div
        className={cn(
          "fixed z-50",
          "inset-0 sm:inset-auto sm:bottom-6 sm:right-6",
          "w-full sm:w-[400px] h-full sm:h-[600px] sm:max-h-[calc(100vh-48px)]",
          "bg-background border-0 sm:border sm:border-border rounded-none sm:rounded-xl shadow-2xl",
          "flex flex-col overflow-hidden",
          "transition-all duration-300 sm:origin-bottom-right",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 sm:scale-95 translate-y-full sm:translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))] border-b border-border bg-background-card">
          <div className="flex-1">
            <h2 className="text-lg font-normal text-foreground tracking-tight">
              Foremost<span className="text-accent-orange">.</span>ai
            </h2>
            <p className="text-xs text-foreground-muted mt-1 font-mono">
              {showQuickActions && "How can we help today?"}
              {showServiceSelector && "Explore our services"}
              {orchestratorMode === 'quote' && flowStarted && "Quick consultation quiz"}
              {orchestratorMode === 'services' && selectedService && servicePaths[selectedService].title}
              {orchestratorMode === 'freeform' && flowStarted && "Ask us anything"}
            </p>

            {/* Progress indicator */}
            {flowStarted && questionCount > 0 && (
              <div className="mt-3">
                <div className="h-px bg-border">
                  <div
                    className="h-full bg-accent-orange transition-all duration-500"
                    style={{
                      width: `${Math.min((Math.min(assistantMessageCount, questionCount) / questionCount) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-[10px] tracking-[0.1em] uppercase text-foreground-muted mt-2 font-mono">
                  {assistantMessageCount > questionCount
                    ? "Questions complete"
                    : `${Math.min(assistantMessageCount, questionCount)} of ${questionCount} questions`}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {flowStarted && (
              <button
                onClick={handleReset}
                className="text-[10px] text-foreground-muted hover:text-foreground transition-colors font-mono"
              >
                Start over
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2.5 sm:p-1.5 -mr-1 sm:mr-0 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-md hover:bg-background transition-colors text-foreground-muted hover:text-foreground"
              aria-label="Close chat"
            >
              <X className="w-6 h-6 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {showQuickActions && (
            <QuickActions onSelect={handleQuickAction} />
          )}

          {showServiceSelector && (
            <ServiceSelector
              onSelect={handleServiceSelect}
              onBack={() => setOrchestratorMode('idle')}
            />
          )}

          {(flowStarted || (orchestratorMode !== 'idle' && orchestratorMode !== 'services')) && !showQuickActions && !showServiceSelector && (
            <div className="p-4 space-y-4">
              {visibleMessages.map((message, index) => {
                const content = getMessageContent(message);
                return (
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
                      {message.role === "assistant" && (orchestratorMode === 'quote' || orchestratorMode === 'services') && getQuestionNumber(index) && (
                        <div className="text-[10px] font-mono text-accent-orange mb-1.5">
                          Question {getQuestionNumber(index)}
                        </div>
                      )}
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {content}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Loading states */}
              {(showInitialLoading || showResponseLoading) && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-3 bg-background-card border border-border rounded-lg rounded-bl-none">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Post-questionnaire CTA */}
              {isQuestionnaireDone && !isLoading && (
                <div className="pt-4 border-t border-border mt-4">
                  <p className="text-sm text-foreground-muted mb-3 font-mono">
                    Ready to discuss your requirements?
                  </p>
                  <button
                    onClick={() => {
                      router.push('/contact');
                      setIsOpen(false);
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

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Footer / Input */}
        <div className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-border bg-background-card">
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                showQuickActions
                  ? "Or type your question..."
                  : showServiceSelector
                  ? "Select a service above..."
                  : "Type your response..."
              }
              disabled={isLoading || showServiceSelector}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isLoading && input.trim() && !showServiceSelector) {
                  e.preventDefault();
                  onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
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
              disabled={isLoading || !input.trim() || showServiceSelector}
              className={cn(
                "p-2.5 rounded-lg",
                "bg-accent-orange hover:bg-accent-orange-light text-white",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200 active:scale-95"
              )}
              aria-label="Send message"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
