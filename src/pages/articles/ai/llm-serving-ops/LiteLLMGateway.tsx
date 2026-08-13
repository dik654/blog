import ExplainedFormula from "@/components/ui/explained-formula";
import GatewayPolicyViz from "./viz/GatewayPolicyViz";
import RetryBoundaryViz from "./viz/RetryBoundaryViz";

const contractRows = [
  ["Capability", "context length · streaming · tools · structured output"],
  ["Policy", "tenant quota · budget · data region · retention"],
  ["Runtime", "healthy · ready · queue pressure · concurrency"],
  [
    "Provenance",
    "requested alias · selected deployment · attempt · fallback reason",
  ],
] as const;

export default function LiteLLMGateway() {
  return (
    <section id="litellm-gateway" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Gateway는 API 번역기보다 요청 정책의 경계에 가깝다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          LiteLLM Proxy 같은 gateway는 여러 provider 요청을 OpenAI-compatible
          interface로 정규화하면서 virtual key, budget, routing, retry와
          fallback을 중앙에서 적용할 수 있게 합니다. 하지만 schema가 같다고
          model의 behavior까지 같아지는 것은 아닙니다. 예를 들어 긴 context를
          받는 model이 tool schema를 지원하지 않거나, fallback 후보가 다른
          region에서 data를 처리할 수 있습니다.
        </p>
        <p className="leading-8">
          그래서 model alias에는 가격순 후보 목록이 아니라 <em>호환성 계약</em>
          을 묶습니다. 먼저 context·tool·output schema·region 조건을 만족하지
          않는 backend를 제외한 뒤, 남은 후보에서 health·queue·cost에 따라
          route를 고릅니다. 이 순서를 뒤집으면 싸거나 한가한 model을 골랐지만
          요청 자체를 수행할 수 없는 상황이 생깁니다.
        </p>
      </div>

      <GatewayPolicyViz />

      <figure data-viz="gateway-routing-contract-ledger" className="not-prose my-10 overflow-hidden rounded-xl border border-border/70 bg-card">
        <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
          <p className="text-xs font-bold text-primary">ELIGIBILITY BEFORE RANKING</p>
          <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">후보 model을 비교하기 전에 네 계약 축을 모두 통과시킵니다</h3>
        </figcaption>
        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
          {contractRows.map(([name, value], index) => (
            <article key={name} className="min-w-0 rounded-lg border bg-background p-5">
              <div className="flex items-center justify-between gap-3">
                <strong>{name}</strong>
                <span className="font-mono text-xs font-bold text-primary">0{index + 1}</span>
              </div>
              <p className="mt-3 break-words text-sm leading-6 text-muted-foreground">{value}</p>
            </article>
          ))}
        </div>
      </figure>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Retry 횟수보다 먼저 전체 deadline을 한곳에서 소유한다</h3>
        <p className="leading-8">
          Client, gateway와 provider SDK가 각각 세 번씩 재시도하면 장애 중
          backend 부하는 곱으로 커집니다. 더구나 앞선 시도가 이미 오래
          기다렸다면 마지막 시도는 성공하더라도 사용자의 deadline을 넘깁니다.
          따라서 최상위 계층이 전체 deadline을 소유하고, 하위 계층에는 남은
          시간과 허용 시도 수를 전달하는 편이 안전합니다.
        </p>
      </div>

      <ExplainedFormula
        question="현재 시점에서 한 번 더 시도할 시간이 남았는가?"
        idea={
          <>
            전체 deadline에서 이미 쓴 시간을 빼고, 다음 시도의 예상
            backoff·실행·응답 전달 시간이 그 안에 들어올 때만 재시도합니다.
            예상값 대신 보수적인 percentile을 쓰면 tail latency를 숨기지
            않습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
D_{\mathrm{remain}}&=D_{\mathrm{total}}-T_{\mathrm{elapsed}}\\
T_{\mathrm{backoff}}+\widehat T_{\mathrm{attempt}}&<D_{\mathrm{remain}}
\end{aligned}`}
        terms={[
          {
            symbol: "D_{\\mathrm{total}}",
            name: "전체 deadline",
            description: "사용자 요청이 허용하는 end-to-end 최대 시간입니다.",
          },
          {
            symbol: "T_{\\mathrm{elapsed}}",
            name: "소진한 시간",
            description:
              "인증·queue·이전 attempt를 포함해 현재까지 사용한 시간입니다.",
          },
          {
            symbol: "T_{\\mathrm{backoff}}",
            name: "재시도 대기",
            description:
              "jitter가 포함된 backoff로 동시에 몰리는 retry를 완화합니다.",
          },
          {
            symbol: "\\widehat T_{\\mathrm{attempt}}",
            name: "다음 시도 예산",
            description:
              "선택한 backend의 예상 connect·TTFT 또는 completion 시간입니다.",
          },
        ]}
        assumptions={[
          "이 부등식은 시간이 충분한지만 판단하며, 요청이 idempotent한지는 별도로 확인해야 합니다.",
          "Gateway와 provider SDK 중 한 계층만 retry owner가 되도록 설정합니다.",
        ]}
        interpretation="retry budget은 고정 횟수가 아니라 남은 end-to-end 시간과 실행 안전성을 함께 보는 정책입니다. 시간이 없으면 빠르게 실패시키거나 계약을 만족하는 fallback으로 전환하는 편이 낫습니다."
      />

      <ExplainedFormula
        question="평균 backend 시도 수가 늘면 실제 부하는 얼마나 증폭되는가?"
        idea={
          <>
            Client request 하나가 backend를 평균 몇 번 호출하는지 세면, 장애 중
            실제 arrival rate를 간단히 추정할 수 있습니다. 여러 계층이
            재시도하면 모든 계층의 시도 수가 이 기대값에 들어갑니다.
          </>
        }
        formula={String.raw`\lambda_{\mathrm{backend}}=\lambda_{\mathrm{client}}\,\mathbb E[A]`}
        terms={[
          {
            symbol: "\\lambda_{\\mathrm{client}}",
            name: "client arrival rate",
            description: "Gateway 경계에 들어오는 원래 요청률입니다.",
          },
          {
            symbol: "A",
            name: "attempt 수",
            description:
              "첫 시도를 포함해 client request 하나가 만든 backend 호출 횟수입니다.",
          },
          {
            symbol: "\\lambda_{\\mathrm{backend}}",
            name: "backend arrival rate",
            description:
              "Retry와 fallback 뒤에 runtime들이 실제로 받는 총 요청률입니다.",
          },
        ]}
        assumptions={[
          "장기 평균 또는 같은 관측 window의 rate를 비교합니다.",
          "Fan-out tool call처럼 본래 여러 호출을 만드는 workflow는 retry와 별도 dimension으로 기록합니다.",
        ]}
        interpretation="평균 시도가 1.4회면 backend는 client traffic보다 40% 많은 호출을 받습니다. 이 증폭을 보지 않고 queue threshold만 조정하면 retry storm이 capacity 부족처럼 보일 수 있습니다."
      />

      <RetryBoundaryViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Streaming과 tool side effect는 retry 경계를 바꾼다</h3>
        <p className="leading-8">
          연결 자체가 맺어지지 않았다는 사실이 확인되면 재시도하기 쉽지만,
          stream의 일부가 client에 전달됐거나 tool이 결제를 실행했을 가능성이
          있다면 같은 prompt를 다시 보내는 순간 중복 출력이나 중복 작업이
          생깁니다. 이 경우에는 idempotency key와 tool execution ledger로 완료
          여부를 먼저 확인하고, 확인할 수 없다면 자동 retry보다 불확실한 결과를
          명시적으로 반환해야 합니다.
        </p>
        <p className="leading-8">
          운영 로그에는 alias만 남기지 않고 실제 deployment, provider request
          ID, attempt 번호, fallback 이유, prompt/output token과 finish reason을
          같은 trace에 묶습니다. 그래야 비용 급증이 긴 output 때문인지, 반복
          시도 때문인지, 더 비싼 fallback 때문인지 재현할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
