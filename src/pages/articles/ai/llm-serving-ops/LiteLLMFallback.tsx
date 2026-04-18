import { CitationBlock } from '@/components/ui/citation';
import CodeSidebar from './CodeSidebar';
import { fallbackRef, cooldownRef } from './codeRefs';

export default function LiteLLMFallback() {
  return (
    <>
      <div className="flex items-center gap-3 mt-6 mb-3">
        <h3 className="text-xl font-semibold">폴백 & 비용 관리</h3>
        <CodeSidebar refs={[fallbackRef, cooldownRef]}
          trigger={
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono
              border border-border/50 rounded hover:bg-accent cursor-pointer text-foreground/60">
              {'</>'} fallback + cooldown
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* Fallback Chain */}
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4">
          <div className="text-xs font-semibold text-rose-400 mb-2">폴백 체인</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-rose-500/10 px-1.5 py-0.5 rounded">gpt-4o</span>
              <span className="text-foreground/40">→</span>
              <span className="font-mono text-xs bg-rose-500/10 px-1.5 py-0.5 rounded">claude-sonnet</span>
              <span className="text-foreground/40">→</span>
              <span className="font-mono text-xs bg-rose-500/10 px-1.5 py-0.5 rounded">llama-70b</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-rose-500/10 px-1.5 py-0.5 rounded">llama-70b</span>
              <span className="text-foreground/40">→</span>
              <span className="font-mono text-xs bg-rose-500/10 px-1.5 py-0.5 rounded">gpt-4o-mini</span>
            </div>
            <p className="text-xs text-foreground/60 mt-1">Primary 실패 시 순차 폴백</p>
          </div>
        </div>

        {/* Retry Policy */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="text-xs font-semibold text-amber-400 mb-2">예산 관리</div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/70">월간 한도</span>
              <span className="font-mono text-xs">$1,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">예산 주기</span>
              <span className="font-mono text-xs">30일</span>
            </div>
            <p className="text-xs text-foreground/60 mt-1">초과 시 요청 차단</p>
          </div>
        </div>

        {/* Timeout Settings */}
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="text-xs font-semibold text-emerald-400 mb-2">얼럿 설정</div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/70">채널</span>
              <span className="font-mono text-xs">Slack</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">경고 임계값</span>
              <span className="font-mono text-xs">80%</span>
            </div>
            <p className="text-xs text-foreground/60 mt-1">80% 도달 시 사전 경고</p>
          </div>
        </div>
      </div>

      <CitationBlock source="LiteLLM Docs — Reliability" citeKey={2} type="paper"
        href="https://docs.litellm.ai/docs/routing">
        <p className="italic">
          "If the primary model fails, LiteLLM automatically tries the fallback models in order.
          Supports retries, timeouts, and cooldown periods per model."
        </p>
        <p className="mt-2 text-xs">
          폴백 실행 경로: <code>async_function_with_fallbacks()</code> → retries 소진 →{' '}
          <code>fallback_common_utils()</code>로 모델 그룹 전환.
          쿨다운 판단은 <code>_is_cooldown_required()</code>에서 HTTP 상태코드 기반으로 결정
        </p>
      </CitationBlock>
    </>
  );
}
