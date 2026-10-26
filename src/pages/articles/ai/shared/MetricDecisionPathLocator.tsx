import { Link } from "react-router-dom";

const branches = [
  {
    key: "regression",
    label: "회귀 평가",
    detail: "수치 오차에 붙일 비용을 정합니다.",
    href: "/cs/ai/regression-metrics#overview",
  },
  {
    key: "classification",
    label: "분류 평가",
    detail: "순위와 확률, 행동 기준을 나눕니다.",
    href: "/cs/ai/classification-metrics#overview",
  },
  {
    key: "ranking",
    label: "검색·추천 평가",
    detail: "목록의 순서와 질의를 함께 평가합니다.",
    href: "/cs/ai/ranking-metrics#overview",
  },
  {
    key: "selection",
    label: "출시 선택",
    detail: "후보·행동 기준·승인 규칙을 고정합니다.",
    href: "/cs/ai/metric-selection-protocol#overview",
  },
] as const;

const branchGroups = [
  {
    key: "output",
    label: "출력별 평가",
    detail: "예측 결과의 형태에 맞춰 오차와 순서를 측정합니다.",
    anchor: "output-evaluation",
    branchKeys: ["regression", "classification", "ranking"],
  },
  {
    key: "release",
    label: "출시 결정",
    detail: "여러 측정값으로 출시할 정책 하나를 고정하고 승인합니다.",
    anchor: "release-decision",
    branchKeys: ["selection"],
  },
] as const;

type MetricStepKey = (typeof branches)[number]["key"];

const locatorCopy: Record<
  Extract<MetricStepKey, "regression" | "classification" | "ranking" | "selection">,
  {
    currentLabel: string;
    question: string;
    ariaLabel: string;
    track: "개념" | "실무";
    groupKey: (typeof branchGroups)[number]["key"];
  }
> = {
  regression: {
    currentLabel: "회귀 평가",
    question: "같은 네 수치가 MAE와 RMSE에서 왜 다른 최적 예측을 고릅니까?",
    ariaLabel: "평가 계약 아래 회귀 지표의 위치",
    track: "개념",
    groupKey: "output",
  },
  classification: {
    currentLabel: "분류 평가",
    question: "한 점수를 순위·확률·행동의 서로 다른 평가로 어떻게 나눕니까?",
    ariaLabel: "평가 계약 아래 분류 지표의 위치",
    track: "개념",
    groupKey: "output",
  },
  ranking: {
    currentLabel: "검색·추천 평가",
    question: "검색 결과의 판정과 순서를 어떻게 사용자 집단의 평가로 연결합니까?",
    ariaLabel: "평가 계약 아래 검색·추천 지표의 위치",
    track: "개념",
    groupKey: "output",
  },
  selection: {
    currentLabel: "출시 선택",
    question: "학습한 후보 가운데 어떤 하나를 어떤 근거로 출시합니까?",
    ariaLabel: "평가 계약 아래 출시 선택의 위치",
    track: "실무",
    groupKey: "release",
  },
};

