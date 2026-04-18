import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function EmbeddedAgent({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">임베디드 에이전트 실행</h3>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('oc-embedded-runner', codeRefs['oc-embedded-runner'])} />
          <span className="text-[10px] text-muted-foreground self-center">pi-embedded-runner.ts</span>
        </div>
      )}

      <div className="not-prose rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-5 mb-4">
        <h4 className="text-sm font-bold mb-3">Pi 임베디드 에이전트 방식</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-3">
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">일반적 방식 (subprocess)</span>
            <p className="text-sm mt-1">OpenClaw → spawn("pi-agent") → stdin/stdout → 결과 파싱</p>
            <p className="text-xs text-muted-foreground mt-1">프로세스 간 통신 오버헤드, 제한된 제어</p>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">임베디드 방식 (embedded)</span>
            <p className="text-sm mt-1">import {'{ createAgentSession }'} from 'pi-coding-agent' → 직접 인스턴스화 & 이벤트 구독</p>
            <p className="text-xs text-muted-foreground mt-1">완전한 라이프사이클 제어</p>
          </div>
        </div>

        <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3 mb-3">
          <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">세션 라이프사이클 4단계</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div>
              <p className="text-sm"><strong>1. createAgentSession(config)</strong></p>
              <p className="text-xs text-muted-foreground">모델 선택, 시스템 프롬프트, 도구 설정</p>
              <p className="text-sm mt-2"><strong>2. runEmbeddedPiAgent</strong></p>
              <p className="text-xs text-muted-foreground">message, sessionManager, tools, systemPrompt 전달</p>
            </div>
            <div>
              <p className="text-sm"><strong>3. 이벤트 구독</strong></p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                <li>onBlockReply — 텍스트 스트리밍 → 채널 전달</li>
                <li>onToolCall — 도구 실행 상태 표시</li>
                <li>onComplete — 최종 응답 전송</li>
              </ul>
              <p className="text-sm mt-2"><strong>4. 세션 영속성</strong></p>
              <p className="text-xs text-muted-foreground">~/.openclaw/sessions/{'<sessionId>'}.jsonl — 브랜칭 & 컴팩션 지원</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3">
            <span className="text-xs font-semibold">이벤트 스트림 흐름</span>
            <p className="text-xs mt-1 font-mono text-muted-foreground">agent_start → turn_start → message_start → text_delta... → tool_execution → message_end → turn_end → agent_end</p>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">최소 설계 에이전트 루프</span>
            <p className="text-sm mt-1">LLM 스트리밍 → 도구 호출 확인 → 순차 실행 → 컨텍스트 추가 → 반복</p>
            <p className="text-xs text-muted-foreground mt-1">명시적 태스크 플래너나 DAG 없음 — LLM이 워크플로우 주도</p>
          </div>
        </div>
      </div>
    </>
  );
}
