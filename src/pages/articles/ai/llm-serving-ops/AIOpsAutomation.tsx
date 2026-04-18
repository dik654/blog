import { CitationBlock } from '@/components/ui/citation';

export default function AIOpsAutomation() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">AIOps 자동 대응</h3>
      <p>
        알럿 → 자동 대응 파이프라인 구축이 AIOps의 핵심<br />
        Level 1: HPA가 메트릭 기반 자동 스케일링<br />
        Level 2: AlertManager → Webhook → LiteLLM 폴백 모델 전환<br />
        Level 3: Karpenter가 GPU 노드 자동 프로비저닝
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
        {/* Alert: HighTTFT */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400">HighTTFT</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">warning</span>
          </div>
          <div className="space-y-1.5 text-sm">
            <div>
              <span className="text-foreground/50 text-xs">조건</span>
              <p className="font-mono text-xs mt-0.5">TTFT P95 {'>'} 500ms (5분 지속)</p>
            </div>
            <div>
              <span className="text-foreground/50 text-xs">PromQL</span>
              <p className="font-mono text-[11px] mt-0.5 text-foreground/70">
                histogram_quantile(0.95, rate(vllm_time_to_first_token_seconds_bucket[5m])) {'>'} 0.5
              </p>
            </div>
            <div className="pt-1 border-t border-amber-500/15">
              <span className="text-foreground/50 text-xs">대응</span>
              <p className="text-xs mt-0.5">vLLM 레플리카 스케일 아웃</p>
            </div>
          </div>
        </div>

        {/* Alert: GPUCacheExhausted */}
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-400">GPUCacheExhausted</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400">critical</span>
          </div>
          <div className="space-y-1.5 text-sm">
            <div>
              <span className="text-foreground/50 text-xs">조건</span>
              <p className="font-mono text-xs mt-0.5">GPU KV Cache {'>'} 90% (2분 지속)</p>
            </div>
            <div>
              <span className="text-foreground/50 text-xs">PromQL</span>
              <p className="font-mono text-[11px] mt-0.5 text-foreground/70">
                avg(vllm_gpu_cache_usage_perc) {'>'} 0.9
              </p>
            </div>
            <div className="pt-1 border-t border-rose-500/15">
              <span className="text-foreground/50 text-xs">대응</span>
              <p className="text-xs mt-0.5">즉시 스케일아웃 필수</p>
            </div>
          </div>
        </div>
      </div>

      <CitationBlock source="Prometheus Alerting Rules" citeKey={5} type="paper"
        href="https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/">
        <p className="italic">
          "Alerting rules allow you to define alert conditions based on Prometheus expression language
          expressions and to send notifications about firing alerts to an external service."
        </p>
        <p className="mt-2 text-xs">
          for: 5m — 일시적 스파이크가 아닌 지속적 이상만 알럿 발생,
          노이즈 최소화
        </p>
      </CitationBlock>
    </>
  );
}
