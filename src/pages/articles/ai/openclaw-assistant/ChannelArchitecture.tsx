import { CitationBlock } from '../../../../components/ui/citation';
import CodePanel from '@/components/ui/code-panel';
import {channelCode} from './ChannelArchitectureData';
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
      <p>
          채널 시스템:<br />
          내장 채널 (src/):<br />
          telegram/ # Telegram Bot API<br />
          discord/ # Discord Bot<br />
          slack/ # Slack App<br />
          signal/ # Signal Messenger<br />
          imessage/ # iMessage (macOS)<br />
          web/ # WhatsApp Web<br />
          확장 채널 (extensions/):<br />
          msteams/ # Microsoft Teams<br />
          matrix/ # Matrix Protocol<br />
          zalo/ # Zalo Messenger
        </p>
      <CitationBlock source="OpenClaw — SKILL.md 형식 & ClawHub" citeKey={4} type="code"
        href="https://github.com/anthropics/openclaw">
        <CodePanel title="SKILL.md 형식 예시" code={`# SKILL.md 형식 — 스킬 정의
---
name: my-skill
description: "Custom automation skill"
triggers: ["keyword1", "keyword2"]
maxSpawnDepth: 2  # 서브에이전트 깊이 제한
sandbox: docker    # fail-closed 샌드박스
---

# Instructions
Use this skill to...

# ClawHub: 13,729+ 커뮤니티 스킬 마켓플레이스`} annotations={[
          { lines: [2, 8], color: 'sky', note: 'YAML frontmatter — 스킬 메타데이터' },
        ]} />
        <p className="mt-2 text-xs text-foreground/70">
          SKILL.md — 마크다운 기반 스킬 정의 형식. ClawHub에서 13,729+ 커뮤니티 스킬 배포,
          Docker sandbox를 fail-closed로 운영하여 보안 보장
        </p>
      </CitationBlock>
    </>
  );
}
