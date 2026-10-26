import { Link } from "react-router-dom";

const steps = [
  {
    key: "contract",
    label: "평가 계약",
    detail: "예측을 행동과 비용, 집계 단위로 연결합니다.",
    href: "/cs/ai/evaluation-metrics#map",
  },
  {
    key: "regression",
    label: "회귀",
    detail: "수치 오차에 붙일 비용을 정합니다.",
    href: "/cs/ai/regression-metrics#overview",
  },
  {
    key: "classification",
    label: "분류",
    detail: "순위와 확률, 행동 기준을 나눕니다.",
    href: "/cs/ai/classification-metrics#overview",
  },
  {
    key: "ranking",
    label: "검색·추천",
    detail: "목록의 순서와 질의를 함께 평가합니다.",
    href: "/cs/ai/ranking-metrics#overview",
  },
  {
    key: "selection",
    label: "지표 선택",
    detail: "학습·선택·출시 지표의 역할을 확정합니다.",
    href: "/cs/ai/metric-selection-protocol#overview",
  },
] as const;

export function RegressionMetricLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="평가 설계에서 회귀 지표로 내려가는 학습 경로"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/evaluation-metrics#map" className="hover:text-primary">
          평가 설계
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          회귀 지표
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            개념
          </span>
          <p className="mt-3 break-keep text-base font-bold leading-7">
            같은 네 수치가 MAE와 RMSE에서 왜 다른 최적 예측을 고릅니까?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link
            to="/cs/ai/evaluation-metrics#map"
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            출력 형태에 맞는 평가 질문 고르기 ↗
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5"
        aria-label="평가 계약에서 지표 선택으로 이어지는 다섯 단계"
      >
        {steps.map((item, index) => {
          const current = item.key === "regression";
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

export function RegressionMetricReturn() {
  return (
    <aside
      id="regression-metric-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="회귀 지표에서 확인한 사실을 평가 설계 지도에 되돌려 놓기"
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
          평가 설계의 출력 지도에 반영하기 ↑
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
