import { Link } from "react-router-dom";

const STEPS = [
  {
    label: "입력 고정",
    detail: "snapshot·split·sample ID와 transform을 고정합니다.",
    href: "/cs/ai/training-pipeline#dataset",
  },
  {
    label: "상태 갱신",
    detail: "batch가 gradient와 optimizer update로 바뀌는 시계를 셉니다.",
    href: "/cs/ai/training-pipeline#loop",
  },
  {
    label: "중단 복원",
    detail: "model뿐 아니라 optimizer·RNG·sampler까지 되살립니다.",
    href: "/cs/ai/training-pipeline#checkpoint",
  },
  {
    label: "범위 선택",
    detail: "head·upper blocks·전체 model 중 바꿀 범위를 고릅니다.",
    href: "/cs/ai/transfer-learning-practice#freezing",
  },
  {
    label: "전이 판정",
    detail: "target 이득과 source 회귀를 함께 보고 배포를 결정합니다.",
    href: "/cs/ai/transfer-learning-practice#domain-shift",
  },
] as const;

export type TrainingRunFamilyArticle = "pipeline" | "transfer";

const QUESTIONS: Record<TrainingRunFamilyArticle, string> = {
  pipeline:
    "같은 data와 code로 학습을 다시 시작했을 때, 어느 sample과 update에서 멈췄는지 되살려 같은 결과를 설명할 수 있습니까?",
  transfer:
    "이미 학습된 model을 새 data에 옮길 때, 어느 parameter까지 바꿔야 이득은 얻고 기존 능력의 손상은 막을 수 있습니까?",
};

const FINDINGS: Record<TrainingRunFamilyArticle, string> = {
  pipeline:
    "학습 run의 상태는 model weight만이 아닙니다. data 순서, optimizer와 scheduler, RNG와 sampler 위치, metric 분자·분모까지 같은 update clock에 묶여야 중단 없는 실행과 복원 실행을 비교할 수 있습니다.",
  transfer:
    "전이 학습은 pretrained weight를 불러오는 한 동작이 아니라 trainable scope를 넓혀 가는 비교 실험입니다. 같은 split과 budget에서 target 이득, seed 흔들림, 비용, source 회귀를 함께 통과한 가장 작은 범위를 선택합니다.",
};

export function TrainingRunFamilyLocator({
  current,
}: {
  current: TrainingRunFamilyArticle;
}) {
  const isPipeline = current === "pipeline";

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="학습 실행 경로에서 현재 글의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/training-pipeline" className="hover:text-primary">
          학습 실행
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          {isPipeline ? "학습 파이프라인" : "전이 학습"}
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            {isPipeline ? "개념" : "실무"}
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
              isPipeline
                ? "/cs/ai/sequence-modeling-tabular#aggregation"
                : "/cs/ai/training-pipeline#checkpoint"
            }
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            {isPipeline
              ? "입력 표현을 실제 학습 run으로 연결하기 ↗"
              : "재현 가능한 run에서 pretrained state 넘겨받기 ↗"}
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5"
        aria-label="입력에서 전이 판정까지 이어지는 다섯 단계"
      >
        {STEPS.map((step, index) => {
          const active = isPipeline ? index <= 2 : index >= 3;
          return (
            <Link
              key={step.label}
              to={step.href}
              aria-current={
                (isPipeline && index === 0) || (!isPipeline && index === 3)
                  ? "step"
                  : undefined
              }
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

export function TrainingRunFamilyMapReturn({
  current,
}: {
  current: TrainingRunFamilyArticle;
}) {
  const next =
    current === "pipeline"
      ? {
          href: "/cs/ai/transfer-learning-practice",
          label: "다음 단계 · pretrained state를 새 data에 옮기기 →",
        }
      : {
          href: "/cs/ai/lr-scheduling",
          label:
            "다음 묶음 · update마다 learning rate를 바꾸는 규칙으로 이동 →",
        };

  return (
    <aside
      id="training-run-family-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 학습 실행 지도에 되돌려 놓기"
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
