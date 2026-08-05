import { CitationBlock } from '@/components/ui/citation';

const scopeMap = [
  ['provider abstraction', 'OpenAI, Anthropic, Gemini, Bedrock, Azure, self-hosted vLLM 등을 같은 호출 형태로 묶는다.', 'provider별 request/response 차이를 app 코드에 새기지 않는다.'],
  ['proxy server', '팀/서비스가 직접 provider key를 들고 있지 않고 gateway endpoint만 호출한다.', 'key 관리, audit, budget, logging이 중앙화된다.'],
  ['python sdk/router', '애플리케이션 안에서 Router를 직접 써서 retry, fallback, deployment selection을 수행한다.', '서비스 내부 라우팅이면 gateway 장애점을 줄일 수 있지만 정책 중복이 생긴다.'],
  ['load balancing', '같은 model group 아래 여러 deployment를 두고 latency, cost, usage, health 기준으로 고른다.', '한 모델 이름이 여러 물리 provider를 대표한다.'],
  ['reliability controls', 'retry, timeout, fallback, cooldown, health check를 요청 단위로 적용한다.', 'provider 장애와 모델 과부하를 사용자 오류로 노출하지 않는다.'],
  ['spend controls', 'team/user/key/model 단위 budget, rate limit, usage tracking을 둔다.', '성능보다 비용 폭주가 더 큰 장애인 batch/eval workload를 제어한다.'],
  ['observability', 'prompt, token, cost, latency, provider, fallback 여부를 로그/트레이스로 남긴다.', '나중에 route 품질과 장애 원인을 재구성할 수 있다.'],
  ['governance', 'allowed model, PII policy, audit trail, admin key, virtual key를 관리한다.', 'LLM 호출이 조직 보안 경계 안에 들어온다.'],
];

const routingDecisions = [
  ['latency', '사용자 대화, agent loop', '최근 성공 latency, region, provider health', '가장 빠른 모델만 고르면 비용이 폭주할 수 있음'],
  ['cost', '대량 요약, batch eval', 'token price, monthly budget, cached prompt ratio', '싼 모델이 느리거나 실패율이 높으면 재시도 비용이 커짐'],
  ['reliability', '프로덕션 API, 유료 기능', 'error rate, cooldown, fallback chain', 'fallback 모델의 품질 차이를 별도 eval로 검증해야 함'],
  ['capability', 'tool use, long context, vision', 'model feature, context window, structured output support', '라우터가 단순 이름 매칭만 하면 잘못된 모델로 보낼 수 있음'],
];

const failureModes = [
  {
    name: 'provider rate limit',
    signal: '429, queue time 증가, 특정 provider만 실패',
    response: 'cooldown에 넣고 같은 model group의 다른 deployment로 우회',
  },
  {
    name: 'model overload',
    signal: 'TTFT 상승, timeout 증가, GPU KV cache 포화',
    response: 'self-hosted vLLM replica scale-out 또는 작은 fallback 모델로 degrade',
  },
  {
    name: 'budget exhaustion',
    signal: 'team/user budget 초과, expensive model share 증가',
    response: '고가 모델 차단, cheap model route, batch job delay',
  },
  {
    name: 'quality mismatch',
    signal: 'fallback 후 JSON 깨짐, tool call 누락, hallucination 증가',
    response: 'fallback을 기능 동등 모델로 제한하고 route별 eval gate 추가',
  },
];

