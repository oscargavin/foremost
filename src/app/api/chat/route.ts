import { NextRequest } from 'next/server';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, generateText } from 'ai';
import { servicePaths, quoteQuestions } from '@/lib/chat/data';

// Type for incoming UI messages from useChat
interface UIMessagePart {
  type: string;
  text?: string;
}

interface UIMessage {
  role: string;
  content?: string;
  parts?: UIMessagePart[];
  data?: { isInitializing?: boolean };
}

// Helper to extract text content from a UI message
function getMessageContent(msg: UIMessage): string {
  // If it has parts array (AI SDK 5.0 format), extract text from parts
  if (msg.parts && Array.isArray(msg.parts)) {
    return msg.parts
      .filter((part): part is UIMessagePart & { text: string } => part.type === 'text' && typeof part.text === 'string')
      .map(part => part.text)
      .join('');
  }
  // Fallback to content string (legacy format)
  return msg.content || '';
}

// Base system prompt
const baseSystemPrompt = `
You are a consultancy intake assistant for Foremost.ai, a board-level AI advisory firm.

Follow these guidelines:
1. Be professional and measured - appropriate for boardroom conversations
2. Keep your responses concise and focused
3. Use proper markdown formatting (bold for emphasis, lists for multiple points)
4. Use British English NOT American English (i.e. optimise NOT optimize, organisation NOT organization)
5. Avoid hype, buzzwords, or overpromising - focus on clarity and substance
6. Never mention departments or teams - we are a boutique advisory firm

For each question response:
1. Ask the question in **bold**
2. Add a brief (1 sentence) explanation of why you're asking

DO NOT include "Question X" headings in your responses.
DO NOT ask all questions at once. Wait for the user's response before moving to the next question.
`;

// Mode-specific system prompts
const modePrompts: Record<string, string> = {
  quote: `
${baseSystemPrompt}

You are conducting a quick 5-question consultation quiz to understand the client's AI advisory needs.
After all 5 questions, provide a summary and encourage them to contact us for a deeper conversation.
`,
  services: `
${baseSystemPrompt}

You are conducting a service-specific intake for {SERVICE_CONTEXT}.
Ask the provided questions one at a time to understand their specific needs for this service.
After all questions, provide a tailored summary of how we can help and encourage them to contact us.
`,
  freeform: `
${baseSystemPrompt}

You are having an open conversation about AI strategy and advisory services. Answer questions helpfully and guide users toward contacting us when appropriate.
If they express interest in a specific service, you can ask relevant questions to understand their needs better.
Always be helpful and informative, but look for opportunities to suggest a conversation with our advisors.
`,
};

// Contact prompt addition
const contactPromptAddition = `
After providing the summary, guide them to contact us:
1. When users express interest in discussing further, respond briefly and positively
2. Mention they can reach us via the contact page or by sending a message
3. Keep responses professional and encourage the next step
`;

