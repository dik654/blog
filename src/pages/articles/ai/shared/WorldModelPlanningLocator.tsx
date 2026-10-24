import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "state",
    label: "상태 표현",
    detail: "관측에서 다음 행동을 고르는 데 필요한 상태만 남깁니다.",
    href: "/cs/ai/visual-representation-tokenizers#world-state",
  },
  {
    id: "transition",
    label: "상태 전이",
    detail: "현재 상태와 행동으로 다음 상태를 예측합니다.",
    href: "/cs/ai/world-model-latent-planning#black-box",
  },
  {
    id: "rollout",
    label: "후보 비교",
    detail: "여러 행동 순서를 모델 안에서 펼쳐 목표 비용을 비교합니다.",
    href: "/cs/ai/world-model-latent-planning#case",
  },
  {
    id: "feedback",
    label: "실행·재관측",
    detail: "첫 행동만 실행한 뒤 실제 관측으로 예측을 바로잡습니다.",
    href: "/cs/ai/world-model-latent-planning#picture",
  },
  {
    id: "evidence",
    label: "구현 대조",
    detail: "rollout과 비용 계산이 실제 코드에서 어디에 있는지 확인합니다.",
    href: "/cs/ai/world-model-latent-planning#source",
  },
  {
    id: "limits",
    label: "계획 한계",
    detail: "예측 오차와 실제 행동 성공을 따로 평가합니다.",
    href: "/cs/ai/world-model-latent-planning#limits",
  },
] as const;

export function WorldModelPlanningLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="생성 모델에서 월드모델 계획으로 넘어가는 학습 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/modern-image-model-stack#world-model-boundary" className="hover:text-primary">이미지·영상 생성의 경계</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">월드모델 계획</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
          <p className="mt-3 break-keep text-base font-bold leading-7">
            모델 안에서 고른 행동이 현실에서 빗나갈 때, 어느 값부터 다시 계산해야 합니까?
          </p>
          <p className="mt-1 break-keep text-xs leading-6 text-muted-foreground">
            위치 0에서 목표 2로 가는 네 후보를 비교하고, 첫 행동의 실제 결과 0.8을 관측해 다시 계획합니다.
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모</p>
          <Link
            to="/cs/ai/modern-image-model-stack#world-model-boundary"
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            한 장을 만드는 모델에 시간·행동·상태 전이를 더하는 경계 ↗
          </Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3 lg:grid-cols-6" aria-label="월드모델 계획의 여섯 단계">
        {STEPS.map((step, index) => (
          <Link key={step.id} to={step.href} className="min-w-0 bg-background px-3 py-3 hover:text-primary">
            <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="mt-1 block break-keep text-xs leading-5">{step.label}</strong>
            <span className="mt-1 hidden break-keep text-[10px] leading-4 text-muted-foreground lg:block">{step.detail}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function WorldModelPlanningMapReturn() {
  return (
    <aside
      id="world-model-planning-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 월드모델 계획 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        월드모델은 미래를 한 번 맞히는 생성기가 아닙니다. 상태와 행동으로 여러 미래를 비교하고, 일부만 실행한 뒤 실제 관측으로 출발점을 계속 고치는 폐루프의 예측 부품입니다.
      </p>
      <Link
        to="/cs/ai/vla-embodiment-gap"
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        다음 지도 · 예측한 행동을 실제 로봇에 연결하는 경계 →
      </Link>
    </aside>
  );
}