export default function GatewayDeepDive() {
  return (
    <>
      <h3 id="litellm-scope" className="text-xl font-semibold mt-8 mb-3">LiteLLM이 다루는 전체 범위</h3>
      <p>
        LiteLLM을 “모델 호출 wrapper”로만 보면 범위가 너무 작다. 프로덕션에서는
        <strong> provider 추상화, gateway, routing, 비용 통제, reliability, observability, governance</strong>를
        한 번에 다루는 LLM control plane으로 봐야 한다.
      </p>
      <div className="grid gap-3 md:grid-cols-2 mt-4">
        {scopeMap.map(([area, meaning, why]) => (
          <div key={area} className="rounded-lg border bg-background p-4">
            <p className="font-mono text-xs text-muted-foreground mb-1">{area}</p>
            <p className="text-sm font-semibold">{meaning}</p>
            <p className="text-sm text-muted-foreground mt-2">{why}</p>
          </div>
        ))}
      </div>
      <CitationBlock source="LiteLLM Docs — Getting Started" citeKey={6} type="paper"
        href="https://docs.litellm.ai/">
        <p className="text-sm">
          공식 문서 기준 LiteLLM은 Proxy Server와 Python SDK를 제공하고,
          router retry/fallback, spend tracking, budget, logging/observability를 주요 범위로 둔다.
        </p>
      </CitationBlock>

      <h3 id="gateway-boundary" className="text-xl font-semibold mt-8 mb-3">게이트웨이가 책임지는 경계</h3>
      <p>
        LiteLLM 게이트웨이는 단순한 API proxy가 아니라 <strong>모델 선택권을 애플리케이션 밖으로 빼는 제어면</strong>이다.
        애플리케이션은 <code>model="chat-fast"</code>처럼 논리 모델만 호출하고, 게이트웨이는 그 요청을 실제 provider,
        region, deployment, budget 상태에 맞춰 물리 모델로 바꾼다.
      </p>
      <div className="grid gap-3 md:grid-cols-3 mt-4">
        <div className="rounded-lg border border-sky-500/25 bg-sky-500/5 p-4">
          <p className="font-semibold text-sky-600 dark:text-sky-400 mb-1">API compatibility</p>
          <p className="text-sm text-muted-foreground">
            OpenAI-compatible request/response를 유지해 client 변경 없이 provider를 교체한다.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-4">
          <p className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">policy enforcement</p>
          <p className="text-sm text-muted-foreground">
            budget, retry, timeout, fallback, logging을 app마다 복제하지 않고 중앙에서 적용한다.
          </p>
        </div>
        <div className="rounded-lg border border-violet-500/25 bg-violet-500/5 p-4">
          <p className="font-semibold text-violet-600 dark:text-violet-400 mb-1">operational telemetry</p>
          <p className="text-sm text-muted-foreground">
            provider별 latency, cost, error rate를 같은 차원으로 모아 route 품질을 비교한다.
          </p>
        </div>
      </div>

      <h3 id="routing-decision" className="text-xl font-semibold mt-8 mb-3">라우팅 판단 축</h3>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">전략</th>
              <th className="p-3">맞는 요청</th>
              <th className="p-3">봐야 할 상태</th>
              <th className="p-3">위험</th>
            </tr>
          </thead>
          <tbody>
            {routingDecisions.map(([strategy, request, state, risk]) => (
              <tr key={strategy} className="border-t">
                <td className="p-3 font-mono text-xs">{strategy}</td>
                <td className="p-3">{request}</td>
                <td className="p-3 text-muted-foreground">{state}</td>
                <td className="p-3 text-muted-foreground">{risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 id="gateway-failure" className="text-xl font-semibold mt-8 mb-3">실패 모드와 대응</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {failureModes.map((mode) => (
          <div key={mode.name} className="rounded-lg border border-border bg-background p-4">
            <p className="font-semibold mb-2">{mode.name}</p>
            <p className="text-sm text-muted-foreground"><strong>신호:</strong> {mode.signal}</p>
            <p className="text-sm text-muted-foreground mt-1"><strong>대응:</strong> {mode.response}</p>
          </div>
        ))}
      </div>

      <h3 id="litellm-production-checklist" className="text-xl font-semibold mt-8 mb-3">프로덕션 체크리스트</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-2">route 설계</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>논리 모델 이름과 실제 provider deployment를 분리한다.</li>
            <li>fallback 후보는 기능 동등성, context window, structured output 지원을 맞춘다.</li>
            <li>agent workflow는 step별 provider 변경이 trace에 남아야 한다.</li>
          </ul>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-2">비용/권한</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>user, team, project, key 단위 budget을 분리한다.</li>
            <li>expensive model은 allowlist 또는 approval 경계를 둔다.</li>
            <li>batch/eval workload는 interactive traffic과 rate limit을 분리한다.</li>
          </ul>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-2">관측성</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>provider, model, deployment, latency, tokens, cost, fallback 여부를 모두 기록한다.</li>
            <li>route 변경 전후의 quality eval과 cost delta를 같이 본다.</li>
            <li>prompt/response logging은 PII 정책과 retention 정책을 먼저 정한다.</li>
          </ul>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-2">장애 대응</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>provider 장애, rate limit, budget exhaustion을 서로 다른 alert로 분리한다.</li>
            <li>cooldown은 너무 짧으면 flapping, 너무 길면 capacity 낭비가 된다.</li>
            <li>fallback은 성공률뿐 아니라 품질 저하와 비용 증가를 같이 기록한다.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