// Function to analyze contact intent
async function analyzeContactIntent(userMessage: string, conversationContext: string): Promise<boolean> {
  const intentAnalysisPrompt = `You are an intent analysis assistant. Analyze if the user wants to contact/discuss further with an advisor.

User's message: "${userMessage}"
Context: ${conversationContext}

Respond with only "YES" or "NO".

YES examples: "yes please", "I'd like to discuss", "let's arrange a call", "how do I contact you?"
NO examples: "tell me more", "what's involved?", "maybe later"`;

  try {
    const result = await generateText({
      model: anthropic('claude-haiku-4-5-20251001'),
      prompt: intentAnalysisPrompt,
      maxOutputTokens: 10,
    });

    return result.text.trim().toUpperCase() === 'YES';
  } catch (error) {
    console.error('Error analyzing contact intent:', error);
    return /\b(yes|contact|discuss|call|meet|meeting|speak|talk)\b/i.test(userMessage);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, orchestratorMode = 'quote', selectedService } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request format. Messages array is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Filter out initialization messages
    const relevantMessages = messages.filter((message: UIMessage) => {
      if (message.data?.isInitializing) return false;
      const content = getMessageContent(message);
      if (message.role === 'user' && (content === '' || content === '(initialize)')) return false;
      return true;
    });

    // Determine question set based on mode
    let questions: string[];
    let serviceContext = '';

    if (orchestratorMode === 'services' && selectedService && servicePaths[selectedService as keyof typeof servicePaths]) {
      questions = servicePaths[selectedService as keyof typeof servicePaths].questions;
      serviceContext = servicePaths[selectedService as keyof typeof servicePaths].context;
    } else if (orchestratorMode === 'quote') {
      questions = quoteQuestions;
    } else {
      questions = []; // Freeform mode has no predefined questions
    }

    const questionCount = questions.length;
    const assistantMessagesCount = relevantMessages.filter(
      (message: UIMessage) => message.role === 'assistant' && getMessageContent(message)
    ).length;
    const currentQuestionNumber = assistantMessagesCount + 1;
    const isQuestionnaireDone = questionCount > 0 && currentQuestionNumber > questionCount;

    // Check for last user message
    const lastUserMessage = relevantMessages
      .filter((msg: UIMessage) => msg.role === 'user')
      .pop();

    // Analyze contact intent if questionnaire is done
    let isContactIntent = false;
    if (lastUserMessage && isQuestionnaireDone) {
      const conversationContext = relevantMessages
        .slice(-6)
        .map((msg: UIMessage) => `${msg.role}: ${getMessageContent(msg)}`)
        .join('\n');
      isContactIntent = await analyzeContactIntent(getMessageContent(lastUserMessage), conversationContext);
    }

    // Build system prompt based on mode
    let systemPrompt: string;

    if (orchestratorMode === 'freeform') {
      systemPrompt = modePrompts.freeform;
    } else if (orchestratorMode === 'services' && serviceContext) {
      systemPrompt = modePrompts.services
        .replace(/{SERVICE_CONTEXT}/g, serviceContext);
      if (isQuestionnaireDone) {
        systemPrompt += contactPromptAddition;
      }
    } else {
      systemPrompt = modePrompts.quote;
      if (isQuestionnaireDone) {
        systemPrompt += contactPromptAddition;
      }
    }

    // Determine message content based on state
    let messageContent: string;

    if (orchestratorMode === 'freeform') {
      // Freeform mode - just continue the conversation
      if (relevantMessages.length === 0) {
        messageContent = 'Greet the user warmly and ask how you can help them with AI strategy today. Keep it brief and professional.';
      } else {
        messageContent = 'Continue the conversation naturally. If they seem interested in a specific service, you can ask clarifying questions. Look for opportunities to suggest a conversation with our advisors.';
      }
    } else if (isQuestionnaireDone) {
      if (assistantMessagesCount === questionCount) {
        // Summary message
        const summaryContext = serviceContext
          ? `for ${serviceContext}`
          : 'based on their AI advisory needs';
        messageContent = `Thank the user for completing the questions. Provide a concise summary of what you've learned ${summaryContext}. Suggest 2-3 specific ways we could help them. End by encouraging them to contact us to discuss further.`;
      } else if (isContactIntent) {
        messageContent = `The user wants to discuss further. Respond positively and direct them to our contact page at /contact. Mention they can also reach us at office@foremost.ai.`;
      } else {
        messageContent = `You are in post-questionnaire mode. Gently encourage them to contact us for a deeper conversation. Be professional but not pushy.`;
      }
    } else if (currentQuestionNumber === 1) {
      // First question
      const firstQuestion = questions[0];
      messageContent = `Start the conversation by asking this question: "${firstQuestion}"`;
    } else if (currentQuestionNumber <= questionCount) {
      // Subsequent questions
      const nextQuestion = questions[currentQuestionNumber - 1];
      messageContent = `Based on their previous answer, transition naturally to asking: "${nextQuestion}"`;
    } else {
      messageContent = 'Continue the conversation naturally.';
    }

    // Create messages for the model - convert UI messages to model messages
    const convertedMessages = relevantMessages.map((msg: UIMessage) => ({
      role: msg.role as 'user' | 'assistant',
      content: getMessageContent(msg)
    }));

    // Add the orchestrator instruction as the final user message
    const messagesForModel = [
      ...convertedMessages,
      { role: 'user' as const, content: messageContent }
    ];

    // Stream the response
    const result = streamText({
      model: anthropic('claude-haiku-4-5-20251001'),
      system: systemPrompt,
      messages: messagesForModel,
      maxOutputTokens: 1000,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error streaming from Anthropic API:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to process the request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
