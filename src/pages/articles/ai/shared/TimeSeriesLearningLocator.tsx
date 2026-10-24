import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "baseline",
    label: "기준선",
    track: "개념",
    detail: "예측 시점과 범위를 먼저 고정하고, 차분·관성·충격으로 해석 가능한 기준선을 만듭니다.",
    href: "/cs/ai/arima",
  },
  {
    id: "neural",
    label: "신경망 적용",
    track: "실무",
    detail: "같은 예측 계약을 윈도우·텐서·학습 절차로 옮기고 기준선보다 나은지 검증합니다.",
    href: "/cs/ai/lstm-timeseries",
  },
] as const;

type TimeSeriesStep = (typeof STEPS)[number]["id"];

const QUESTIONS: Record<TimeSeriesStep, string> = {
  baseline: "미래 값을 예측하기 전에 어떤 정보 시점과 반복 구조를 먼저 고정해야 합니까?",
  neural: "같은 예측 계약을 LSTM의 윈도우·텐서·학습 절차로 어떻게 옮겨야 합니까?",
};

const FINDINGS: Record<TimeSeriesStep, string> = {
  baseline:
    "ARIMA는 p·d·q만 고르는 기법이 아닙니다. 예측 시점·범위·사용 가능한 정보를 고정한 뒤 최소한의 차분으로 반복 구조를 드러내고, 미래 구간과 잔차에서 가정을 다시 확인하는 기준선입니다.",
  neural:
    "LSTM을 써도 예측 문제의 경계는 바뀌지 않습니다. 같은 시점·범위·특징으로 만든 윈도우에서 미래 정보 누출을 막고, ARIMA와 단순 기준선보다 실제로 나아지는 구간과 비용을 함께 확인해야 합니다.",
};

const NEXT: Record<TimeSeriesStep, TimeSeriesStep | null> = {
  baseline: "neural",
  neural: null,
};

export function TimeSeriesLearningLocator({ current }: { current: TimeSeriesStep }) {
  const currentStep = STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="시계열 예측을 기준선에서 신경망 적용으로 확장하는 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          시계열 예측 · {currentStep.label}
        </strong>
      </nav>

      <div className="relative mt-4 grid gap-x-5 gap-y-4 sm:grid-cols-2">
        <span
          aria-hidden
          className="absolute left-[calc(25%+0.25rem)] right-[calc(25%+0.25rem)] top-[0.875rem] hidden border-t border-dashed border-border sm:block"
        />
        {STEPS.map((step, index) => (
          <Link
            key={step.id}
            to={step.href}
            aria-current={step.id === current ? "step" : undefined}
            className={`relative grid min-w-0 grid-cols-[1.75rem_minmax(0,1fr)] gap-3 border-t-2 bg-background pt-3 sm:bg-transparent ${
              step.id === current
                ? "border-primary text-foreground"
                : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
            }`}
          >
            <span
              className={`z-10 flex size-7 items-center justify-center rounded-full border bg-background text-[10px] font-bold ${
                step.id === current
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border"
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
        ))}
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <p className="text-[9px] font-bold text-primary">이 글이 답할 질문</p>
        <p className="mt-1 break-keep text-sm font-bold leading-6">{QUESTIONS[current]}</p>
      </div>
    </aside>
  );
}

export function TimeSeriesLearningMapReturn({ current }: { current: TimeSeriesStep }) {
  const nextId = NEXT[current];
  const next = nextId ? STEPS.find((step) => step.id === nextId)! : null;

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 시계열 예측 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      <Link
        to={next?.href ?? "/cs/ai/generative-theory"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next ? `다음 확대 · ${next.label} →` : "다음 영역 · 생성 모델의 원리로 이동 →"}
      </Link>
    </aside>
  );
}
