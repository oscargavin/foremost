"use client";

import { createContext, use, useRef, useState, useCallback, type ReactNode } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";
import type { OrchestratorMode, ServiceSlug } from "@/lib/chat/types";
import { servicePaths } from "@/lib/chat/data";

// State interface
export interface ChatState {
  isOpen: boolean;
  mode: OrchestratorMode;
  service: ServiceSlug | null;
  flowStarted: boolean;
  input: string;
}

// Actions interface
export interface ChatActions {
  open: () => void;
  close: () => void;
  setInput: (value: string) => void;
  selectMode: (mode: OrchestratorMode | "contact") => void;
  selectService: (service: ServiceSlug) => void;
  sendMessage: (text: string) => void;
  submitForm: (e: React.FormEvent<HTMLFormElement>) => void;
  reset: () => void;
}

// Meta interface (derived/computed values)
export interface ChatMeta {
  isLoading: boolean;
  visibleMessages: Array<{
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  showQuickActions: boolean;
  showServiceSelector: boolean;
  showInitialLoading: boolean;
  showResponseLoading: boolean;
  questionCount: number;
  assistantMessageCount: number;
  isQuestionnaireDone: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export interface ChatContextValue {
  state: ChatState;
  actions: ChatActions;
  meta: ChatMeta;
}

export const ChatContext = createContext<ChatContextValue | null>(null);

// Hook to use chat context
export function useChatContext() {
  const context = use(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<OrchestratorMode>("idle");
  const [service, setService] = useState<ServiceSlug | null>(null);
  const [flowStarted, setFlowStarted] = useState(false);
  const [input, setInput] = useState("");

  // AI SDK chat hook
  const {
    messages,
    status,
    sendMessage: aiSendMessage,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        orchestratorMode: mode,
        selectedService: service,
      },
    }),
    onFinish: ({ message, messages: allMessages }) => {
      const assistantMessages = allMessages.filter((msg) => msg.role === "assistant");
      const qCount = mode === "services" && service
        ? servicePaths[service].questions.length
        : 5;

      if (assistantMessages.length === qCount && message.role === "assistant") {
        sendSummaryEmail(allMessages, getMessageContent(message));
      }
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Helper to get text content from a message
  const getMessageContent = (message: (typeof messages)[0]): string => {
    if (!message.parts) return "";
    return message.parts
      .filter((part): part is { type: "text"; text: string } => part.type === "text")
      .map((part) => part.text)
      .join("");
  };

  // Filter visible messages
  const visibleMessages = messages
    .filter((msg) => {
      const content = getMessageContent(msg);
      const isEmptyOrInit =
        msg.role === "user" && (content === "" || content === "(initialize)");
      const isEmptyAssistant = msg.role === "assistant" && content.trim() === "";
      return !isEmptyOrInit && !isEmptyAssistant;
    })
    .map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant" | "system",
      content: getMessageContent(msg),
    }));

  // Derived values
  const showQuickActions = mode === "idle" && !flowStarted && visibleMessages.length === 0;
  const showServiceSelector = mode === "services" && !service && !flowStarted;
  const showInitialLoading =
    isOpen &&
    flowStarted &&
    ((isLoading && visibleMessages.length === 0) ||
      (flowStarted && visibleMessages.length === 0));
  const showResponseLoading =
    isLoading &&
    visibleMessages.length > 0 &&
    visibleMessages[visibleMessages.length - 1].role === "user";

  const questionCount =
    mode === "services" && service
      ? servicePaths[service].questions.length
      : mode === "quote"
        ? 5
        : 0;

  const assistantMessageCount = visibleMessages.filter((m) => m.role === "assistant").length;
  const isQuestionnaireDone = questionCount > 0 && assistantMessageCount >= questionCount;

  // Send summary email
  const sendSummaryEmail = async (
    chatMessages: typeof messages,
    summary: string
  ) => {
    try {
      await fetch("/api/chat/send-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatMessages,
          summary,
          orchestratorMode: mode,
          selectedService: service,
        }),
      });
    } catch (error) {
      console.error("Error sending summary email:", error);
    }
  };

  // Actions
  const actions: ChatActions = {
    open: useCallback(() => setIsOpen(true), []),
    close: useCallback(() => setIsOpen(false), []),
    setInput: useCallback((value: string) => setInput(value), []),

    selectMode: useCallback(
      (selectedMode: OrchestratorMode | "contact") => {
        if (selectedMode === "contact") {
          router.push("/contact");
          setIsOpen(false);
          return;
        }

        setMode(selectedMode);

        if (selectedMode === "quote" || selectedMode === "freeform") {
          setFlowStarted(true);
          isInitializedRef.current = true;
          aiSendMessage({ text: "(initialize)" });
        }
      },
      [router, aiSendMessage]
    ),

    selectService: useCallback(
      (selectedService: ServiceSlug) => {
        setService(selectedService);
        setFlowStarted(true);
        isInitializedRef.current = true;
        aiSendMessage({ text: "(initialize)" });
      },
      [aiSendMessage]
    ),

    sendMessage: useCallback(
      (text: string) => {
        if (!text.trim() || isLoading) return;
        aiSendMessage({ text });
      },
      [aiSendMessage, isLoading]
    ),

    submitForm: useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        if (mode === "idle" && !flowStarted) {
          // Handle idle submit
          setMode("freeform");
          setFlowStarted(true);
          aiSendMessage({ text: input });
          setInput("");
          return;
        }

        aiSendMessage({ text: input });
        setInput("");
      },
      [input, isLoading, mode, flowStarted, aiSendMessage]
    ),

    reset: useCallback(() => {
      setMode("idle");
      setService(null);
      setFlowStarted(false);
      setMessages([]);
      setInput("");
      isInitializedRef.current = false;
    }, [setMessages]),
  };

  // Context value
  const value: ChatContextValue = {
    state: {
      isOpen,
      mode,
      service,
      flowStarted,
      input,
    },
    actions,
    meta: {
      isLoading,
      visibleMessages,
      showQuickActions,
      showServiceSelector,
      showInitialLoading,
      showResponseLoading,
      questionCount,
      assistantMessageCount,
      isQuestionnaireDone,
      messagesEndRef,
    },
  };

  return <ChatContext value={value}>{children}</ChatContext>;
}
