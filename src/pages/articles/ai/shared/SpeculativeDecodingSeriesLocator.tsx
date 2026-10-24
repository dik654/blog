import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "principle",
    label: "확정 원리",
    track: "개념",
    detail: "후보를 검증하고 첫 거부에서 멈춘 뒤 출력 분포와 KV 기록을 맞추는 과정을 추적합니다.",
    href: "/cs/ai/vllm-spec-decode",
  },
  {
    id: "variants",
    label: "후보 전략",
    track: "참고",
    detail: "작은 모델·앞쪽 층·MTP·문자열 검색과 한 줄·트리 후보의 비용 차이를 비교합니다.",
    href: "/cs/ai/speculative-decoding-variants",
  },
] as const;

type SpeculativeDecodingStep = (typeof STEPS)[number]["id"];

const FINDINGS: Record<SpeculativeDecodingStep, string> = {
  principle:
    "추측 디코딩은 작은 모델의 답을 대신 쓰지 않습니다. 값싼 후보를 큰 모델이 함께 검증하고, 첫 거부 전까지의 출력과 계산 기록만 확정합니다.",
  variants:
    "후보 방식은 출처와 모양이라는 두 축으로 비교합니다. 실제 이득은 이름이 아니라 후보 준비·검증·기록 정리의 전체 시간과 연속 수락 길이로 판단합니다.",
};

export function SpeculativeDecodingSeriesLocator({
  current,
}: {
  current: SpeculativeDecodingStep;
}) {
  const currentStep = STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="큰 모델의 순차 실행 횟수를 줄이는 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai/transformer-architecture" className="hover:text-primary">
          Transformer
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/inference-engine-design-axes" className="hover:text-primary">
          추론 실행
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          순차 실행 단축 · {currentStep.label}
        </strong>
      </nav>

      <div className="mt-4 grid gap-x-5 gap-y-4 sm:grid-cols-2">
        {STEPS.map((step, index) => {
          const active = step.id === current;
          return (
            <Link
              key={step.id}
              to={step.href}
              aria-current={active ? "step" : undefined}
              className={`grid min-w-0 grid-cols-[1.75rem_minmax(0,1fr)] gap-3 border-t-2 pt-3 ${
                active
                  ? "border-primary text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
              }`}
            >
              <span
                className={`flex size-7 items-center justify-center rounded-full border text-[10px] font-bold ${
                  active ? "border-primary bg-primary text-primary-foreground" : "border-border"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <strong className="break-keep text-sm leading-5">{step.label}</strong>
                  <span className="text-[9px] font-bold text-primary">{step.track}</span>
                </span>
                <span className="mt-1 block break-keep text-[11px] leading-5">{step.detail}</span>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 border-t border-border pt-3 sm:grid-cols-[minmax(0,1fr)_17rem] sm:items-start">
        <div>
          <p className="text-[9px] font-bold text-primary">이 글이 확인할 질문</p>
          <p className="mt-1 break-keep text-sm font-bold leading-6">{FINDINGS[current]}</p>
        </div>
        <div className="border-l-2 border-primary/40 pl-3 text-[11px] leading-5 text-muted-foreground">
          <strong className="block text-foreground">원리와 선택을 분리해 읽습니다</strong>
          첫 글은 정확한 확정 규칙을 설명합니다. 둘째 글은 그 규칙을 유지한 채 후보를 만드는 방법을 비교합니다.
        </div>
      </div>
    </aside>
  );
}

export function SpeculativeDecodingMapReturn({
  current,
}: {
  current: SpeculativeDecodingStep;
}) {
  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 추측 디코딩 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      <Link
        to={current === "principle" ? STEPS[1].href : "/cs/ai/multi-adapter-serving"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {current === "principle" ? "다음 확대 · 후보 전략 →" : "다음 주제 · 여러 adapter를 함께 서빙하는 방법 →"}
      </Link>
    </aside>
  );
}
