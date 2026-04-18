import { CitationBlock } from '../../../../components/ui/citation';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function HooksSystem({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">Hooks 시스템</h3>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-5 mb-4">
        <h4 className="text-sm font-bold mb-3">Hooks 시스템 개요</h4>
        <p className="text-sm mb-3">Hooks = 이벤트 기반 커스텀 셸 명령. 18개 라이프사이클 이벤트에 4가지 핸들러를 연결해 Claude Code 동작을 커스터마이징한다.</p>

        <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3 mb-3">
          <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">18개 라이프사이클 이벤트</span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['SessionStart', 'UserPromptSubmit', 'PreToolUse', 'PermissionRequest', 'PostToolUse', 'PostToolUseFailure', 'Notification', 'SubagentStart', 'SubagentStop', 'Stop', 'TeammateIdle', 'TaskCompleted', 'InstructionsLoaded', 'ConfigChange', 'WorktreeCreate', 'WorktreeRemove', 'PreCompact', 'SessionEnd'].map(e => (
              <code key={e} className="text-[11px] bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 px-1.5 py-0.5 rounded">{e}</code>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">4가지 핸들러 타입</span>
            <ul className="text-sm mt-1 space-y-0.5">
              <li><strong>command</strong> — 셸 명령 (stdin/stdout/exit code로 통신)</li>
              <li><strong>http</strong> — URL 엔드포인트에 POST</li>
              <li><strong>prompt</strong> — 단일 턴 LLM 평가 (Haiku, ok/not-ok 반환)</li>
              <li><strong>agent</strong> — 서브에이전트 스폰 (최대 50 도구 턴)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3">
            <span className="text-xs font-semibold">활용 사례</span>
            <ul className="text-sm mt-1 space-y-0.5">
              <li>코드 작성 후 자동 린팅</li>
              <li>위험한 명령어 차단</li>
              <li>파일 수정 시 자동 포매팅</li>
              <li>커밋 전 테스트 자동 실행</li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">설정 예시</span>
          <pre className="text-xs mt-2 overflow-x-auto">{`{
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
}`}</pre>
        </div>
      </div>

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
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-2">
              <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">PreToolUse: Bash 실행 전 검증</span>
              <pre className="text-xs mt-1">{`"PreToolUse": [{
  "matcher": "Bash",
  "command": "~/scripts/validate-bash.sh"
}]`}</pre>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-2">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">PostToolUse: 파일 작성 후 린팅</span>
              <pre className="text-xs mt-1">{`"PostToolUse": [{
  "matcher": "Write",
  "command": "~/scripts/lint-on-write.sh"
}]`}</pre>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs">PreToolUse 훅 — Bash 실행 전 검증, PostToolUse 훅 — 파일 작성 후 자동 린팅 설정 예시. matcher로 특정 도구에만 적용 가능</p>
      </CitationBlock>
    </>
  );
}
