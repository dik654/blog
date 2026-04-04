import { CitationBlock } from '../../../../components/ui/citation';
import CodePanel from '@/components/ui/code-panel';
import {skillSystemCode} from './SkillSystemData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function SkillSystem({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">스킬 시스템</h3>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('oc-skill-engine', codeRefs['oc-skill-engine'])} />
          <span className="text-[10px] text-muted-foreground self-center">skill-engine.ts</span>
        </div>
      )}
      <p>
          스킬 = OpenClaw의 플러그인 시스템<br />
          내장 스킬 (skills/):<br />
          coding-agent/ # 코딩 에이전트<br />
          github/ # GitHub 통합<br />
          notion/ # Notion API<br />
          obsidian/ # Obsidian 노트<br />
          spotify-player/ # Spotify 재생<br />
          weather/ # 날씨 정보<br />
          slack/ # Slack 통합<br />
          openai-whisper/ # 음성→텍스트<br />
          openai-image-gen/ # 이미지 생성<br />
          canvas/ # 라이브 Canvas
        </p>

      <CitationBlock source="ClawHub — 커뮤니티 스킬 레지스트리" citeKey={4} type="code"
        href="https://github.com/openclaw/clawhub">
        <CodePanel title="SKILL.md 형식 & ClawHub" code={`# SKILL.md 형식 (스킬의 유일한 필수 파일)
---
name: github-review
version: 1.0.0
requirements: [gh CLI]
---
# 지침
1. gh pr diff 실행...

# ClawHub 레지스트리: 13,729+ 커뮤니티 스킬
openclaw skills install <skill-name>
openclaw skills search <keyword>

# 동적 로드: 설치 후 재시작 없이 다음 턴부터 사용
# VirusTotal 연동 스킬 스캐닝 (보안)
# 시스템 프롬프트 주입: 스킬당 ~24 토큰`} annotations={[
          { lines: [1, 8], color: 'sky', note: 'SKILL.md YAML frontmatter' },
          { lines: [10, 12], color: 'emerald', note: 'ClawHub CLI 명령어' },
        ]} />
        <p className="mt-2 text-xs">
          SKILL.md — YAML frontmatter + 마크다운 지침으로 구성된 선언적 스킬 포맷.
          ClawHub 등록 13,729+ 스킬은 동적 로드 지원으로 설치 즉시 사용 가능하며,
          적격 스킬이 시스템 프롬프트에 XML 목록으로 주입 (스킬당 ~24 토큰)
        </p>
      </CitationBlock>
    </>
  );
}
