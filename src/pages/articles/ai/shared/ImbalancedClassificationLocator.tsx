import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "prevalence",
    label: "기준 비율",
    track: "개념",
    detail: "운영 모집단의 양성 비율과 단순 정확도 기준선을 먼저 고정합니다.",
    href: "/cs/ai/imbalanced-data",
  },
  {
    id: "resampling",
    label: "표본 노출",
    track: "실무",
    detail:
      "검증 자료는 봉인하고 학습 폴드 안에서만 표본 노출 횟수를 바꿉니다.",
    href: "/cs/ai/imbalance-resampling",
  },
  {
    id: "loss",
    label: "학습 신호",
    track: "실무",
    detail:
      "표본 수를 바꾸지 않고 클래스와 난이도에 따라 손실 기여도를 조절합니다.",
    href: "/cs/ai/imbalance-loss-weighting",
  },
  {
    id: "threshold",
    label: "행동 기준",
    track: "실무",
    detail: "오류 비용과 처리 용량을 확률에 결합해 실제 조치 기준을 정합니다.",
    href: "/cs/ai/cost-sensitive-thresholding",
  },
  {
    id: "evaluation",
    label: "결과 해석",
    track: "개념",
    detail:
      "선택한 기준에서 발생한 수, 순위 품질, 확률 의미를 따로 평가합니다.",
    href: "/cs/ai/imbalanced-classification-evaluation",
  },
] as const;

export type ImbalancedClassificationStep = (typeof STEPS)[number]["id"];

const QUESTIONS: Record<ImbalancedClassificationStep, string> = {
  prevalence:
    "양성이 드문 모집단에서 높은 정확도가 왜 좋은 분류기를 뜻하지 않을 수 있습니까?",
  resampling:
    "학습 표본의 노출 비율만 바꾸면서 검증 자료의 실제 비율은 어떻게 지킵니까?",
  loss: "표본을 복제하지 않고 중요한 오류가 경사를 더 크게 움직이게 하려면 무엇을 바꿉니까?",
  threshold:
    "예측 확률을 비용과 처리 용량에 맞는 실제 알림으로 어떻게 바꿉니까?",
  evaluation:
    "같은 모델을 순위, 선택한 행동, 확률의 세 관점에서 어떻게 따로 평가합니까?",
};

const FINDINGS: Record<ImbalancedClassificationStep, string> = {
  prevalence:
    "불균형 문제의 출발점은 학습 자료의 비율이 아니라 실제 평가 모집단의 양성 비율입니다. 점수의 순위, 확률의 의미, 임계값 뒤의 행동을 분리해야 어느 층을 고칠지 알 수 있습니다.",
  resampling:
    "재표본화는 운영 모집단을 바꾸지 않습니다. 자료를 먼저 나눈 뒤 학습 폴드 안에서만 노출을 바꾸고, 합성점의 이웃·난수값·원본 계보를 남겨야 누출과 잘못된 기하를 추적할 수 있습니다.",
  loss: "클래스 가중치는 정답 클래스로 고정 배점을 주고, 초점 손실은 현재 예측 난이도로 배점을 바꿉니다. 둘 다 어려운 오표기까지 키울 수 있으므로 깨끗한 자료와 오류 구간을 따로 비교해야 합니다.",
  threshold:
    "임계값은 모델 파라미터가 아니라 운영 정책입니다. 보정된 확률, 거짓 양성·거짓 음성 비용, 하루 처리 용량을 같은 검증 구간에서 확인하고 되돌릴 기준까지 함께 보존해야 합니다.",
  evaluation:
    "평가 보고서는 하나의 AUC로 끝나지 않습니다. 같은 단위와 기간에서 혼동 행렬, 유병률에 민감한 정밀도·재현율, 확률 보정을 나란히 보여줘야 모델과 정책의 실패를 구분할 수 있습니다.",
};

export function ImbalancedClassificationLocator({
  current,
}: {
  current: ImbalancedClassificationStep;
}) {
  const currentStep = STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="불균형 분류 학습 경로에서 현재 글의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/imbalanced-data" className="hover:text-primary">
          불균형 분류
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          {currentStep.label}
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            {currentStep.track}
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
            to={
              current === "prevalence"
                ? "/cs/ai"
                : "/cs/ai/imbalanced-data#three-layers"
            }
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            {current === "prevalence"
              ? "인공지능 학습 지도에서 자료와 의사결정 찾기 ↗"
              : "기준 비율에서 점수·확률·행동으로 이어지는 지도 ↗"}
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5"
        aria-label="불균형 분류를 이해하고 적용하는 다섯 단계"
      >
        {STEPS.map((step, index) => (
          <Link
            key={step.id}
            to={step.href}
            aria-current={step.id === current ? "step" : undefined}
            className={`min-w-0 bg-background px-3 py-3 ${
              step.id === current
                ? "text-foreground"
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
        ))}
      </div>
    </aside>
  );
}

export function ImbalancedClassificationMapReturn({
  current,
}: {
  current: ImbalancedClassificationStep;
}) {
  const position = STEPS.findIndex((step) => step.id === current);
  const next = STEPS[position + 1];

  return (
    <aside
      id="imbalanced-classification-map-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 불균형 분류 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        부모 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        {FINDINGS[current]}
      </p>
      <Link
        to={next?.href ?? "/cs/ai/gradient-boosting"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next
          ? `다음 단계 · ${next.label} →`
          : "다음 묶음 · 표 형식 모델링으로 이동 →"}
      </Link>
    </aside>
  );
}
