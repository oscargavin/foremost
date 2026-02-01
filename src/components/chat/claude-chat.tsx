"use client";

import { ChatProvider } from "./chat-context";
import { Chat } from "./chat-components";

/**
 * ClaudeChat - Compound component chat widget
 *
 * Uses composition pattern with shared context for clean state management.
 * The provider handles all state, and subcomponents access it via context.
 */
export function ClaudeChat() {
  return (
    <ChatProvider>
      <Chat.FAB />
      <Chat.Frame>
        <Chat.Header />
        <Chat.Body />
        <Chat.Input />
      </Chat.Frame>
    </ChatProvider>
  );
}
