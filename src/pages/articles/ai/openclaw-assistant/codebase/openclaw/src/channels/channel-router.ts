/**
 * 채널 라우터 — 메시지 처리 6단계 파이프라인
 *
 * 1. Channel Ingress — 플랫폼 원시 이벤트 수신
 * 2. 정규화 & 중복 제거 — MsgContext 구조체로 변환
 * 3. 접근 제어 — dmPolicy (DM) + groupPolicy (그룹)
 * 4. 세션 해석 — 적절한 에이전트 세션으로 라우팅
 * 5. 명령/에이전트 처리 — Pi 에이전트 루프 실행
 * 6. 응답 전달 — 플랫폼별 리치 메시지로 변환
 */

import type { Channel, MsgContext } from './types';
import { runEmbeddedPiAgent } from '../agents/pi-embedded-runner';
import type { SessionManager } from '@mariozechner/pi-coding-agent';

export interface ChannelRouterConfig {
  dmPolicy: 'always' | 'allowlist';
  groupPolicy: 'mention' | 'trigger' | 'always';
  triggerWords: string[];
}

export class ChannelRouter {
  private channels: Map<string, Channel> = new Map();

  constructor(
    private config: ChannelRouterConfig,
    private sessionManager: SessionManager,
  ) {}

  registerChannel(channel: Channel) {
    this.channels.set(channel.name, channel);
    channel.onMessage((msg) => this.handleMessage(channel, msg));
  }

  /** 6단계 메시지 처리 파이프라인 */
  private async handleMessage(channel: Channel, raw: unknown) {
    // 1. Ingress — 플랫폼 원시 이벤트
    // 2. 정규화 & 중복 제거
    const msg = this.normalize(channel, raw);
    if (!msg) return;

    // 3. 접근 제어
    if (!this.checkAccess(msg)) return;

    // 4. 세션 해석 — 채널/계정/피어별 격리
    const sessionKey = this.resolveSessionKey(msg);

    // 5. 에이전트 처리
    await runEmbeddedPiAgent({
      message: { ...msg, sessionKey, resolvedModel: 'anthropic/claude-opus-4-6' },
      sessionManager: this.sessionManager,
      tools: [],
      systemPrompt: '',
    });

    // 6. 응답 전달 (스트리밍으로 처리됨)
  }

  private normalize(channel: Channel, raw: unknown): MsgContext | null {
    // 플랫폼별 정규화 + 중복 제거
    return null;
  }

  private checkAccess(msg: MsgContext): boolean {
    if (msg.isDM) return this.config.dmPolicy === 'always';
    if (this.config.groupPolicy === 'mention') return msg.isMentioned;
    if (this.config.groupPolicy === 'trigger') {
      return this.config.triggerWords.some((w) => msg.text.includes(w));
    }
    return true;
  }

  private resolveSessionKey(msg: MsgContext): string {
    return `${msg.channelName}:${msg.accountId}:${msg.peerId}`;
  }
}
