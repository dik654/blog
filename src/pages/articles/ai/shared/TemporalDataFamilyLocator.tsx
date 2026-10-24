import { Link } from "react-router-dom";

const STEPS = [
  {
    label: "질문 경계",
    detail: "entity·cutoff·horizon으로 예측 한 건을 고정합니다.",
    href: "/cs/ai/time-features#overview",
  },
  {
    label: "과거 선택",
    detail: "cutoff까지 도착한 같은 entity의 기록만 고릅니다.",
    href: "/cs/ai/time-features#lag",
  },
  {
    label: "구간 요약",
    detail: "lag·window·주기 좌표로 고정 길이 표를 만듭니다.",
    href: "/cs/ai/time-features#rolling",
  },
  {
    label: "순서 보존",
    detail: "사건의 종류·순번·간격을 token sequence로 남깁니다.",
    href: "/cs/ai/sequence-modeling-tabular#encoding",
  },
  {
    label: "표현 선택",
    detail: "flat 기준선과 sequence model을 같은 조건에서 비교합니다.",
    href: "/cs/ai/sequence-modeling-tabular#aggregation",
  },
] as const;

export type TemporalDataFamilyArticle = "features" | "sequence";

const QUESTIONS: Record<TemporalDataFamilyArticle, string> = {
  features:
    "8월 1일 자정에 다음 7일 매출을 예측할 때, 그 시점에 실제로 알 수 있던 과거를 어떻게 한 행으로 만듭니까?",
  sequence:
    "같은 사건 수를 가진 두 사용자의 순서가 다를 때, cutoff 이전 기록을 어떤 입력으로 보존하고 어느 모델까지 쓸지 어떻게 판단합니까?",
};

const FINDINGS: Record<TemporalDataFamilyArticle, string> = {
  features:
    "시간 특성의 출발점은 날짜 열이 아니라 entity·cutoff·horizon입니다. event time이 과거여도 cutoff 뒤에 도착한 기록은 제외하고, lag·window·주기 좌표의 양끝 규칙까지 고정해야 학습과 서빙에서 같은 행을 재현할 수 있습니다.",
  sequence:
    "사건 시퀀스는 cutoff까지 도착한 기록을 안정적으로 정렬한 ordered view입니다. count·recency·전이처럼 무엇을 버리는지 아는 기준선을 먼저 두고, 긴 순서가 같은 분리 조건에서 이득을 낼 때만 token·mask·attention 비용을 추가합니다.",
};

export function TemporalDataFamilyLocator({
  current,
}: {
  current: TemporalDataFamilyArticle;
}) {
  const isFeatures = current === "features";

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="시간 자료 학습 경로에서 현재 글의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/time-features" className="hover:text-primary">
          시간 자료
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          {isFeatures ? "시간 특성" : "사건 시퀀스"}
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            {isFeatures ? "개념" : "실무"}
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
              isFeatures
                ? "/cs/ai/feature-engineering#aggregation"
                : "/cs/ai/time-features#overview"
            }
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            {isFeatures
              ? "한 예측 시점에서 재현 가능한 특성 만들기 ↗"
              : "entity·cutoff·horizon으로 입력 경계 고정하기 ↗"}
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5"
        aria-label="시간 자료를 입력으로 바꾸는 다섯 단계"
      >
        {STEPS.map((step, index) => {
          const active = isFeatures ? index <= 2 : index >= 3;
          return (
            <Link
              key={step.label}
              to={step.href}
              aria-current={
                (isFeatures && index === 0) || (!isFeatures && index === 3)
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

export function TemporalDataFamilyMapReturn({
  current,
}: {
  current: TemporalDataFamilyArticle;
}) {
  const next =
    current === "features"
      ? {
          href: "/cs/ai/sequence-modeling-tabular",
          label: "다음 단계 · 사건 순서를 보존하는 입력으로 이동 →",
        }
      : {
          href: "/cs/ai/training-pipeline",
          label: "다음 묶음 · 재현 가능한 학습 파이프라인으로 이동 →",
        };

  return (
    <aside
      id="temporal-data-family-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 시간 자료 지도에 되돌려 놓기"
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
