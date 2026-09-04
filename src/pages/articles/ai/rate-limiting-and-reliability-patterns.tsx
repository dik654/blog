import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import RateLimitingAndReliabilityPatternsViz from "./rate-limiting-and-reliability-patterns/viz/RateLimitingAndReliabilityPatternsViz";

/**
 * Rate limiting·backpressure·circuit breaker·failover
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function RateLimitingAndReliabilityPatternsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          실패 종류마다 다른 방어 장치를 겹쳐 씁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            분산 시스템에서 “실패에 대응한다”는 말은 하나의 장치가 아니라 여러
            장치를 가리킵니다. 한 번 스친 실패에는 재시도가, 계속되는 실패에는
            회로 차단이, 감당 못 할 트래픽에는 rate limiting과 load shedding이,
            그리고 구성 요소 전체가 죽는 상황에는 failover가 각각 다르게
            반응합니다.
          </p>
          <p>
            <Link to="/ai/llm-gateway-and-model-routing#fallback-model">
              LLM gateway·model routing
            </Link>{" "}
            글은 이미 fallback model이 실행 실패에 반응해 다른 model로 넘어가는
            개념을 다뤘습니다. 이 글은 그 fallback이 발동하기 전후를 감싸는
            방어 장치, 즉 언제 재시도하고 언제 포기할지, 언제 요청 자체를
            줄일지, 전체 장애 시 어떻게 넘어갈지를 다룹니다.
          </p>
          <p>
            이어지는 절은 retry와 backoff → circuit breaker와 health check →
            rate limiting 알고리즘 → load shedding과 admission policy →
            graceful degradation과 failover(그리고 이를 아우르는 reliability와
            HA) 순서로 갑니다.
          </p>
        </div>
        <ContentBoundary article="rate-limiting-and-reliability-patterns" />
      </section>

      <section id="retry-backoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Backoff는 재시도 간격을 점점 늘려 몰림을 완화합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            실패한 요청을 같은 대상에 다시 보내는 것이 request retry입니다. 일시적 network 오류나 순간적인 과부하처럼 다시 보내면 성공할 수 있는 실패에 대응합니다.
          </p>
          <p>
            문제는 실패 직후 모든 client가 동시에 재시도하면 이미 힘든 backend가 더 힘들어진다는 점입니다. Retry with backoff는 이 문제를 줄이려고 재시도 사이
            대기 시간을 시도할 때마다 점점 늘립니다.
          </p>
          <p>
            대기 시간을 매번 두 배로 늘리는 exponential backoff가 널리 쓰입니다. 여기에 무작위 값(jitter)을 더해 여러 client의 재시도 시점이 정확히 겹치지
            않게 흩어 놓습니다.
          </p>
        </div>
        <ExplainedFormula
          question="N번째 재시도까지 얼마나 기다려야 backend를 덜 몰리게 하나요?"
          idea="기본 대기 시간을 시도 횟수만큼 두 배씩 늘리되 상한을 두고, 그 값에 무작위 jitter를 곱해 여러 client의 재시도 시점을 흩어 놓습니다."
          formula={String.raw`t_n=\min(t_{\max},\,t_0\cdot 2^{n})\cdot U(0,1)`}
          annotatedFormula={String.raw`t_n=\underbrace{\min(t_{\max},\,\overbrace{t_0\cdot 2^{n}}^{\text{시도마다 두 배씩 증가}})}_{\text{상한으로 자른 exponential backoff}}\cdot\underbrace{U(0,1)}_{\text{jitter}}`}
          operations={[
            { expression: String.raw`t_0\cdot 2^{n}`, annotation: ["기본 대기 시간을", "재시도 횟수 n만큼 두 배씩 늘립니다."] },
            { expression: String.raw`\min(t_{\max}, \cdot)`, annotation: ["늘어난 값이 상한을 넘지 않게", "잘라냅니다."] },
            { expression: String.raw`\cdot U(0,1)`, annotation: ["0과 1 사이 무작위 값을 곱해", "여러 client의 재시도 시점을 흩어 놓습니다."] },
          ]}
          terms={[
            { symbol: "t_0", name: "기본 대기 시간", description: "첫 재시도 전에 기다리는 기준 시간입니다." },
            { symbol: "n", name: "재시도 횟수", description: "지금까지 실패하고 다시 시도한 횟수입니다." },
            { symbol: "t_{\\max}", name: "대기 시간 상한", description: "n이 커져도 더 늘지 않게 자르는 최대값입니다." },
            { symbol: "U(0,1)", name: "Jitter", description: "0과 1 사이에서 매번 새로 뽑는 무작위 값입니다." },
          ]}
          assumptions={[
            "재시도할 가치가 있는 idempotent 요청이라고 가정합니다. 이미 부수 효과가 발생했을 수 있는 요청은 별도 확인이 필요합니다.",
            "상한 t_max 없이 2^n만 계속 키우면 소수의 요청이 지나치게 오래 기다리게 되므로 실무에서는 상한을 둡니다.",
          ]}
          interpretation="t0=200ms, n=3이면 jitter 전 대기 시간은 1.6초입니다. Jitter를 곱하면 같은 시각 실패한 여러 client의 재시도가 0~1.6초 사이로 흩어져 한 순간에 다시 몰리는 상황을 피합니다. 이 값은 이후 절의 circuit breaker가 재시도 자체를 막기 전까지만 유효합니다."
        />
        <TermBreakdown
          title="다시 보낸다는 것과 언제 다시 보낼지"
          items={[
            { term: "Request Retry", description: "실패한 요청을 같은 대상에 다시 보내는 절차입니다.", example: "connection reset으로 실패한 요청을 그대로 다시 전송.", boundary: "이미 일부 결과가 반영된 요청(결제 등)은 재시도가 중복 실행을 만들 수 있어 idempotency 확인이 먼저 필요합니다." },
            { term: "Retry with Backoff", description: "재시도 사이 대기 시간을 시도할 때마다 점점 늘려 동시 재시도로 인한 몰림을 완화하는 정책입니다.", example: "1번째 재시도는 0.2초, 2번째는 0.4초, 3번째는 0.8초 뒤에 시도.", boundary: "대기 시간을 무한정 늘리면 사용자 입장에서는 응답이 오지 않는 것과 다를 바 없어 상한과 최대 시도 횟수를 함께 둡니다." },
          ]}
        />
      </section>

      <section id="circuit-breaker-health-check" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Circuit breaker는 계속되는 실패 앞에서 재시도 자체를 멈춥니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Backoff를 아무리 정교하게 짜도 backend 자체가 완전히 죽었다면 재시도는 결과 없이 시간과 자원만 씁니다. Circuit breaker는 실패가 반복되면 이후 요청을
            backend로 보내지 않고 즉시 실패시킵니다.
          </p>
          <p>
            Circuit breaker는 세 상태를 오갑니다. 평소에는 요청을 그대로 통과시키는 closed 상태입니다. 실패율이 임계값을 넘으면 모든 요청을 즉시 실패시키는 open
            상태로 바뀝니다. 일정 시간이 지나면 half-open 상태로 바뀌어 시험 요청 하나만 통과시켜 봅니다.
          </p>
          <p>
            Health check는 backend가 지금 요청을 처리할 수 있는 상태인지 따로 확인합니다. Circuit breaker의 half-open 시험 요청과 달리 health
            check는 실제 트래픽과 무관하게 주기적으로 backend 상태만 묻습니다.
          </p>
        </div>
        <RateLimitingAndReliabilityPatternsViz />
        <AlgorithmBlock
          title="Closed·open·half-open 사이를 오가는 circuit breaker 상태 전이"
          input={["요청", "실패율 임계값", "open 유지 시간", "half-open 시험 요청 결과"]}
          steps={[
            { code: "state ← closed", note: "평소에는 요청을 backend로 그대로 통과시킵니다." },
            { code: "on request: if state == open: return fail_fast()", note: "Open 상태면 backend를 부르지 않고 즉시 실패를 반환합니다." },
            { code: "if state == closed: result ← call(backend); update_failure_rate(result)", note: "Closed 상태에서는 실제로 호출하고 실패율을 갱신합니다." },
            { code: "if failure_rate >= threshold: state ← open; opened_at ← now()", note: "실패율이 임계값을 넘으면 open으로 전환합니다." },
            { code: "if state == open and now() - opened_at >= cooldown: state ← half_open", note: "일정 시간이 지나면 half-open으로 바꿔 시험을 준비합니다." },
            { code: "if state == half_open: probe ← call(backend)", note: "half-open에서는 시험 요청 하나만 통과시킵니다." },
            { code: "if probe.success: state ← closed else: state ← open; opened_at ← now()", note: "시험이 성공하면 closed로 복귀하고, 실패하면 다시 open으로 돌아갑니다." },
          ]}
          output="현재 state와, 그 state에 따라 통과되거나 즉시 실패한 요청 결과"
          repeatUntil="다음 요청이 도착할 때마다 반복합니다."
        />
        <div id="paper-fowler-circuit-breaker" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Martin Fowler · CircuitBreaker (bliki, 2014)"
            citeKey={1}
            href="https://martinfowler.com/bliki/CircuitBreaker.html"
          >
            보호하려는 함수 호출을 circuit breaker object로 감싸 실패를
            감시하다가, 실패가 임계값을 넘으면 이후 호출을 즉시 실패시키는
            패턴을 제시합니다. 단순 실패 횟수 대신 “50% 실패율을 넘으면
            차단”처럼 비율 기반 임계값을 쓰는 더 정교한 방식도 가능하다고
            설명합니다. 이 글의 closed/open/half-open 세 상태 이름과 절차는
            이 패턴을 일반화해 설명한 것으로, 특정 언어·라이브러리의 정확한
            API를 규정하지는 않습니다.
          </CitationBlock>
        </div>
        <TermBreakdown
          title="반복 실패를 막는 장치와 상태 확인 장치"
          items={[
            { term: "Circuit Breaker", description: "실패가 반복되면 이후 요청을 backend로 보내지 않고 즉시 실패시키는 장치로, closed·open·half-open 세 상태를 오갑니다.", example: "실패율이 50%를 넘으면 open으로 전환해 10초간 모든 요청을 즉시 실패시킵니다.", boundary: "너무 낮은 임계값은 일시적 실패에도 전체 트래픽을 차단해 backend가 회복 중이어도 계속 fail-fast만 반복될 수 있습니다." },
            { term: "Health Check", description: "실제 트래픽과 무관하게 backend가 지금 요청을 처리할 수 있는 상태인지 주기적으로 확인하는 점검입니다.", example: "5초마다 /health endpoint를 호출해 응답 여부를 확인.", boundary: "Health check가 통과해도 실제 트래픽 아래에서는 다른 병목(큐 지연 등)으로 실패할 수 있어 circuit breaker의 실패율 관측과 별개로 필요합니다." },
          ]}
        />
      </section>

      <section id="rate-limiting-algorithms" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Rate limiting은 무엇을 세느냐로 알고리즘이 갈립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Rate limiting은 일정 시간 동안 허용할 처리량에 상한을 두어 그 이상 요청이 backend에 닿지 않게 막습니다. 무엇을 세느냐에 따라 request rate
            limit(요청 수), token rate limit(LLM이 처리·생성한 token 수), concurrency limit(동시에 진행 중인 요청 수) 세 종류로 나뉩니다.
          </p>
          <p>
            Request rate limit은 초당 요청 수를 셉니다. Token rate limit은 초당 소비·생성한 token 수를 셉니다. 같은 요청 수라도 요청마다 token
            수가 크게 다른 LLM 서비스에서는 token rate limit이 더 정확한 부하 지표입니다.
          </p>
          <p>
            이 상한을 실제로 구현하는 표준 알고리즘이 token bucket과 leaky bucket입니다. Token bucket은 일정 속도로 token을 채우는 통에서 요청마다
            token을 꺼내 씁니다. 통이 비면 요청을 막습니다. Leaky bucket은 요청을 큐에 담아 고정된 속도로만 흘려보내고 큐가 넘치면 초과분을 버립니다.
          </p>
        </div>
        <ExplainedFormula
          question="Token bucket은 초당 몇 개까지, 순간적으로 몇 개까지 요청을 허용하나요?"
          idea="통에 초당 일정 속도로 token을 채우되 최대 용량을 넘지 않게 하고, 요청 하나가 도착하면 그 요청이 쓸 token만큼을 통에서 뺍니다. 통이 비어 있으면 요청을 막습니다."
          formula={String.raw`B(t)=\min\bigl(B_{\max},\,B(t-1)+r\bigr)-\,\mathbb 1[\text{요청 도착}]\cdot c`}
          annotatedFormula={String.raw`B(t)=\underbrace{\min\bigl(B_{\max},\,B(t-1)+\overbrace{r}^{\text{초당 refill rate}}\bigr)}_{\text{용량 상한 안에서 채움}}-\,\underbrace{\mathbb 1[\text{요청 도착}]\cdot c}_{\text{요청이 소비하는 token}}`}
          operations={[
            { expression: String.raw`B(t-1)+r`, annotation: ["직전 남은 token에", "초당 refill rate만큼 더합니다."] },
            { expression: String.raw`\min(B_{\max}, \cdot)`, annotation: ["더한 값이 통의 최대 용량(burst capacity)을", "넘지 않게 자릅니다."] },
            { expression: String.raw`-\,\mathbb 1[\text{요청 도착}]\cdot c`, annotation: ["요청이 도착했으면", "그 요청이 쓰는 만큼 token을 뺍니다."] },
          ]}
          terms={[
            { symbol: "B(t)", name: "시각 t의 남은 token", description: "지금 통 안에 남아 있는 token 수입니다." },
            { symbol: "r", name: "Refill rate", description: "초당 통에 채워지는 token 수입니다." },
            { symbol: "B_{\\max}", name: "Burst capacity", description: "통이 가질 수 있는 최대 token 수로, 순간적으로 허용할 최대 요청량을 정합니다." },
            { symbol: "c", name: "요청 비용", description: "요청 하나가 소비하는 token 수입니다." },
          ]}
          assumptions={[
            "요청 비용 c가 요청마다 고정이거나 미리 계산 가능하다고 가정합니다. LLM에서는 실제 token 수를 요청 전에 정확히 모를 수 있어 추정치를 씁니다.",
            "통이 비어 있으면 요청을 막는다고 가정하지만, 막는 대신 대기시키는 변형(leaky bucket에 가까운 동작)도 가능합니다.",
          ]}
          interpretation="r=10, B_max=30이면 평소에는 초당 10개까지 허용하지만, 통이 가득 찬 상태에서는 순간적으로 30개까지 burst를 허용합니다. r만 있고 B_max가 0이면 순간적인 몰림을 전혀 허용하지 않는 엄격한 rate limiting이 됩니다."
        />
        <div id="paper-rfc2697-token-bucket" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="RFC 2697 · A Single Rate Three Color Marker (IETF)"
            citeKey={2}
            href="https://www.rfc-editor.org/rfc/rfc2697"
          >
            공통 속도(CIR)를 공유하는 두 token bucket(C, E)으로 트래픽을
            표시하는 방법을 정의합니다. 두 bucket은 committed burst
            size(CBS)·excess burst size(EBS)까지 차 있다가, 도착한 패킷 크기만큼
            token을 빼는 방식으로 순간 burst 허용량과 평균 속도를 함께
            표현합니다. 네트워크 트래픽 관리 맥락의 marker 정의이며, 이 글의
            request/token rate limit이 정확히 이 RFC의 색상 분류 규칙을
            그대로 따른다고 주장하지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-nginx-leaky-bucket" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="nginx · ngx_http_limit_req_module (공식 문서)"
            citeKey={3}
            href="https://nginx.org/en/docs/http/ngx_http_limit_req_module.html"
          >
            IP 같은 key별 요청 처리 속도를 “leaky bucket” 방식으로 제한한다고
            명시하며, 초당 평균 허용 속도(rate)와 그 속도를 넘는 요청을 큐에
            쌓아 둘 수 있는 최대 burst 크기를 함께 설정하는 방법을 보여
            줍니다. Burst를 넘는 요청은 지연되거나 즉시 오류로 종료됩니다.
          </CitationBlock>
        </div>
        <ProgressiveDetail
          title="Concurrency limit은 rate limit과 무엇이 다른가요"
          preview="Rate limit은 '초당 몇 건'을 세지만, concurrency limit은 '지금 동시에 진행 중인 요청이 몇 건'을 셉니다. 요청 하나가 오래 걸리는 LLM 서비스에서는 이 차이가 큽니다."
        >
          <p>
            초당 요청 수가 낮아도 각 요청이 수십 초씩 걸리면 동시에 진행 중인 요청 수는 계속 쌓일 수 있습니다. Concurrency limit은 이 동시 진행 건수 자체에 상한을 둬
            rate limit만으로는 못 막는 자원 고갈을 막습니다. 두 제한은 서로 다른 신호를 보므로 함께 쓰는 경우가 많습니다.
          </p>
        </ProgressiveDetail>
        <TermBreakdown
          title="무엇을 세는가로 나눈 rate limit과 그 구현 알고리즘"
          items={[
            { term: "Rate Limiting", description: "일정 시간 동안 허용할 처리량에 상한을 두어 그 이상 요청이 backend에 닿지 않게 막는 절차입니다.", example: "초당 100건까지만 허용하고 초과분은 거절.", boundary: "무엇을 세느냐(요청 수·token 수·동시 진행 건수)에 따라 실제로 막는 부하의 종류가 달라집니다." },
            { term: "Request Rate Limit", description: "일정 시간 동안 허용할 요청 수에 상한을 두는 rate limiting입니다.", example: "IP당 초당 10건.", boundary: "요청마다 처리 비용(token 수)이 크게 다르면 요청 수만으로는 실제 부하를 정확히 반영하지 못합니다." },
            { term: "Token Rate Limit", description: "일정 시간 동안 허용할 input/output token 수에 상한을 두는 rate limiting입니다.", example: "tenant당 분당 100,000 token.", boundary: "요청 전에는 실제 output token 수를 정확히 몰라 추정치로 한도를 관리해야 합니다." },
            { term: "Concurrency Limit", description: "동시에 진행 중인 요청 수 자체에 상한을 두는 제한입니다.", example: "backend당 동시 진행 요청 200건까지 허용.", boundary: "요청이 오래 걸리는 서비스에서는 rate limit이 낮아도 concurrency는 계속 쌓일 수 있어 별도로 관리해야 합니다." },
            { term: "Token Bucket", description: "일정 속도로 token을 채우는 통에서 요청마다 필요한 token을 꺼내 쓰고, 통이 비면 막는 rate limiting 알고리즘입니다.", example: "초당 10개 refill, 최대 30개 burst capacity.", boundary: "통이 가득 찬 상태에서는 짧은 시간에 burst capacity만큼 몰린 요청을 그대로 허용합니다." },
            { term: "Leaky Bucket", description: "요청을 큐에 담아 고정된 속도로만 흘려보내고 큐가 넘치면 초과분을 버리거나 지연시키는 rate limiting 알고리즘입니다.", example: "초당 1건 처리, burst 5건까지는 큐에서 대기, 그 이상은 오류로 종료.", boundary: "Token bucket과 달리 출력 속도가 고정돼 있어 순간적으로 몰린 요청도 결국 일정한 속도로만 처리됩니다." },
          ]}
        />
      </section>

      <section id="load-shedding-and-admission" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Load shedding은 넘친 뒤에, admission policy는 문 앞에서 거릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Rate limit을 걸어도 순간적인 traffic 급증이나 backend 성능 저하로 시스템이 감당 범위를 넘을 수 있습니다. Load shedding은 이럴 때 일부 요청을
            의도적으로 거절해 나머지 요청이라도 정상적으로 처리되게 지킵니다.
          </p>
          <p>
            어떤 요청을 먼저 거절할지는 admission policy가 정합니다. 예를 들어 유료 tenant보다 무료 tenant의 요청을 먼저 거절하거나, 이미 큐에서 오래 기다린
            요청보다 방금 도착한 요청을 먼저 거절하는 식입니다.
          </p>
          <p>
            <Link to="/ai/vllm-serving#overview">vLLM 서빙</Link> 글이 다루는
            GPU 안의 admission control은 이미 받아들인 요청을 KV memory·동시
            sequence 수 기준으로 GPU 스케줄러 단계에서 admission합니다. 이
            글의 admission policy는 그보다 앞선 문 앞, 즉 요청이 스케줄러에
            들어가기도 전에 통째로 받을지 거절할지를 정하는 자리입니다.
          </p>
        </div>
        <TermBreakdown
          title="넘친 뒤 버리는 것과 문 앞에서 거르는 규칙"
          items={[
            { term: "Load Shedding", description: "시스템이 감당 범위를 넘었을 때 일부 요청을 의도적으로 거절해 나머지 요청의 정상 처리를 지키는 절차입니다.", example: "queue depth가 상한을 넘으면 신규 요청의 10%를 즉시 거절.", boundary: "무엇을 먼저 버릴지 정하지 않으면 중요한 요청과 사소한 요청을 무작위로 같이 버리게 됩니다." },
            { term: "Admission Policy", description: "load shedding이 발동했을 때 어떤 요청을 먼저 거절할지 정하는 규칙입니다.", example: "유료 tenant 요청을 무료 tenant보다 우선 수락.", boundary: "이 규칙은 요청이 GPU 스케줄러에 들어가기 전 단계이며, 스케줄러 안의 memory·sequence 기준 admission과는 다른 층입니다." },
          ]}
        />
      </section>

      <section id="graceful-degradation-and-failover" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Reliability는 HA·fault tolerance·failover가 함께 만드는 결과입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Reliability는 시스템이 요구된 조건에서 계속 올바르게 동작하는 정도를 가리키는 최상위 목표입니다. 이 목표는 그 자체로 구현하는 것이 아닙니다. 앞 절들의
            retry·circuit breaker·rate limiting과 지금부터 볼 HA·fault tolerance·graceful degradation·failover가 함께
            쌓아 만드는 결과입니다.
          </p>
          <p>
            High availability(HA)는 중복 구성으로 한 구성 요소가 죽어도 서비스 전체가 계속 응답하게 만드는 목표입니다. Fault tolerance는 장애가 발생해도
            시스템이 계속 정상적으로 동작하는 능력을 말합니다. Failover는 이 둘을 실제로 구현하는 절차로, 주 구성 요소가 죽으면 대기 중이던 예비 구성 요소로 트래픽을 옮깁니다.
          </p>
          <p>
            Graceful degradation은 failover로도 전체 기능을 유지할 수 없을 때
            일부 기능을 줄여서라도 서비스를 완전히 멈추지 않는 방식입니다.
            예를 들어 추천 기능이 죽으면 개인화 추천 대신 인기 항목 목록을
            보여 주는 식으로, 전부 아니면 전무가 아니라 낮은 품질로라도
            계속 응답합니다.
          </p>
        </div>
        <TermBreakdown
          title="최상위 목표와 그것을 달성하는 수단"
          description="Reliability라는 목표를 HA·fault tolerance가 정의하고, failover·graceful degradation이 실제로 구현합니다."
          items={[
            { term: "Reliability", description: "시스템이 요구된 조건에서 계속 올바르게 동작하는 정도를 가리키는 최상위 목표입니다.", example: "1년 중 서비스가 정상 응답한 시간의 비율로 측정.", boundary: "Reliability 자체는 측정 대상이지 하나의 구현 기법이 아니어서, 아래 개념들이 이를 달성하는 구체적 수단입니다." },
            { term: "High Availability (HA)", description: "중복 구성으로 한 구성 요소가 죽어도 서비스 전체가 계속 응답하게 만드는 목표입니다.", example: "같은 역할의 서버 3대를 다른 가용 영역에 배치.", boundary: "중복만으로는 장애 발생 시 실제로 트래픽을 옮기는 절차(failover)가 없으면 자동으로 복구되지 않습니다." },
            { term: "Fault Tolerance", description: "구성 요소 일부에 장애가 발생해도 시스템이 계속 정상적으로 동작하는 능력입니다.", example: "GPU 한 대가 죽어도 나머지 GPU로 요청을 계속 처리.", boundary: "장애를 견디는 것과, 그 상태에서도 품질을 낮추지 않고 계속 응답하는 것은 별개이며 후자는 graceful degradation의 영역입니다." },
            { term: "Failover", description: "주 구성 요소가 죽으면 대기 중이던 예비 구성 요소로 트래픽을 옮기는 절차입니다.", example: "주 데이터센터 장애 시 대기 데이터센터로 트래픽 전환.", boundary: "전환 자체에도 시간이 걸리므로(전환 지연) 그 사이 요청은 여전히 실패할 수 있습니다." },
            { term: "Graceful Degradation", description: "전체 기능을 유지할 수 없을 때 일부 기능을 줄여서라도 서비스를 완전히 멈추지 않는 방식입니다.", example: "개인화 추천이 죽으면 인기 항목 목록으로 대체.", boundary: "무엇을 줄일지 미리 정해 두지 않으면 장애 시점에 임기응변으로 대응하게 되어 예측 가능한 저하가 되지 않습니다." },
          ]}
        />
      </section>
    </div>
  );
}
