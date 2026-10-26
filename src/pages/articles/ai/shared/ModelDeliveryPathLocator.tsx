import { Link } from "react-router-dom";

const STEPS = [
  {
    key: "tracking",
    label: "실행 근거",
    detail: "입력·실행·산출물이 어떻게 이어졌는지 남깁니다.",
    href: "/cs/ai/experiment-tracking#overview",
  },
  {
    key: "curve",
    label: "진행 비교",
    detail: "서로 다른 실행을 같은 처리량 좌표에서 비교합니다.",
    href: "/cs/ai/learning-curve-tracking#overview",
  },
  {
    key: "selection",
    label: "출시 선택",
    detail: "검증 기준을 통과한 정책 하나를 고정합니다.",
    href: "/cs/ai/metric-selection-protocol#overview",
  },
  {
    key: "registry",
    label: "등록·배포",
    detail: "선택한 모델 바이트와 실제 배포를 대조합니다.",
    href: "/cs/ai/model-artifact-registry#overview",
  },
  {
    key: "reproduction",
    label: "재현 검증",
    detail: "빈 환경에서 같은 실행 계약을 다시 검사합니다.",
    href: "/cs/ai/reproducible-ml-execution#overview",
  },
] as const;

export type ModelDeliveryStep = (typeof STEPS)[number]["key"];

const QUESTIONS: Record<ModelDeliveryStep, string> = {
  tracking: "결과 하나에서 그것을 만든 입력과 실행까지 되짚을 수 있습니까?",
  curve: "두 학습 실행을 같은 자원량에서 비교하고 있습니까?",
  selection: "어떤 후보를 어떤 사전 기준으로 출시하기로 정했습니까?",
  registry: "승인한 모델 바이트와 지금 요청을 처리하는 모델이 정말 같습니까?",
  reproduction: "숨은 로컬 상태 없이 같은 실행 계약을 다시 검증할 수 있습니까?",
};

const TRACKS: Record<ModelDeliveryStep, "개념" | "실무"> = {
  tracking: "개념",
  curve: "개념",
  selection: "실무",
  registry: "실무",
  reproduction: "실무",
};

export function ModelDeliveryPathLocator({
  current,
}: {
  current: ModelDeliveryStep;
}) {
  const currentStep = STEPS.find((step) => step.key === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="모델 실행 근거에서 배포와 재현까지 이어지는 경로"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/experiment-tracking#overview" className="hover:text-primary">
          모델 전달 경로
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          {currentStep.label}
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            {TRACKS[current]}
          </span>
          <p className="mt-3 break-keep text-base font-bold leading-7">
            {QUESTIONS[current]}
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모</p>
          <Link
            to="/cs/ai/experiment-tracking#provenance-receipt"
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            실험 추적 · 산출물 근거
          </Link>
          <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground">
            어떤 실행이 어떤 파일을 만들었는지 확인한 다음, 그 파일이 승인과 배포에서
            어떻게 고정되는지 추적합니다.
          </p>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5"
        aria-label="실행 근거부터 재현 검증까지 다섯 단계"
      >
        {STEPS.map((step, index) => {
          const isCurrent = step.key === current;
          return (
            <Link
              key={step.key}
              to={step.href}
              aria-current={isCurrent ? "step" : undefined}
              className={`min-w-0 bg-background px-3 py-3 last:col-span-2 sm:last:col-span-1 ${
                isCurrent
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <span className="font-mono text-[9px] font-black text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong className="mt-1 block break-keep text-xs leading-5">
                {step.label}
              </strong>
              <span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">
                {step.detail}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export function ModelArtifactRegistryLocator() {
  return <ModelDeliveryPathLocator current="registry" />;
}

export function ModelArtifactRegistryReturn() {
  return (
    <aside
      id="model-delivery-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="모델 레지스트리에서 확인한 사실을 모델 전달 경로에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        레지스트리는 별명 하나를 저장하는 목록이 아닙니다. 실행 기록의 모델 바이트를
        변경 불가능한 버전과 digest로 고정하고, 승인 기록·배포 명세·실행 중인 endpoint의
        증명을 같은 identity로 대조해야 모델 전달 경로가 이어집니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold">
        <Link
          to="/cs/ai/experiment-tracking#provenance-receipt"
          className="inline-flex min-h-11 items-center border-b border-border hover:border-primary hover:text-primary"
        >
          실험 추적의 산출물 근거에 반영하기 ↑
        </Link>
        <Link
          to="/cs/ai/reproducible-ml-execution#overview"
          className="inline-flex min-h-11 items-center border-b border-border hover:border-primary hover:text-primary"
        >
          다음 주제 · 빈 환경에서 다시 실행하기 →
        </Link>
      </div>
    </aside>
  );
}
