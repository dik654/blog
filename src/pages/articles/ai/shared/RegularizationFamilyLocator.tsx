import { Link } from "react-router-dom";

const STEPS = [
  {
    label: "원인 진단",
    detail: "두 오차의 차이를 재고 leakage·noise·shift를 먼저 배제합니다.",
    href: "/cs/ai/regularization-practice#audit",
  },
  {
    label: "경로 무작위화",
    detail: "Dropout mask가 activation의 평균과 분산을 어떻게 바꾸는지 봅니다.",
    href: "/cs/ai/dropout-regularization#mask",
  },
  {
    label: "가중치 축소",
    detail: "Task gradient와 parameter shrink 경로를 분리합니다.",
    href: "/cs/ai/weight-decay#sgd-equivalence",
  },
  {
    label: "궤적 선택",
    detail: "Validation event에서 멈출 시점과 반환할 checkpoint를 고릅니다.",
    href: "/cs/ai/early-stopping#state-machine",
  },
  {
    label: "정답 재분배",
    detail: "One-hot 질량 일부를 다른 class로 옮겨 loss target을 바꿉니다.",
    href: "/cs/ai/label-smoothing#target",
  },
] as const;

export type RegularizationFamilyArticle =
  | "diagnosis"
  | "dropout"
  | "weight-decay"
  | "early-stopping"
  | "label-smoothing";

const QUESTIONS: Record<RegularizationFamilyArticle, string> = {
  diagnosis:
    "Train–validation gap이 커졌을 때 바로 regularizer를 추가하지 않고 어떤 원인부터 배제해야 합니까?",
  dropout:
    "Activation 일부를 무작위로 끄면서 train과 eval의 평균 크기를 어떻게 맞춥니까?",
  "weight-decay":
    "Task gradient와 parameter 축소는 SGD와 AdamW에서 어디에서 만나고 무엇을 따로 기록해야 합니까?",
  "early-stopping":
    "Validation 궤적에서 언제 멈추고 어느 checkpoint를 반환할지 어떤 상태로 결정합니까?",
  "label-smoothing":
    "One-hot 정답의 probability mass를 어떻게 다시 나누고 다른 soft target과 어떻게 결합합니까?",
};

const FINDINGS: Record<RegularizationFamilyArticle, string> = {
  diagnosis:
    "관측 gap은 원인의 증명이 아닙니다. 같은 checkpoint·loss·전처리로 두 split을 잰 뒤 leakage·pipeline mismatch·label noise·distribution shift를 배제하고, 그 뒤 한 regularization 축만 바꿉니다.",
  dropout:
    "Dropout은 train forward에서 Bernoulli mask와 1/q scaling으로 평균을 맞추고 분산을 추가합니다. 일반 eval은 mask를 끄며, 평균 보존이 nonlinear network 출력 보존을 뜻하지는 않습니다.",
  "weight-decay":
    "Plain SGD에서는 L2 gradient와 direct shrink를 같은 식으로 정리할 수 있지만 AdamW에서는 task direction의 adaptive preconditioning과 weight shrink를 분리합니다. 모든 trainable parameter가 정확히 한 group에 속해야 합니다.",
  "early-stopping":
    "Early stopping은 validation event마다 best·bad counter를 갱신하는 상태 기계입니다. Stop 시점과 반환 artifact는 다를 수 있으며 model뿐 아니라 optimizer·scheduler·selection receipt도 함께 보존합니다.",
  "label-smoothing":
    "Uniform label smoothing은 one-hot 질량의 ε를 K개 class에 다시 나눕니다. Mixup·distillation과 함께 쓰면 기법 이름이 아니라 적용 순서 뒤의 최종 target distribution을 계산해야 합니다.",
};

const META: Record<
  RegularizationFamilyArticle,
  {
    label: string;
    track: "개념" | "실무";
    parentHref: string;
    parentLabel: string;
  }
> = {
  diagnosis: {
    label: "일반화 진단",
    track: "실무",
    parentHref: "/cs/ai/train-validation-test#generalization",
    parentLabel: "Train·validation 점수 차이를 진단 신호로 읽기 ↗",
  },
  dropout: {
    label: "Dropout",
    track: "개념",
    parentHref: "/cs/ai/regularization-practice#ablation",
    parentLabel: "원인 감사 뒤 한 regularization 축만 바꾸기 ↗",
  },
  "weight-decay": {
    label: "Weight decay",
    track: "개념",
    parentHref: "/cs/ai/regularization-practice#ablation",
    parentLabel: "같은 실행 조건에서 parameter 제약 비교하기 ↗",
  },
  "early-stopping": {
    label: "Early stopping",
    track: "실무",
    parentHref: "/cs/ai/lr-decay-policies#event-order",
    parentLabel: "같은 validation metric을 읽는 상태 기계의 순서 정하기 ↗",
  },
  "label-smoothing": {
    label: "Label smoothing",
    track: "개념",
    parentHref: "/cs/ai/regularization-practice#ablation",
    parentLabel: "Target을 바꾸는 regularization 축 비교하기 ↗",
  },
};

const INDEX: Record<RegularizationFamilyArticle, number> = {
  diagnosis: 0,
  dropout: 1,
  "weight-decay": 2,
  "early-stopping": 3,
  "label-smoothing": 4,
};

export function RegularizationFamilyLocator({
  current,
}: {
  current: RegularizationFamilyArticle;
}) {
  const meta = META[current];
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="일반화 진단과 정규화 경로에서 현재 글의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/regularization-practice" className="hover:text-primary">
          일반화와 정규화
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          {meta.label}
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            {meta.track}
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
            to={meta.parentHref}
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            {meta.parentLabel}
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5"
        aria-label="일반화 문제를 진단하고 네 가지 개입을 구분하는 다섯 단계"
      >
        {STEPS.map((step, index) => {
          const active = index <= INDEX[current];
          const currentStep = index === INDEX[current];
          return (
            <Link
              key={step.label}
              to={step.href}
              aria-current={currentStep ? "step" : undefined}
              className={`min-w-0 bg-background px-3 py-3 last:col-span-2 sm:last:col-span-1 ${
                active
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
          );
        })}
      </div>
    </aside>
  );
}

export function RegularizationFamilyMapReturn({
  current,
}: {
  current: RegularizationFamilyArticle;
}) {
  const next =
    current === "diagnosis"
      ? {
          href: "/cs/ai/dropout-regularization",
          label: "다음 단계 · activation 경로를 무작위화하는 계산 보기 →",
        }
      : current === "dropout"
        ? {
            href: "/cs/ai/weight-decay",
            label: "다음 단계 · parameter를 직접 줄이는 update 보기 →",
          }
        : current === "weight-decay"
          ? {
              href: "/cs/ai/early-stopping",
              label: "다음 단계 · validation 궤적에서 checkpoint 고르기 →",
            }
          : current === "early-stopping"
            ? {
                href: "/cs/ai/label-smoothing",
                label: "다음 단계 · 정답 probability mass 다시 나누기 →",
              }
            : {
                href: "/cs/ai/data-augmentation",
                label: "다음 묶음 · 입력을 바꾸는 data augmentation으로 이동 →",
              };

  return (
    <aside
      id="regularization-family-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 일반화와 정규화 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        부모 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        {FINDINGS[current]}
      </p>
      <Link
        to={next.href}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next.label}
      </Link>
    </aside>
  );
}
