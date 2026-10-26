import { Link } from "react-router-dom";

const steps = [
  {
    key: "contract",
    label: "평가 계약",
    detail: "예측 행·입력 마감·정답 구간을 먼저 고정합니다.",
    href: "/cs/ai/competition-workflow#source-availability",
  },
  {
    key: "selection",
    label: "선택 편향",
    detail: "같은 검증 점수를 반복해서 고를 때 생기는 낙관을 봅니다.",
    href: "/cs/ai/model-selection-bias#overview",
  },
  {
    key: "availability",
    label: "정보 도착",
    detail: "예측 당시 실제로 도착한 원본만 입력으로 인정합니다.",
    href: "/cs/ai/prediction-time-feature-availability#overview",
  },
  {
    key: "baseline",
    label: "기준 산출물",
    detail: "같은 입력 경계로 첫 완결 실행을 남깁니다.",
    href: "/cs/ai/competition-baseline#overview",
  },
] as const;

export function FeatureAvailabilityLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="평가 계약에서 예측 시점 정보 경계로 내려가는 학습 경로"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link
          to="/cs/ai/competition-workflow#source-availability"
          className="hover:text-primary"
        >
          평가 계약
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          예측 시점 정보 경계
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            개념
          </span>
          <p className="mt-3 break-keep text-base font-bold leading-7">
            10시에 예측했다면, 그때 실제로 조회할 수 있었던 정보는 무엇입니까?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link
            to="/cs/ai/competition-workflow#source-availability"
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            예측 행의 입력 마감과 정답 구간 ↗
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4"
        aria-label="평가 계약에서 기준 산출물로 이어지는 네 단계"
      >
        {steps.map((item, index) => {
          const current = item.key === "availability";
          return (
            <Link
              key={item.key}
              to={item.href}
              aria-current={current ? "step" : undefined}
              className={`min-w-0 bg-background px-3 py-3 ${
                current
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <span className="font-mono text-[9px] font-black text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong className="mt-1 block break-keep text-xs leading-5">
                {item.label}
              </strong>
              <span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">
                {item.detail}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export function FeatureAvailabilityReturn() {
  return (
    <aside
      id="feature-availability-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="예측 시점 정보 경계에서 확인한 사실을 평가 계약에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        사건이 예측보다 먼저 일어났다는 사실만으로는 부족합니다. 원본이 실제로 도착한 시각과 그 값을 만든 모든 의존 기록을 입력 마감과 함께 보존해야 당시의 예측을 다시 만들 수 있습니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold">
        <Link
          to="/cs/ai/competition-workflow#source-availability"
          className="inline-flex min-h-11 items-center border-b border-border hover:border-primary hover:text-primary"
        >
          평가 계약의 정보 경계로 돌아가기 ↑
        </Link>
        <Link
          to="/cs/ai/competition-baseline#overview"
          className="inline-flex min-h-11 items-center border-b border-border hover:border-primary hover:text-primary"
        >
          다음 주제 · 같은 경계로 기준 산출물 만들기 →
        </Link>
      </div>
    </aside>
  );
}
