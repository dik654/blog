import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "handoff",
    label: "상태 인계",
    track: "개념",
    detail: "입력 처리와 생성을 나눌 때 KV 기록·완료 신호·요청 경로가 어떻게 이어지는지 봅니다.",
    href: "/cs/ai/disaggregated-prefill-decode-serving",
  },
  {
    id: "scope",
    label: "개선 위치",
    track: "개념",
    detail: "모델·커널·런타임·시스템 중 바뀐 곳과 전체 응답에서 실제로 줄어든 시간을 구분합니다.",
    href: "/cs/ai/inference-optimization-layers",
  },
  {
    id: "measure",
    label: "동일 조건 측정",
    track: "실무",
    detail: "입력 분포·도착률·준비 상태·측정 구간을 고정하고 SLO를 지키는 처리 한계를 찾습니다.",
    href: "/cs/ai/serving-benchmark-methodology",
  },
  {
    id: "capacity",
    label: "용량 결정",
    track: "실무",
    detail: "측정한 처리량을 복사본 수·여유 용량·월 비용으로 바꾸고 배치 제약까지 확인합니다.",
    href: "/cs/ai/inference-cost-and-capacity-planning",
  },
] as const;

type ServingDecisionStep = (typeof STEPS)[number]["id"];

const QUESTIONS: Record<ServingDecisionStep, string> = {
  handoff: "입력 처리와 생성을 다른 GPU 풀에 맡기면 어떤 상태를 언제까지 보관하고 넘겨야 합니까?",
  scope: "한 부분이 빨라졌을 때 사용자 응답과 처리 용량, 실제 비용은 각각 얼마나 달라집니까?",
  measure: "서로 다른 구성을 같은 조건에서 비교하려면 어떤 부하와 시간 구간을 고정해야 합니까?",
  capacity: "SLO를 지키며 측정한 처리량을 실제 GPU 수와 여유 용량, 비용으로 어떻게 바꿉니까?",
};

const FINDINGS: Record<ServingDecisionStep, string> = {
  handoff:
    "단계를 나누면 KV 기록만 옮기는 것으로 끝나지 않습니다. 목적지 공간, 전송 완료, 원본 보관 기한과 사용자에게 보낼 출력의 주인을 한 요청 안에서 함께 추적해야 합니다.",
  scope:
    "한 부분의 가속 배수는 전체 응답·처리량·비용의 배수가 아닙니다. 변경된 구간과 새 비용, 겹쳐 실행된 일을 같은 시간표와 단위에 놓아야 합니다.",
  measure:
    "비교 가능한 처리 한계는 모델 이름만으로 정해지지 않습니다. 입력·출력 분포, 도착률, 준비 상태와 정상 구간을 고정하고 반복 실행의 흔들림까지 기록해야 합니다.",
  capacity:
    "GPU 수는 SLO 아래에서 측정한 복사본당 처리량을 기준으로 올림합니다. 장애·준비 시간의 여유와 정수 배치 제약을 더한 뒤에야 실제 청구와 연결할 수 있습니다.",
};

const NEXT: Record<ServingDecisionStep, ServingDecisionStep | null> = {
  handoff: "scope",
  scope: "measure",
  measure: "capacity",
  capacity: null,
};

export function ServingDecisionSeriesLocator({ current }: { current: ServingDecisionStep }) {
  const currentStep = STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="분산 추론을 측정과 용량 결정으로 연결하는 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai/vllm-serving" className="hover:text-primary">모델 서빙</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/parallelism-strategy-and-placement" className="hover:text-primary">여러 GPU 실행</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">서빙 판단 · {currentStep.label}</strong>
      </nav>

      <div className="mt-4 grid gap-x-3 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((step, index) => (
          <Link
            key={step.id}
            to={step.href}
            aria-current={step.id === current ? "step" : undefined}
            className={`grid min-w-0 grid-cols-[1.75rem_minmax(0,1fr)] gap-3 border-t-2 pt-3 ${step.id === current ? "border-primary text-foreground" : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"}`}
          >
            <span className={`flex size-7 items-center justify-center rounded-full border text-[10px] font-bold ${step.id === current ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
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

export function ServingDecisionMapReturn({ current }: { current: ServingDecisionStep }) {
  const nextId = NEXT[current];
  const next = nextId ? STEPS.find((step) => step.id === nextId)! : null;

  return (
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 서빙 판단 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      <Link to={next?.href ?? "/cs/ai/sionic-glm-b300"} className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">
        {next ? `다음 확대 · ${next.label} →` : "다음 주제 · 측정값을 실제 장비 구성에 적용하기 →"}
      </Link>
    </aside>
  );
}
