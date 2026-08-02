import { CitationBlock } from '@/components/ui/citation';

const observabilityScope = [
  ['SLO', 'availability, TTFT, end-to-end latency, timeout, quality regression', '사용자 영향 기준을 먼저 정의한다.'],
  ['engine metrics', 'vLLM/TGI queue, running requests, KV cache, tokens/sec, batch size', '서빙 엔진 내부 병목을 본다.'],
  ['GPU telemetry', 'utilization, memory, power, temperature, ECC, MIG device metrics', 'capacity와 하드웨어 이상을 분리한다.'],
  ['gateway metrics', 'provider latency, fallback count, route cost, budget burn, rate limit', '모델 gateway 정책과 provider 상태를 본다.'],
  ['tracing', 'request id, conversation id, agent step, provider, model, tool call', 'multi-step agent 실패를 재구성한다.'],
  ['logging', 'prompt/response metadata, redaction, sampling, retention', '디버깅과 보안/개인정보 사이의 균형을 잡는다.'],
  ['evaluation', 'offline eval, canary eval, regression set, human review', '빠르지만 나쁜 모델로 라우팅되는 문제를 잡는다.'],
  ['automation', 'alert, scale-out, fallback, traffic shift, rollback, incident ticket', '관측 결과가 행동으로 이어지게 한다.'],
];

const metricGroups = [
  ['user experience', 'TTFT, end-to-end latency, timeout rate', '사용자가 느끼는 품질. 가장 먼저 SLO로 둔다.'],
  ['engine throughput', 'tokens/sec, requests running/waiting, batch size', 'vLLM scheduler가 얼마나 효율적으로 일하는지 본다.'],
  ['capacity', 'GPU utilization, KV cache usage, memory reserved', 'scale-out 필요성과 OOM 위험을 판단한다.'],
  ['gateway', 'provider error rate, fallback count, route cost, budget burn', '외부 provider와 self-hosted 모델 사이의 정책 문제를 찾는다.'],
];

const runbookRows = [
  ['TTFT만 상승', 'queue depth, running requests, prefill batch', 'replica scale-out 또는 max concurrency 조정'],
  ['TPS 하락 + GPU util 낮음', 'scheduler batching, tokenization, network, CPU saturation', 'CPU/request path 병목 제거'],
  ['GPU util 높음 + KV cache 높음', 'long context traffic, max model len, cache eviction', 'context limit, replica 증가, routing 분리'],
  ['fallback 급증', 'provider status, rate limit, cooldown list', 'provider 우회, budget/quality impact 확인'],
];

