import { Link } from "react-router-dom";

const STEPS = [
  {
    label: "시계 고정",
    detail: "micro-batch가 아니라 실제 optimizer update를 셉니다.",
    href: "/cs/ai/lr-scheduling#update-clock",
  },
  {
    label: "값 계산",
    detail: "update와 scheduler state에서 현재 learning rate를 구합니다.",
    href: "/cs/ai/lr-scheduling#schedule-function",
  },
  {
    label: "감소 조건",
    detail: "고정 시계와 validation event를 서로 다른 입력으로 봅니다.",
    href: "/cs/ai/lr-decay-policies#metric-trigger",
  },
  {
    label: "궤적 복원",
    detail: "cursor·state·호출 순서를 되살려 같은 다음 값을 만듭니다.",
    href: "/cs/ai/lr-scheduling#resume-boundary",
  },
  {
    label: "종료 순서",
    detail: "LR 감소와 조기 종료 중 어느 판단을 먼저 할지 정합니다.",
    href: "/cs/ai/lr-decay-policies#selection-boundary",
  },
] as const;

export type LearningRateFamilyArticle = "clock" | "decay";

const QUESTIONS: Record<LearningRateFamilyArticle, string> = {
  clock:
    "batch 구성이 바뀌거나 학습을 재개해도 같은 update에서 같은 learning rate를 만들려면 무엇을 세고 저장해야 합니까?",
  decay:
    "learning rate를 낮추는 시점을 update로 미리 정할지, validation 결과로 판단할지 어떻게 구분합니까?",
};

const FINDINGS: Record<LearningRateFamilyArticle, string> = {
  clock:
    "Scheduler의 시간은 epoch 이름이 아니라 parameter가 실제로 바뀐 optimizer update입니다. 같은 궤적을 복원하려면 global update·total budget·scheduler state·parameter-group LR·호출 순서를 함께 저장해야 합니다.",
  decay:
    "Step·exponential decay는 update clock이 값을 정하지만 plateau decay는 validation event와 best·bad-count·cooldown을 읽습니다. 같은 metric을 early stopping도 읽는다면 두 state machine의 실행 순서를 먼저 정해야 합니다.",
};

export function LearningRateFamilyLocator({
  current,
}: {
  current: LearningRateFamilyArticle;
}) {
  const isClock = current === "clock";

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
          {isClock ? "업데이트 시계" : "감소 정책"}
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            {isClock ? "개념" : "실무"}
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
              isClock
                ? "/cs/ai/training-pipeline#loop"
                : "/cs/ai/lr-scheduling#schedule-function"
            }
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            {isClock
              ? "optimizer update를 실제 학습 시계로 사용하기 ↗"
              : "update와 state에서 현재 LR를 계산하기 ↗"}
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5"
        aria-label="업데이트 시계에서 종료 순서까지 이어지는 다섯 단계"
      >
        {STEPS.map((step, index) => {
          const active = isClock ? index <= 1 || index === 3 : index >= 2;
          const currentStep = isClock ? index === 0 : index === 2;
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
      : {
          href: "/cs/ai/cosine-restart-scheduling",
          label: "다음 단계 · 연속 곡선과 restart state로 이동 →",
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
