import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const ALERTING_YAML = `# Prometheus AlertManager Rules
groups:
  - name: llm-serving
    rules:
      - alert: HighTTFT
        expr: |
          histogram_quantile(0.95,
            rate(vllm_time_to_first_token_seconds_bucket[5m])
          ) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "TTFT P95 > 500ms for 5min"
          runbook: "Scale out vLLM replicas"
      - alert: GPUCacheExhausted
        expr: avg(vllm_gpu_cache_usage_perc) > 0.9
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "GPU KV Cache > 90%"`;

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
      <CodePanel title="alerting-rules.yaml" code={ALERTING_YAML}
        annotations={[
          { lines: [5, 15], color: 'amber', note: 'TTFT 5분 지속 → warning: 수동 확인 또는 자동 스케일' },
          { lines: [16, 22], color: 'rose', note: 'KV 캐시 90% → critical: 즉시 스케일아웃 필수' },
        ]}
      />
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
