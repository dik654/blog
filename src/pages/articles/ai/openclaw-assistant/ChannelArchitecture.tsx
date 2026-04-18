import { CitationBlock } from '../../../../components/ui/citation';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function ChannelArchitecture({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">채널 아키텍처</h3>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('oc-channel-router', codeRefs['oc-channel-router'])} />
          <span className="text-[10px] text-muted-foreground self-center">channel-router.ts</span>
        </div>
      )}

      <div className="not-prose rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-5 mb-4">
        <h4 className="text-sm font-bold mb-3">채널 시스템</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">내장 채널 (src/)</span>
            <ul className="text-sm mt-2 space-y-0.5">
              <li>telegram/ — Telegram Bot API</li>
              <li>discord/ — Discord Bot</li>
              <li>slack/ — Slack App</li>
              <li>signal/ — Signal Messenger</li>
              <li>imessage/ — iMessage (macOS)</li>
              <li>web/ — WhatsApp Web</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">확장 채널 (extensions/)</span>
            <ul className="text-sm mt-2 space-y-0.5">
              <li>msteams/ — Microsoft Teams</li>
              <li>matrix/ — Matrix Protocol</li>
              <li>zalo/ — Zalo Messenger</li>
              <li>voice-call/ — 음성 통화</li>
              <li>bluebubbles/ — BlueBubbles</li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 mb-3">
          <span className="text-xs font-semibold">채널 공통 인터페이스</span>
          <p className="text-xs mt-1 font-mono text-muted-foreground">Channel {'{ onMessage(msg), sendMessage(to, text), sendMedia(to, media) }'}</p>
          <p className="text-xs text-muted-foreground mt-1">메시지 흐름: 채널 → 정규화 → 라우팅 → Pi 에이전트 실행 → 응답 → 채널</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">메시지 처리 6단계</span>
            <ol className="text-xs mt-2 space-y-0.5 list-decimal list-inside">
              <li>Channel Ingress — 원시 이벤트 수신</li>
              <li>정규화 & 중복 제거 — MsgContext 변환</li>
              <li>접근 제어 — dmPolicy + groupPolicy</li>
              <li>세션 해석 — 에이전트 세션 라우팅</li>
              <li>명령/에이전트 처리 — Pi 루프 실행</li>
              <li>응답 전달 — 플랫폼별 리치 메시지 변환</li>
            </ol>
          </div>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3">
            <span className="text-xs font-semibold">라우팅 규칙</span>
            <ul className="text-sm mt-2 space-y-1">
              <li><strong>DM</strong> — 1:1 대화, 항상 응답</li>
              <li><strong>그룹</strong> — 멘션 또는 트리거 단어로 활성화</li>
              <li><strong>멀티 에이전트</strong> — 채널/계정/피어별 격리된 에이전트에 라우팅</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-1">에이전트마다 독립 워크스페이스 + 세션</p>
          </div>
        </div>
      </div>

      <CitationBlock source="OpenClaw — SKILL.md 형식 & ClawHub" citeKey={4} type="code"
        href="https://github.com/anthropics/openclaw">
        <div className="not-prose rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
          <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">SKILL.md 형식 예시</span>
          <pre className="text-xs mt-2 overflow-x-auto">{`---
name: my-skill
description: "Custom automation skill"
triggers: ["keyword1", "keyword2"]
maxSpawnDepth: 2  # 서브에이전트 깊이 제한
sandbox: docker    # fail-closed 샌드박스
---

# Instructions
Use this skill to...`}</pre>
          <p className="text-xs text-muted-foreground mt-2">ClawHub: 13,729+ 커뮤니티 스킬 마켓플레이스</p>
        </div>
        <p className="mt-2 text-xs text-foreground/70">
          SKILL.md — 마크다운 기반 스킬 정의 형식. ClawHub에서 13,729+ 커뮤니티 스킬 배포,
          Docker sandbox를 fail-closed로 운영하여 보안 보장
        </p>
      </CitationBlock>
    </>
  );
}
