import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "boosting",
    label: "잔차 보정",
    track: "개념",
    detail:
      "현재 예측이 남긴 오차 방향을 새 트리의 상수 출력으로 조금씩 보정합니다.",
    href: "/cs/ai/gradient-boosting",
  },
  {
    id: "xgboost",
    label: "목적함수",
    track: "개념",
    detail: "한 잎의 기울기·곡률 합과 분할 전후 점수로 갱신값을 계산합니다.",
    href: "/cs/ai/xgboost-tree-objective",
  },
  {
    id: "lightgbm",
    label: "탐색 비용",
    track: "개념",
    detail: "행·희소 열·다음에 나눌 잎을 줄여 분할 후보 탐색 비용을 낮춥니다.",
    href: "/cs/ai/lightgbm-efficient-trees",
  },
  {
    id: "catboost",
    label: "순서 누출",
    track: "개념",
    detail:
      "현재 행을 아직 보지 않은 앞부분 모델로 잔차를 만들어 자기 정답 누출을 줄입니다.",
    href: "/cs/ai/catboost-ordered-learning",
  },
  {
    id: "deep",
    label: "표현 선택",
    track: "실무",
    detail:
      "강한 트리 기준선과 같은 조건에서 열 토큰·상호작용 표현의 추가 가치를 검증합니다.",
    href: "/cs/ai/tabular-deep-learning",
  },
] as const;

export type TabularModelFamilyStep = (typeof STEPS)[number]["id"];

const QUESTIONS: Record<TabularModelFamilyStep, string> = {
  boosting:
    "현재 예측 4를 목표 7에 더 가깝게 만들 때 새 트리는 무엇을 학습하고 얼마를 더합니까?",
  xgboost:
    "한 잎 안의 여러 행을 기울기와 곡률의 두 합으로 접어 최적 갱신과 분할 이득을 어떻게 계산합니까?",
  lightgbm:
    "같은 부스팅 원리를 유지하면서 많은 행과 희소 열, 성장 후보를 어느 축에서 줄입니까?",
  catboost:
    "현재 행의 정답을 이미 본 모델이 그 행의 잔차를 만드는 자기 누출을 어떻게 막습니까?",
  deep: "트리 부스팅보다 복잡한 열 표현을 추가할 가치가 있는지 어떤 비교 계약으로 판단합니까?",
};

const FINDINGS: Record<TabularModelFamilyStep, string> = {
  boosting:
    "경사 부스팅은 모든 잎을 더하는 한 트리가 아니라, 매 단계에서 현재 예측의 손실 감소 방향을 새 트리가 근사하고 학습률만큼 더하는 함수 합입니다.",
  xgboost:
    "XGBoost는 현재 점수 주변의 손실을 2차로 근사해 잎의 기울기 합 G와 곡률 합 H로 갱신값을 계산합니다. 분할 이득은 두 자식의 점수에서 부모 점수와 구조 비용을 뺀 학습 장부이며 검증 성능 보장은 아닙니다.",
  lightgbm:
    "LightGBM의 GOSS·EFB·잎 중심 성장은 같은 최적화를 세 이름으로 반복하지 않습니다. 각각 분할 통계에 쓰는 행 수, 유효 열 수, 다음 분할 위치를 바꿉니다.",
  catboost:
    "CatBoost의 순서 부스팅은 현재 행보다 앞선 행만 학습한 모델에서 현재 행의 기울기를 계산합니다. 범주 통계의 순서 처리, 외부 시간 분리, 대칭 트리 구조는 서로 다른 책임입니다.",
  deep: "표 형식 딥러닝은 자료 계약을 없애지 않습니다. 같은 분리·탐색 예산에서 강한 트리 기준선과 비교해 열 임베딩·상호작용·사전학습이 품질과 운영 비용을 함께 개선할 때 선택할 수 있습니다.",
};

export function TabularModelFamilyLocator({
  current,
}: {
  current: TabularModelFamilyStep;
}) {
  const currentStep = STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="표 형식 모델 학습 경로에서 현재 글의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/gradient-boosting" className="hover:text-primary">
          표 형식 모델
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
              current === "boosting"
                ? "/cs/ai"
                : "/cs/ai/gradient-boosting#functional-gradient"
            }
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            {current === "boosting"
              ? "인공지능 학습 지도에서 표 형식 자료 찾기 ↗"
              : "현재 예측의 손실 감소 방향을 새 트리로 근사하기 ↗"}
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5"
        aria-label="표 형식 모델을 이해하고 선택하는 다섯 단계"
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

export function TabularModelFamilyMapReturn({
  current,
}: {
  current: TabularModelFamilyStep;
}) {
  const position = STEPS.findIndex((step) => step.id === current);
  const next = STEPS[position + 1];

  return (
    <aside
      id="tabular-model-family-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 표 형식 모델 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        부모 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        {FINDINGS[current]}
      </p>
      <Link
        to={next?.href ?? "/cs/ai/time-features"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next
          ? `다음 단계 · ${next.label} →`
          : "다음 묶음 · 시간 특성과 사건 순서로 이동 →"}
      </Link>
    </aside>
  );
}
