import { Link } from "react-router-dom";

const STEPS = [
  {
    label: "시계 고정",
    detail: "micro-batch가 아니라 실제 optimizer update를 셉니다.",
    href: "/cs/ai/lr-scheduling#update-clock",
  },
  {
    label: "감소 조건",
    detail: "고정 시계와 validation event를 서로 다른 입력으로 봅니다.",
    href: "/cs/ai/lr-decay-policies#metric-trigger",
  },
  {
    label: "주기 곡선",
    detail: "진행률을 cosine 값으로 바꾸고 restart state를 나눕니다.",
    href: "/cs/ai/cosine-restart-scheduling#cosine-progress",
  },
  {
    label: "진단 후 실행",
    detail: "range test로 후보를 만든 뒤 one-cycle budget을 실행합니다.",
    href: "/cs/ai/one-cycle-scheduling#range-test",
  },
  {
    label: "경계 결합",
    detail: "warmup과 본 schedule의 길이·값·cursor를 맞춥니다.",
    href: "/cs/ai/warmup-scheduling#composition",
  },
] as const;

export type LearningRateFamilyArticle =
  "clock" | "decay" | "cosine" | "one-cycle" | "warmup";

const QUESTIONS: Record<LearningRateFamilyArticle, string> = {
  clock:
    "batch 구성이 바뀌거나 학습을 재개해도 같은 update에서 같은 learning rate를 만들려면 무엇을 세고 저장해야 합니까?",
  decay:
    "learning rate를 낮추는 시점을 update로 미리 정할지, validation 결과로 판단할지 어떻게 구분합니까?",
  cosine:
    "cycle 안의 진행률을 learning rate로 어떻게 바꾸고, warm restart에서 무엇을 되돌리고 무엇을 보존합니까?",
  "one-cycle":
    "불안정해지는 학습률을 짧게 진단한 뒤 실제 run의 상승·하강 구간을 어떻게 고정합니까?",
  warmup:
    "처음 W updates와 본 schedule을 이어 붙일 때 전체 길이·local cursor·경계값을 어떻게 맞춥니까?",
};

const FINDINGS: Record<LearningRateFamilyArticle, string> = {
  clock:
    "Scheduler의 시간은 epoch 이름이 아니라 parameter가 실제로 바뀐 optimizer update입니다. 같은 궤적을 복원하려면 global update·total budget·scheduler state·parameter-group LR·호출 순서를 함께 저장해야 합니다.",
  decay:
    "Step·exponential decay는 update clock이 값을 정하지만 plateau decay는 validation event와 best·bad-count·cooldown을 읽습니다. 같은 metric을 early stopping도 읽는다면 두 state machine의 실행 순서를 먼저 정해야 합니다.",
  cosine:
    "Cosine은 cycle-local progress를 peak와 minimum 사이의 값으로 바꿉니다. Warm restart는 cycle cursor와 LR phase만 되돌리고 model parameter와 optimizer memory는 이어갑니다.",
  "one-cycle":
    "Range test는 불안정 경계를 찾는 별도 진단이고 OneCycle은 선택한 후보를 실제 update budget에 배치하는 실행 정책입니다. 진단 state는 버리고 rollback 조건은 실행 기록에 남깁니다.",
  warmup:
    "Warmup은 전체 budget의 앞 W updates를 사용합니다. 본 schedule은 global t=W에서 local k=0으로 시작하고 길이는 T−W이며, 두 구간의 경계값도 같아야 합니다.",
};

const META: Record<
  LearningRateFamilyArticle,
  {
    label: string;
    track: "개념" | "실무";
    parentHref: string;
    parentLabel: string;
  }
> = {
  clock: {
    label: "업데이트 시계",
    track: "개념",
    parentHref: "/cs/ai/training-pipeline#loop",
    parentLabel: "optimizer update를 실제 학습 시계로 사용하기 ↗",
  },
  decay: {
    label: "감소 정책",
    track: "실무",
    parentHref: "/cs/ai/lr-scheduling#schedule-function",
    parentLabel: "update와 state에서 현재 LR를 계산하기 ↗",
  },
  cosine: {
    label: "Cosine 주기",
    track: "개념",
    parentHref: "/cs/ai/lr-decay-policies#open-loop",
    parentLabel: "고정 시계 감소를 연속 곡선으로 바꾸기 ↗",
  },
  "one-cycle": {
    label: "OneCycle",
    track: "실무",
    parentHref: "/cs/ai/lr-scheduling#update-clock",
    parentLabel: "total update budget을 먼저 고정하기 ↗",
  },
  warmup: {
    label: "Warmup 결합",
    track: "개념",
    parentHref: "/cs/ai/lr-scheduling#schedule-function",
    parentLabel: "여러 schedule 함수를 하나의 실행으로 결합하기 ↗",
  },
};

export function LearningRateFamilyLocator({
  current,
}: {
  current: LearningRateFamilyArticle;
}) {
  const meta = META[current];
  const currentIndex: Record<LearningRateFamilyArticle, number> = {
    clock: 0,
    decay: 1,
    cosine: 2,
    "one-cycle": 3,
    warmup: 4,
  };

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="학습률 제어 경로에서 현재 글의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/lr-scheduling" className="hover:text-primary">
          학습률 제어
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
        aria-label="업데이트 시계에서 종료 순서까지 이어지는 다섯 단계"
      >
        {STEPS.map((step, index) => {
          const active = index <= currentIndex[current];
          const currentStep = index === currentIndex[current];
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

export function LearningRateFamilyMapReturn({
  current,
}: {
  current: LearningRateFamilyArticle;
}) {
  const next =
    current === "clock"
      ? {
          href: "/cs/ai/lr-decay-policies",
          label: "다음 단계 · LR를 낮추는 두 입력을 비교하기 →",
        }
      : current === "decay"
        ? {
            href: "/cs/ai/cosine-restart-scheduling",
            label: "다음 단계 · 연속 곡선과 restart state로 이동 →",
          }
        : current === "cosine"
          ? {
              href: "/cs/ai/one-cycle-scheduling",
              label: "다음 단계 · 진단한 maximum을 실행 budget에 넣기 →",
            }
          : current === "one-cycle"
            ? {
                href: "/cs/ai/warmup-scheduling",
                label: "다음 단계 · warmup과 본 schedule의 경계 맞추기 →",
              }
            : {
                href: "/cs/ai/regularization-practice",
                label: "다음 묶음 · schedule 밖의 regularization으로 이동 →",
              };

  return (
    <aside
      id="learning-rate-family-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 학습률 제어 지도에 되돌려 놓기"
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
