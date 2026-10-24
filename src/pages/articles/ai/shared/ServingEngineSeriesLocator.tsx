import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "lifecycle",
    label: "요청",
    detail: "문장을 받아 실행 상태로 만들고 출력 조각을 돌려줍니다.",
    href: "/cs/ai/vllm-serving",
  },
  {
    id: "latency",
    label: "측정",
    detail: "첫 출력과 이후 간격을 분리해 서비스 약속과 비교합니다.",
    href: "/cs/ai/serving-latency-metrics-and-slo",
  },
  {
    id: "scheduler",
    label: "선택",
    detail: "이번 실행에 넣을 요청과 처리량을 예산 안에서 고릅니다.",
    href: "/cs/ai/vllm-scheduler",
  },
  {
    id: "batching",
    label: "묶음",
    detail: "실행이 끝날 때마다 완료·진행·신규 요청을 다시 섞습니다.",
    href: "/cs/ai/continuous-batching-step-anatomy",
  },
  {
    id: "phases",
    label: "단계",
    detail: "입력을 읽는 일과 답을 이어 쓰는 일이 서로 간섭합니다.",
    href: "/cs/ai/prefill-decode-phase-dynamics",
  },
  {
    id: "allocation",
    label: "기록",
    detail: "길이가 다른 KV 기록을 고정 크기 block으로 배정합니다.",
    href: "/cs/ai/vllm-paged-attention",
  },
  {
    id: "admission",
    label: "수용",
    detail: "공간이 모자라면 새 요청을 기다리게 하거나 기존 요청을 뺍니다.",
    href: "/cs/ai/serving-memory-admission-and-preemption",
  },
  {
    id: "reuse",
    label: "재사용",
    detail: "앞부분이 같은 요청은 이미 계산한 KV block을 함께 씁니다.",
    href: "/cs/ai/prefix-caching-radix-attention",
  },
] as const;

type ServingEngineStep = (typeof STEPS)[number]["id"];

const FINDINGS: Record<ServingEngineStep, string> = {
  lifecycle:
    "추론 엔진은 한 요청을 끝까지 붙들지 않습니다. 매 실행 경계에서 진행 상태와 예산을 확인하고 다음 묶음을 다시 만듭니다.",
  latency:
    "첫 출력까지의 기다림과 출력 사이의 멈춤은 원인이 다릅니다. 같은 요청의 시각을 남기고 TTFT·ITL·E2E를 따로 계산해야 합니다.",
  scheduler:
    "Scheduler는 순서만 정하지 않습니다. 남은 token 수, 요청 수, KV 공간을 함께 확인해 이번 실행의 실제 배정량을 만듭니다.",
  batching:
    "Continuous batching은 실행 한 번이 끝날 때마다 완료한 자리를 비우고, 진행 중인 요청과 새 요청으로 다음 실행 묶음을 다시 구성합니다.",
  phases:
    "Prefill은 많은 위치를 한꺼번에 읽고 decode는 요청마다 다음 위치를 이어 씁니다. 두 일을 같은 실행에 넣는 크기가 지연과 처리량을 바꿉니다.",
  allocation:
    "PagedAttention은 KV의 의미가 아니라 배치 방식을 바꿉니다. 요청의 논리 위치를 고정 크기 물리 block 표에 연결합니다.",
  admission:
    "계산 예산이 남아도 KV 공간이 없으면 요청을 실행할 수 없습니다. 수용·선점·재계산은 메모리 상태 전이로 판단합니다.",
  reuse:
    "Prefix cache는 모든 과거 계산을 공유하지 않습니다. 모델·토큰·위치 조건이 같은 완성된 앞부분 block만 찾아 다시 씁니다.",
};

export function ServingEngineSeriesLocator({
  current,
}: {
  current: ServingEngineStep;
}) {
  const currentIndex = STEPS.findIndex((step) => step.id === current);
  const currentStep = STEPS[currentIndex];

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="LLM 요청이 추론 엔진을 통과하는 여덟 결정의 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai/transformer-architecture" className="hover:text-primary">
          Transformer
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/kv-cache-fundamentals" className="hover:text-primary">
          요청별 상태
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          추론 엔진 · {currentStep.label}
        </strong>
      </nav>

      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4" aria-label="추론 엔진의 여덟 결정">
        {STEPS.map((step, index) => {
          const active = step.id === current;
          return (
            <Link
              key={step.id}
              to={step.href}
              aria-current={active ? "step" : undefined}
              className={`relative min-w-0 border-t-2 px-1 pt-3 ${
                active
                  ? "border-primary text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
              }`}
            >
              <span className="text-[9px] font-bold">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-xs leading-5">{step.label}</strong>
              <span className="mt-1 block text-[10px] leading-4">{step.detail}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 border-t border-border pt-3 sm:grid-cols-[minmax(0,1fr)_17rem] sm:items-start">
        <div>
          <p className="text-[9px] font-bold text-primary">이 글이 확인할 결정</p>
          <p className="mt-1 break-keep text-sm font-bold leading-6">{FINDINGS[current]}</p>
        </div>
        <div className="border-l-2 border-primary/40 pl-3 text-[11px] leading-5 text-muted-foreground">
          <strong className="block text-foreground">한 요청, 여덟 번의 판단</strong>
          API가 한 번 호출되어도 측정·실행 선택·KV 배정·재사용은 서로 다른 상태를 보고 결정합니다.
        </div>
      </div>
    </aside>
  );
}

export function ServingEngineMapReturn({
  current,
}: {
  current: ServingEngineStep;
}) {
  const currentIndex = STEPS.findIndex((step) => step.id === current);
  const next = STEPS[currentIndex + 1];

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 추론 엔진 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      {next ? (
        <Link
          to={next.href}
          className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          다음 결정 · {next.label} →
        </Link>
      ) : (
        <Link
          to="/cs/ai/inference-engine-design-axes"
          className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          추론 엔진 비교 지도로 돌아가기 →
        </Link>
      )}
    </aside>
  );
}
