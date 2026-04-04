import { createAgentSession, SessionManager } from '@mariozechner/pi-coding-agent';
import type { AgentMessage, ToolDefinition } from '@mariozechner/pi-agent-core';
import { toToolDefinitions } from './pi-tool-definition-adapter';
import { buildSystemPrompt } from '../channels/system-prompt';
import type { MsgContext } from '../channels/types';

export interface EmbeddedRunnerConfig {
  model: string;
  systemPrompt: string;
  tools: ToolDefinition[];
  maxTurns?: number;
}

/**
 * runEmbeddedPiAgent — Pi 에이전트를 인-프로세스로 실행
 *
 * subprocess 방식(spawn → stdin/stdout 파싱)과 달리,
 * 직접 인스턴스화하여 완전한 라이프사이클 제어를 제공합니다.
 */
export async function runEmbeddedPiAgent(opts: {
  message: MsgContext;
  sessionManager: SessionManager;
  tools: ToolDefinition[];
  systemPrompt: string;
}) {
  const session = await opts.sessionManager.getOrCreate(opts.message.sessionKey);

  const agentSession = createAgentSession({
    session,
    model: opts.message.resolvedModel,
    tools: opts.tools,
    systemPrompt: opts.systemPrompt,
  });

  // 에이전트 루프: LLM 스트리밍 → 도구 호출 확인 → 실행 → 반복
  for await (const event of agentSession.run(opts.message.text)) {
    switch (event.type) {
      case 'text_delta':
        opts.message.channel.sendChunk(opts.message.peer, event.text);
        break;
      case 'tool_execution_start':
        opts.message.channel.sendStatus(opts.message.peer, `Running ${event.toolName}...`);
        break;
      case 'tool_execution_end':
        break;
      case 'turn_end':
        break;
    }
  }

  await opts.sessionManager.persist(session);
}

/**
 * subscribeEmbeddedPiSession — 이벤트 스트림 구독
 *
 * 이벤트 흐름:
 *   agent_start → turn_start → message_start
 *     → text_delta... (스트리밍)
 *     → tool_execution_start → update → end
 *   → message_end → turn_end → agent_end
 */
export function subscribeEmbeddedPiSession(
  session: ReturnType<typeof createAgentSession>,
  callbacks: {
    onBlockReply: (text: string) => void;
    onToolCall: (name: string, status: string) => void;
    onComplete: (messages: AgentMessage[]) => void;
  },
) {
  session.on('text_delta', (e) => callbacks.onBlockReply(e.text));
  session.on('tool_execution_start', (e) => callbacks.onToolCall(e.toolName, 'start'));
  session.on('tool_execution_end', (e) => callbacks.onToolCall(e.toolName, 'end'));
  session.on('agent_end', (e) => callbacks.onComplete(e.messages));
}