export default function ObservabilityDeepDive() {
  return (
    <>
      <h3 id="observability-scope" className="text-xl font-semibold mt-8 mb-3">LLM 서빙 관측성 & AIOps의 전체 범위</h3>
      <p>
        LLM 관측성은 latency 그래프 하나가 아니다. SLO, engine metric, GPU telemetry, gateway metric,
        trace, log, eval, automation을 연결해야 “느림, 비쌈, 나쁨, 실패”를 서로 구분할 수 있다.
      </p>
      <div className="grid gap-3 md:grid-cols-2 mt-4">
        {observabilityScope.map(([area, detail, why]) => (
          <div key={area} className="rounded-lg border bg-background p-4">
            <p className="font-mono text-xs text-muted-foreground mb-1">{area}</p>
            <p className="text-sm font-semibold">{detail}</p>
            <p className="text-sm text-muted-foreground mt-2">{why}</p>
          </div>
        ))}
      </div>

      <h3 id="slo-metric-map" className="text-xl font-semibold mt-8 mb-3">SLO와 메트릭 지도</h3>
      <p>
        LLM 서빙 관측성은 GPU 대시보드만으로 끝나지 않는다. 사용자 경험, 엔진 처리량,
        capacity, gateway 정책을 한 화면에서 연결해야 “느린 이유”가 모델인지, 큐인지, provider인지 구분된다.
      </p>
      <div className="grid gap-3 md:grid-cols-2 mt-4">
        {metricGroups.map(([group, metrics, purpose]) => (
          <div key={group} className="rounded-lg border bg-background p-4">
            <p className="font-mono text-xs text-muted-foreground mb-1">{group}</p>
            <p className="text-sm font-semibold">{metrics}</p>
            <p className="text-sm text-muted-foreground mt-2">{purpose}</p>
          </div>
        ))}
      </div>

      <h3 id="runbook" className="text-xl font-semibold mt-8 mb-3">증상 기반 Runbook</h3>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">증상</th>
              <th className="p-3">먼저 볼 것</th>
              <th className="p-3">초기 대응</th>
            </tr>
          </thead>
          <tbody>
            {runbookRows.map(([symptom, inspect, action]) => (
              <tr key={symptom} className="border-t">
                <td className="p-3 font-semibold">{symptom}</td>
                <td className="p-3 text-muted-foreground">{inspect}</td>
                <td className="p-3 text-muted-foreground">{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 id="alert-design" className="text-xl font-semibold mt-8 mb-3">알럿 설계 원칙</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li><strong className="text-foreground">page는 사용자 영향 중심:</strong> TTFT, timeout, error budget burn처럼 사용자 영향이 있는 신호만 즉시 호출한다.</li>
        <li><strong className="text-foreground">ticket은 원인 후보 중심:</strong> GPU util 저하, fallback 증가, provider latency 상승은 추적 티켓으로 남긴다.</li>
        <li><strong className="text-foreground">for 구간은 모델 특성에 맞춤:</strong> 긴 context 요청은 순간 spike가 흔하므로 2분, 5분, 15분 alert를 분리한다.</li>
        <li><strong className="text-foreground">자동 대응은 rollback 가능해야 함:</strong> scale-out, route 변경, fallback 강제는 모두 원상복구 조건을 함께 둔다.</li>
      </ul>
      <CitationBlock source="Prometheus Docs — Alerting rules and Alertmanager" citeKey={9} type="paper"
        href="https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/">
        <p className="text-sm">
          Prometheus alerting rule은 PromQL 조건과 <code>for</code> 구간으로 firing 여부를 정하고,
          Alertmanager는 alert grouping, deduplication, routing, silence, inhibition을 담당한다.
          LLM 서빙에서는 일시적 긴 prompt spike와 지속적 장애를 분리하기 위해 이 구간 설계가 중요하다.
        </p>
      </CitationBlock>

      <h3 id="aiops-automation-levels" className="text-xl font-semibold mt-8 mb-3">AIOps 자동화 단계</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-1">L0: 관측만</p>
          <p className="text-sm text-muted-foreground">
            dashboard와 alert만 있고 사람이 판단한다. 초기에는 안전하지만 반복 장애 대응이 느리다.
          </p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-1">L1: scale automation</p>
          <p className="text-sm text-muted-foreground">
            queue depth, KV cache, TTFT를 기준으로 HPA/Karpenter scale-out을 자동화한다.
          </p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-1">L2: route automation</p>
          <p className="text-sm text-muted-foreground">
            provider 장애나 budget burn이 감지되면 LiteLLM route weight 또는 fallback 정책을 바꾼다.
          </p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-1">L3: release automation</p>
          <p className="text-sm text-muted-foreground">
            canary eval, SLO burn, error trend가 실패하면 자동 rollback하고 incident ticket을 만든다.
          </p>
        </div>
      </div>

      <h3 id="dashboard-layout" className="text-xl font-semibold mt-8 mb-3">대시보드 구성</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li><strong className="text-foreground">Executive row:</strong> availability, p95 TTFT, timeout rate, spend/hour, error budget burn.</li>
        <li><strong className="text-foreground">Gateway row:</strong> provider별 요청 수, fallback count, route cost, rate limit, budget exhaustion.</li>
        <li><strong className="text-foreground">Engine row:</strong> running/waiting requests, tokens/sec, batch size, KV cache usage, prefill/decode latency.</li>
        <li><strong className="text-foreground">GPU row:</strong> GPU util, memory, power, temperature, ECC, node pool capacity, Pending Pod.</li>
        <li><strong className="text-foreground">Quality row:</strong> canary eval score, structured output failure, tool-call failure, user feedback.</li>
      </ul>
    </>
  );
}