function MetricDecisionPathLocator({
  current,
}: {
  current: keyof typeof locatorCopy;
}) {
  const copy = locatorCopy[current];
  const currentGroup = branchGroups.find((group) => group.key === copy.groupKey)!;
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label={copy.ariaLabel}
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/evaluation-metrics#map" className="hover:text-primary">
          평가 계약
        </Link>
        <span aria-hidden>›</span>
        <Link
          to={`/cs/ai/evaluation-metrics#${currentGroup.anchor}`}
          className="hover:text-primary"
        >
          {currentGroup.label}
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          {copy.currentLabel}
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            {copy.track}
          </span>
          <p className="mt-3 break-keep text-base font-bold leading-7">
            {copy.question}
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모</p>
          <Link
            to={`/cs/ai/evaluation-metrics#${currentGroup.anchor}`}
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            {currentGroup.label}
          </Link>
          <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground">
            {currentGroup.detail}
          </p>
        </div>
      </div>

      <div
        className="mt-5 border-t border-border pt-3"
        aria-label="평가 계약의 출력별 평가와 출시 결정"
      >
        <p className="text-[10px] font-bold text-muted-foreground">평가 계약의 두 갈래</p>
        <div className="mt-2 grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(13rem,1fr)]">
          {branchGroups.map((group) => (
            <div key={group.key} className="border border-border">
              <div className="border-b border-border px-3 py-2">
                <strong className="block text-xs leading-5">{group.label}</strong>
                <span className="mt-0.5 block break-keep text-[10px] leading-4 text-muted-foreground">
                  {group.detail}
                </span>
              </div>
              <div className={`grid gap-px bg-border p-px ${group.key === "output" ? "sm:grid-cols-3" : "grid-cols-1"}`}>
                {branches
                  .filter((item) => (group.branchKeys as readonly string[]).includes(item.key))
                  .map((item) => {
                    const isCurrent = item.key === current;
                    return (
                      <Link
                        key={item.key}
                        to={item.href}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`min-w-0 bg-background px-3 py-3 ${
                          isCurrent
                            ? "border-b-2 border-primary text-foreground"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        <strong className="block break-keep text-xs leading-5">
                          {item.label}
                        </strong>
                        <span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">
                          {item.detail}
                        </span>
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function RegressionMetricLocator() {
  return <MetricDecisionPathLocator current="regression" />;
}

export function RankingMetricLocator() {
  return <MetricDecisionPathLocator current="ranking" />;
}

export function ClassificationMetricLocator() {
  return <MetricDecisionPathLocator current="classification" />;
}

export function MetricSelectionLocator() {
  return <MetricDecisionPathLocator current="selection" />;
}

export function RegressionMetricReturn() {
  return (
    <aside
      id="regression-metric-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="회귀 지표에서 확인한 사실을 평가 계약 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        회귀 지표는 같은 오차를 다른 비용으로 바꿉니다. MAE는 중앙값을,
        제곱 오차는 평균을 고르므로 지표를 정한다는 것은 어떤 예측을 좋은
        결정으로 볼지도 정하는 일입니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold">
        <Link
          to="/cs/ai/evaluation-metrics#map"
          className="inline-flex min-h-11 items-center border-b border-border hover:border-primary hover:text-primary"
        >
          평가 계약 지도에 반영하기 ↑
        </Link>
        <Link
          to="/cs/ai/classification-metrics#overview"
          className="inline-flex min-h-11 items-center border-b border-border hover:border-primary hover:text-primary"
        >
          다음 주제 · 분류 점수를 행동으로 바꾸기 →
        </Link>
      </div>
    </aside>
  );
}

export function RankingMetricReturn() {
  return (
    <aside
      id="ranking-metric-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="검색·추천 지표에서 확인한 사실을 평가 계약 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        검색·추천 평가는 질의 하나의 목록을 먼저 채점하고, 그 점수를 어떤 질의
        집단으로 합칠지 정합니다. 순위 공식만 고르는 것으로 끝나지 않고 판정 범위와
        집계 가중치까지 고정해야 같은 시스템을 비교할 수 있습니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold">
        <Link
          to="/cs/ai/evaluation-metrics#map"
          className="inline-flex min-h-11 items-center border-b border-border hover:border-primary hover:text-primary"
        >
          평가 계약 지도에 반영하기 ↑
        </Link>
        <Link
          to="/cs/ai/metric-selection-protocol#overview"
          className="inline-flex min-h-11 items-center border-b border-border hover:border-primary hover:text-primary"
        >
          다음 주제 · 지표를 선택 규칙으로 고정하기 →
        </Link>
      </div>
    </aside>
  );
}

export function MetricSelectionReturn() {
  return (
    <aside
      id="metric-selection-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="출시 선택에서 확인한 사실을 평가 계약 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        학습 손실은 가중치를 만들고, 검증 자료는 학습 산출물·행동 기준·실행
        설정을 묶은 정책을 측정하고 고릅니다. 선택 기준을 통과한 정책을 먼저
        고정한 뒤, 독립 최종 자료는 그 정책을 승인하거나 거절할 뿐 값을 다시
        바꾸지 않습니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold">
        <Link
          to="/cs/ai/evaluation-metrics#map"
          className="inline-flex min-h-11 items-center border-b border-border hover:border-primary hover:text-primary"
        >
          평가 계약 지도에 반영하기 ↑
        </Link>
        <Link
          to="/cs/ai/experiment-tracking#overview"
          className="inline-flex min-h-11 items-center border-b border-border hover:border-primary hover:text-primary"
        >
          다음 주제 · 선택 근거와 실행 기록 남기기 →
        </Link>
      </div>
    </aside>
  );
}
