import { CitationBlock } from '../../../../components/ui/citation';
import CodePanel from '@/components/ui/code-panel';
import { CodeViewButton } from '@/components/code';
import { hooksCode, hooksAnnotations } from './HooksSystemData';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function HooksSystem({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">Hooks 시스템</h3>
      <CodePanel title="Hooks 시스템 개요" code={hooksCode} annotations={hooksAnnotations} />
      <div className="flex flex-wrap gap-2 mt-2">
        <CodeViewButton onClick={() => onCodeRef('hooks-0', codeRefs['hooks-0'])} />
        <span className="text-[10px] text-muted-foreground self-center">Bash 명령어 검증 훅 예제</span>
        <CodeViewButton onClick={() => onCodeRef('hooks-1', codeRefs['hooks-1'])} />
        <span className="text-[10px] text-muted-foreground self-center">규칙 평가 엔진</span>
        <CodeViewButton onClick={() => onCodeRef('hooks-2', codeRefs['hooks-2'])} />
        <span className="text-[10px] text-muted-foreground self-center">설정 로더 구조체</span>
      </div>
      <CitationBlock source="Claude Code 공식 문서 - Hooks" citeKey={2} type="paper" href="https://docs.anthropic.com/en/docs/claude-code/hooks">
        <p className="italic">"Hooks allow you to execute shell commands at specific points in Claude Code's lifecycle. They enable customizing behavior without modifying the core tool, running validation, formatting, notifications, and more."</p>
        <p className="mt-2 text-xs">Hooks — 18개 라이프사이클 이벤트 + 4가지 핸들러 타입(command, http, prompt, agent)으로 Claude Code 동작을 세밀하게 커스터마이징 가능</p>
      </CitationBlock>
      <CitationBlock source=".claude/settings.json Hook 설정 예시" citeKey={3} type="code">
        <CodePanel title="Hook 설정 예시" code={`{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "command": "~/scripts/validate-bash.sh"
    }],
    "PostToolUse": [{
      "matcher": "Write",
      "command": "~/scripts/lint-on-write.sh"
    }]
  }
}`} annotations={[
          { lines: [3, 6], color: 'sky', note: 'Bash 실행 전 검증 훅' },
          { lines: [7, 10], color: 'emerald', note: '파일 작성 후 린팅 훅' },
        ]} />
        <p className="mt-2 text-xs">PreToolUse 훅 — Bash 실행 전 검증, PostToolUse 훅 — 파일 작성 후 자동 린팅 설정 예시. matcher로 특정 도구에만 적용 가능</p>
      </CitationBlock>
    </>
  );
}
