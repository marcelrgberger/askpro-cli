import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export class Conversation {
  private messages: ChatCompletionMessageParam[] = [];
  public model: string;

  constructor(model: string) {
    this.model = model;
  }

  setSystemPrompt(content: string): void {
    const existing = this.messages.findIndex((m) => m.role === 'system');
    if (existing >= 0) {
      this.messages[existing] = { role: 'system', content };
    } else {
      this.messages.unshift({ role: 'system', content });
    }
  }

  addUserMessage(content: string): void {
    this.messages.push({ role: 'user', content });
  }

  addAssistantMessage(content: string, toolCalls?: Array<{ id: string; name: string; arguments: string }>): void {
    if (toolCalls?.length) {
      this.messages.push({
        role: 'assistant',
        content: content || null,
        tool_calls: toolCalls.map((tc) => ({
          id: tc.id,
          type: 'function' as const,
          function: {
            name: tc.name,
            arguments: tc.arguments,
          },
        })),
      });
    } else {
      this.messages.push({ role: 'assistant', content });
    }
  }

  addToolResult(toolCallId: string, content: string): void {
    this.messages.push({
      role: 'tool',
      tool_call_id: toolCallId,
      content,
    });
  }

  getMessages(): ChatCompletionMessageParam[] {
    return [...this.messages];
  }

  getMessageCount(): number {
    return this.messages.length;
  }

  clear(): void {
    const system = this.messages.find((m) => m.role === 'system');
    this.messages = system ? [system] : [];
  }

  getLastAssistantMessage(): string | null {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const msg = this.messages[i];
      if (msg.role === 'assistant' && typeof msg.content === 'string') {
        return msg.content;
      }
    }
    return null;
  }
}
