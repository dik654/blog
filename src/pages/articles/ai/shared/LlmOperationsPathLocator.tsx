import { Link } from "react-router-dom";

const STEPS = [
  {
    key: "observability",
    label: "요청 관측",
    detail: "한 요청의 구간·토큰·오류를 같은 trace로 묶습니다.",
    href: "/cs/ai/llm-monitoring-observability-and-drift#problem",
  },
  {
    key: "caching",
    label: "응답 재사용",
    detail: "일치 조건과 수명을 통과한 결과만 다시 씁니다.",
    href: "/cs/ai/llm-application-caching#problem",
  },
  {
    key: "routing",
    label: "모델 선택",
    detail: "능력·부하·비용을 보고 호출 대상을 정합니다.",
    href: "/cs/ai/llm-gateway-and-model-routing#problem",
  },
  {
    key: "reliability",
    label: "과부하 보호",
    detail: "재시도·차단·제한·우회로 실패 전파를 막습니다.",
    href: "/cs/ai/rate-limiting-and-reliability-patterns#problem",
  },
] as const;

export type LlmOperationsPathArticle = (typeof STEPS)[number]["key"];

const QUESTIONS: Record<LlmOperationsPathArticle, string> = {
  observability:
    "느린 요청 하나를 어떤 구간과 신호로 나눠야 원인을 다시 찾을 수 있습니까?",
  caching:
    "어떤 조건이 같을 때만 이전 결과를 재사용하고, 언제 버려야 합니까?",
  routing:
    "하나의 API 요청을 어떤 모델·제공자에게 보낼지 어느 신호가 결정합니까?",
  reliability:
    "실패가 반복되거나 요청이 몰릴 때 어디에서 다시 보내고, 막고, 우회합니까?",
};

const FINDINGS: Record<LlmOperationsPathArticle, string> = {
  observability:
    "전체 지연 하나만 보지 않습니다. 같은 trace 안에서 retrieval·generation·tool 구간과 token·queue·GPU·error 신호를 연결해야 다음 조치의 책임자를 정할 수 있습니다.",
  caching:
    "캐시는 결과를 저장하는 한 상자가 아닙니다. exact·semantic·retrieval·embedding·tool 결과마다 key·hit 판정·TTL·무효화 조건이 다르며, hit 뒤에는 남은 호출을 건너뜁니다.",
  routing:
    "Gateway는 요청 형식을 통일하고 router는 후보를 고릅니다. Cascade는 품질 신호에, fallback은 실행 실패에 반응하므로 같은 전환처럼 보여도 상태 소유자가 다릅니다.",
  reliability:
    "Retry·circuit breaker·rate limit·load shedding·failover는 서로 다른 실패에 반응합니다. 하나의 장치로 묶지 말고 발동 조건·상태·우회 경로를 각각 기록해야 합니다.",
};

const INDEX: Record<LlmOperationsPathArticle, number> = {
  observability: 0,
  caching: 1,
  routing: 2,
  reliability: 3,
};

export function LlmOperationsPathLocator({
  current,
}: {
  current: LlmOperationsPathArticle;
}) {
  const step = STEPS[INDEX[current]];
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="LLM 요청 운영 경로에서 현재 글의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/llm-serving-ops" className="hover:text-primary">
          LLM 온라인 운영
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          {step.label}
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            개념
          </span>
          <p className="mt-3 break-keep text-base font-bold leading-7">
            {QUESTIONS[current]}
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">
            직속 부모 지도
          </p>
          <Link
            to="/cs/ai/llm-serving-ops#observability-aiops"
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            SLI에서 원인 신호와 보호 정책으로 내려가기 ↗
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4"
        aria-label="한 LLM 요청을 관측하고 재사용하고 라우팅하고 보호하는 네 단계"
      >
        {STEPS.map((item, index) => {
          const active = index <= INDEX[current];
          const currentStep = item.key === current;
          return (
            <Link
              key={item.key}
              to={item.href}
              aria-current={currentStep ? "step" : undefined}
              className={`min-w-0 bg-background px-3 py-3 ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <span className="font-mono text-[9px] font-black text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong className="mt-1 block break-keep text-xs leading-5">
                {item.label}
              </strong>
              <span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">
                {item.detail}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export function LlmOperationsPathMapReturn({
  current,
}: {
  current: LlmOperationsPathArticle;
}) {
  const index = INDEX[current];
  const next = STEPS[index + 1];
  return (
    <aside
      id="llm-operations-path-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 LLM 요청 운영 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        부모 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        {FINDINGS[current]}
      </p>
      <Link
        to={next?.href ?? "/cs/ai/prompt-engineering"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next
          ? `다음 단계 · ${next.label}으로 이동 →`
          : "다음 묶음 · 요청 계약과 프롬프트로 이동 →"}
      </Link>
    </aside>
  );
}
