import CodePanel from '@/components/ui/code-panel';

const SERVICE_MONITOR_YAML = `apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: vllm-metrics
  labels:
    release: prometheus
spec:
  selector:
    matchLabels:
      app: vllm
  endpoints:
    - port: http
      path: /metrics
      interval: 15s`;

const PROMQL = `# TTFT P95 — 500ms 초과 시 알럿
histogram_quantile(0.95,
  rate(vllm_time_to_first_token_seconds_bucket[5m])
) > 0.5

# GPU 캐시 사용률 — 90% 초과 시 경고
avg(vllm_gpu_cache_usage_perc) by (pod) > 0.9

# 초당 생성 토큰 — 클러스터 전체 처리량
sum(rate(vllm_generation_tokens_total[1m]))`;

export default function MetricsPipeline() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">Prometheus 메트릭 파이프라인</h3>
      <CodePanel title="ServiceMonitor" code={SERVICE_MONITOR_YAML}
        annotations={[
          { lines: [8, 10], color: 'sky', note: 'app: vllm 라벨로 vLLM Pod 자동 탐지' },
          { lines: [12, 14], color: 'emerald', note: '15초 간격 /metrics 스크래핑' },
        ]}
      />
      <CodePanel title="핵심 PromQL 쿼리" code={PROMQL}
        annotations={[
          { lines: [1, 4], color: 'rose', note: 'TTFT P95 — 사용자 체감 레이턴시의 핵심 지표' },
          { lines: [6, 7], color: 'amber', note: 'KV 캐시 포화 → OOM 직전 경고' },
          { lines: [9, 10], color: 'emerald', note: '클러스터 전체 TPS — 용량 계획의 기준' },
        ]}
      />
    </>
  );
}
