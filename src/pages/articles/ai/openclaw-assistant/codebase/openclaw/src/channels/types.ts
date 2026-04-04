/**
 * 채널 시스템 타입 정의
 */

export interface Channel {
  name: string;
  onMessage(handler: (raw: unknown) => void): void;
  sendMessage(to: string, text: string): void;
  sendMedia(to: string, media: Buffer): void;
  sendChunk(to: string, text: string): void;
  sendStatus(to: string, status: string): void;
}

export interface MsgContext {
  channelName: string;
  accountId: string;
  peerId: string;
  text: string;
  isDM: boolean;
  isMentioned: boolean;
  channel: Channel;
  sessionKey: string;
  resolvedModel: string;
  peer: string;
}
