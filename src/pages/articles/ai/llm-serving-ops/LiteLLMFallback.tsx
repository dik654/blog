import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import CodeSidebar from './CodeSidebar';
import { fallbackRef, cooldownRef } from './codeRefs';

const FALLBACK_CONFIG = `router_settings:
  fallbacks:
    - gpt-4o: [claude-sonnet, llama-70b]
    - llama-70b: [gpt-4o-mini]

  # 예산 관리
  litellm_settings:
    max_budget: 1000        # 월 $1000
    budget_duration: 30d

    # 예산 초과 시 저비용 모델로 전환
    alerting:
      - slack
    alerting_threshold: 80  # 80% 도달 시 경고`;

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
      <CodePanel title="litellm_config.yaml — fallbacks" code={FALLBACK_CONFIG}
        annotations={[
          { lines: [2, 4], color: 'rose', note: 'Primary 실패 시 순차 폴백 — gpt-4o → claude → llama' },
          { lines: [7, 9], color: 'amber', note: '월간 예산 한도 설정 — 초과 시 요청 차단' },
          { lines: [12, 14], color: 'emerald', note: '80% 도달 시 Slack 경고 → 사전 대응' },
        ]}
      />
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
