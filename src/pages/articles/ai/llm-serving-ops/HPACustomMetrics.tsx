import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const HPA_YAML = `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: vllm-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vllm-llama-70b
  minReplicas: 1
  maxReplicas: 8
  metrics:
    - type: Pods
      pods:
        metric:
          name: vllm_num_requests_waiting
        target:
          type: AverageValue
          averageValue: "5"
    - type: Pods
      pods:
        metric:
          name: vllm_gpu_cache_usage_perc
        target:
          type: AverageValue
          averageValue: "0.8"`;

export default function HPACustomMetrics() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">HPA 커스텀 메트릭 스케일링</h3>
      <p>
        표준 CPU/메모리 HPA는 LLM 서빙에 부적합 — GPU 활용률과 요청 큐 깊이가 실제 부하 지표<br />
        Prometheus Adapter로 vLLM 메트릭을 K8s custom metrics API에 노출
      </p>
      <CodePanel title="vllm-hpa.yaml" code={HPA_YAML}
        annotations={[
          { lines: [10, 11], color: 'sky', note: 'min 1 ~ max 8 replicas — GPU 비용 상한 제어' },
          { lines: [12, 19], color: 'emerald', note: '대기 요청 5개 초과 시 스케일아웃 — 레이턴시 보호' },
          { lines: [20, 27], color: 'amber', note: 'KV 캐시 80% 초과 시 스케일아웃 — OOM 방지' },
        ]}
      />
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
