import { streamChat, type StreamOptions, type ChatResult } from '../llm/client.js';
import { Conversation } from './conversation.js';
import type { ToolRegistry } from '../tools/registry.js';
import type { ChatCompletionTool } from 'openai/resources/chat/completions';

const MAX_TOOL_ROUNDS = 20;

export interface AgentLoopCallbacks {
  onText?: (text: string) => void;
  onToolStart?: (name: string, id: string) => void;
  onToolResult?: (name: string, result: string) => void;
  onDone?: () => void;
}

export async function agentLoop(
  conversation: Conversation,
  toolRegistry: ToolRegistry | null,
  callbacks: AgentLoopCallbacks = {},
): Promise<string> {
  let fullText = '';

  const tools: ChatCompletionTool[] = toolRegistry
    ? toolRegistry.getSchemas().map((s) => ({
        type: 'function' as const,
        function: s,
      }))
    : [];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    let roundText = '';
    const toolCallMap = new Map<string, { id: string; name: string; arguments: string }>();

    const options: StreamOptions = {
      model: conversation.model,
      messages: conversation.getMessages(),
      tools: tools.length > 0 ? tools : undefined,
      temperature: 0.3,
    };

    for await (const chunk of streamChat(options)) {
      switch (chunk.type) {
        case 'text':
          roundText += chunk.text || '';
          callbacks.onText?.(chunk.text || '');
          break;
        case 'tool_call_start':
          if (chunk.toolCallId) {
            toolCallMap.set(chunk.toolCallId, {
              id: chunk.toolCallId,
              name: chunk.toolCallName || '',
              arguments: '',
            });
            callbacks.onToolStart?.(chunk.toolCallName || '', chunk.toolCallId);
          }
          break;
        case 'tool_call_args':
          if (chunk.toolCallId && toolCallMap.has(chunk.toolCallId)) {
            toolCallMap.get(chunk.toolCallId)!.arguments += chunk.toolCallArgs || '';
          }
          break;
      }
    }

    const toolCallList = Array.from(toolCallMap.values());

    if (toolCallList.length === 0) {
      conversation.addAssistantMessage(roundText);
      fullText += roundText;
      break;
    }

    conversation.addAssistantMessage(roundText, toolCallList);
    fullText += roundText;

    for (const tc of toolCallList) {
      if (!toolRegistry) {
        conversation.addToolResult(tc.id, 'Error: No tool registry available');
        continue;
      }

      try {
        const args = tc.arguments ? JSON.parse(tc.arguments) : {};
        const result = await toolRegistry.execute(tc.name, args);
        conversation.addToolResult(tc.id, result);
        callbacks.onToolResult?.(tc.name, result);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        conversation.addToolResult(tc.id, `Error: ${errorMsg}`);
        callbacks.onToolResult?.(tc.name, `Error: ${errorMsg}`);
      }
    }
  }

  callbacks.onDone?.();
  return fullText;
}
