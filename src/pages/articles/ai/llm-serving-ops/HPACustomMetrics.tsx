import { CitationBlock } from '@/components/ui/citation';

export default function HPACustomMetrics() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">HPA 커스텀 메트릭 스케일링</h3>
      <p>
        표준 CPU/메모리 HPA는 LLM 서빙에 부적합 — GPU 활용률과 요청 큐 깊이가 실제 부하 지표<br />
        Prometheus Adapter로 vLLM 메트릭을 K8s custom metrics API에 노출
      </p>
      <div className="grid gap-4 sm:grid-cols-2 mt-4">
        <div className="rounded-lg border-l-4 border-sky-500 bg-sky-500/5 p-4">
          <p className="font-semibold text-sky-600 dark:text-sky-400 mb-1">스케일링 대상 & 범위</p>
          <p className="text-sm text-muted-foreground">
            Deployment: <code>vllm-llama-70b</code><br />
            <code>minReplicas: 1</code> ~ <code>maxReplicas: 8</code><br />
            GPU 비용 상한을 max 8로 제어 — 최대 32 GPU 사용.
          </p>
        </div>
        <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-500/5 p-4">
          <p className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">메트릭 1: 대기 요청 수</p>
          <p className="text-sm text-muted-foreground">
            <code>vllm_num_requests_waiting</code><br />
            평균 5개 초과 시 스케일아웃 트리거.<br />
            대기 큐가 쌓이면 TTFT(첫 토큰 시간) 급증 → 선제 확장.
          </p>
        </div>
        <div className="rounded-lg border-l-4 border-amber-500 bg-amber-500/5 p-4">
          <p className="font-semibold text-amber-600 dark:text-amber-400 mb-1">메트릭 2: KV 캐시 사용률</p>
          <p className="text-sm text-muted-foreground">
            <code>vllm_gpu_cache_usage_perc</code><br />
            평균 80% 초과 시 스케일아웃.<br />
            KV 캐시 포화 → 새 요청 거부 또는 OOM 발생 방지.
          </p>
        </div>
        <div className="rounded-lg border-l-4 border-violet-500 bg-violet-500/5 p-4">
          <p className="font-semibold text-violet-600 dark:text-violet-400 mb-1">Prometheus Adapter 연동</p>
          <p className="text-sm text-muted-foreground">
            vLLM의 <code>/metrics</code> 엔드포인트 → Prometheus 수집.<br />
            Prometheus Adapter가 custom.metrics.k8s.io API로 변환.<br />
            HPA가 30초 주기로 메트릭 조회 → 스케일 결정.
          </p>
        </div>
      </div>
      <CitationBlock source="Kubernetes Docs — HPA Custom Metrics" citeKey={4} type="paper"
        href="https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/">
        <p className="italic">
          "The HPA controller can scale based on custom metrics supplied by
          the metrics.k8s.io, custom.metrics.k8s.io, or external.metrics.k8s.io API."
        </p>
      </CitationBlock>
    </>
  );
}
