import { CitationBlock } from '../../../../components/ui/citation';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function PiSDKStructure({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">Pi SDK 패키지 구조</h3>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('oc-embedded-runner', codeRefs['oc-embedded-runner'])} />
          <span className="text-[10px] text-muted-foreground self-center">pi-embedded-runner.ts</span>
        </div>
      )}

      <div className="not-prose">
        <p className="text-sm font-semibold mb-3">Pi SDK 패키지 의존성</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-4">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">@mariozechner/pi-ai</p>
            <p className="text-sm">핵심 LLM 추상화: Model, streamSimple, 메시지 타입</p>
            <p className="text-xs text-muted-foreground mt-1">프로바이더 API (OpenAI, Anthropic, Google 등) — 모델 독립적 인터페이스</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950 p-4">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">@mariozechner/pi-agent-core</p>
            <p className="text-sm">에이전트 루프: 도구 실행, AgentMessage 타입</p>
            <p className="text-xs text-muted-foreground mt-1">도구 정의 &amp; 실행 프레임워크 + 에이전트 상태 관리</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 p-4">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">@mariozechner/pi-coding-agent</p>
            <p className="text-sm">상위 SDK: createAgentSession, SessionManager</p>
            <p className="text-xs text-muted-foreground mt-1">AuthStorage, ModelRegistry, 내장 도구 (파일 편집, 셸 실행 등) — Claude Code와 유사</p>
          </div>
          <div className="rounded-xl border border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950 p-4">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">@mariozechner/pi-tui</p>
            <p className="text-sm">터미널 UI 컴포넌트</p>
            <p className="text-xs text-muted-foreground mt-1">OpenClaw 로컬 TUI 모드에서 사용</p>
          </div>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">의존성 흐름</p>
          <p className="text-sm font-mono">pi-ai → pi-agent-core → pi-coding-agent ← OpenClaw 임베드</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950 p-4">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">도구 어댑터 레이어</p>
            <p className="text-sm">pi-agent-core의 AgentTool ≠ pi-coding-agent의 ToolDefinition</p>
            <p className="text-xs text-muted-foreground mt-1">toToolDefinitions()로 브릿지 — OpenClaw 정책 필터링, 샌드박스 통합 유지</p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950 p-4">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2">기본 도구 커스터마이징</p>
            <p className="text-sm">bash → exec/process로 교체, read/edit/write → 샌드박스 경로 정책 적용</p>
            <p className="text-xs text-muted-foreground mt-1">+ messaging, browser, canvas, sessions, cron, gateway 도구 추가</p>
          </div>
        </div>
      </div>

      <CitationBlock source="OpenClaw — pi-tool-definition-adapter.ts" citeKey={2} type="code"
        href="https://github.com/openclaw/openclaw">
        <div className="not-prose">
          <p className="text-sm font-semibold mb-3">도구 어댑터 브릿지</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-4">
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">toToolDefinitions()</p>
              <p className="text-sm">AgentTool[] → ToolDefinition[] 변환</p>
              <p className="text-xs text-muted-foreground mt-1">name, description, inputSchema 매핑 + execute 래핑</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950 p-4">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">정책 통합</p>
              <p className="text-sm">OpenClaw 채널별 정책 필터링</p>
              <p className="text-xs text-muted-foreground mt-1">샌드박스 경로 정책 유지</p>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs">
          Pi SDK의 두 레이어(pi-agent-core / pi-coding-agent)는 서로 다른 도구 인터페이스 사용 —
          toToolDefinitions() 어댑터가 이 차이를 브릿지하면서 OpenClaw 채널별 정책 필터링과
          샌드박스 경로 정책 유지
        </p>
      </CitationBlock>
    </>
  );
}
