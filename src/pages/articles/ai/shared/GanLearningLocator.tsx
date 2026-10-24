import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "game",
    label: "분포 게임",
    track: "개념",
    detail: "잠재 표본을 생성 표본으로 바꾸고 판별 신호를 생성기로 되돌립니다.",
    href: "/cs/ai/gan",
  },
  {
    id: "dynamics",
    label: "교대 학습",
    track: "개념",
    detail: "판별기와 생성기가 번갈아 바뀔 때 기울기 경계와 실패 양상을 봅니다.",
    href: "/cs/ai/gan-training-dynamics",
  },
  {
    id: "constraint",
    label: "판별 함수 제약",
    track: "개념",
    detail: "판별 함수의 경사를 제한해 분포 사이의 거리를 의미 있게 만듭니다.",
    href: "/cs/ai/gan-wasserstein-critics",
  },
  {
    id: "evaluation",
    label: "조건과 평가",
    track: "실무",
    detail: "조건 충실도·품질·포괄 범위·비용을 서로 다른 축으로 측정합니다.",
    href: "/cs/ai/gan-conditional-evaluation",
  },
] as const;

type GanStep = (typeof STEPS)[number]["id"];

const QUESTIONS: Record<GanStep, string> = {
  game: "생성기는 확률 밀도를 직접 계산하지 않고 어떤 경로로 학습 신호를 받습니까?",
  dynamics: "두 최적화기가 번갈아 움직일 때 어느 기울기를 끊고 어느 기울기를 통과시킵니까?",
  constraint: "판별 함수의 점수를 거리처럼 읽으려면 왜 함수의 경사를 먼저 제한해야 합니까?",
  evaluation: "조건을 지킨 선명한 표본 몇 장과 전체 분포를 잘 덮는 모델을 어떻게 구별합니까?",
};

const FINDINGS: Record<GanStep, string> = {
  game: "GAN은 잠재 표본을 데이터 공간으로 옮긴 뒤 실제 표본과 비교합니다. 판별기가 만든 입력 기울기가 생성기 매개변수까지 돌아가지만, 정규화된 생성 밀도나 역변환은 자동으로 생기지 않습니다.",
  dynamics: "판별기 단계에서는 생성 결과를 떼어 생성기 그래프를 막고, 생성기 단계에서는 판별기 가중치를 고정하되 입력 기울기는 통과시킵니다. 두 단계가 각각 맞아도 함께 움직이는 상태는 회전하거나 일부 모드만 남길 수 있습니다.",
  constraint: "Wasserstein 판별 함수는 확률을 내는 분류기가 아니라 두 분포의 평균 점수 차이를 키웁니다. 이 차이를 거리로 읽으려면 1-Lipschitz 제약이 필요하며, 기울기 패널티와 스펙트럴 정규화는 서로 다른 위치에서 이를 근사합니다.",
  evaluation: "조건부 생성 평가는 같은 조건을 생성기와 판별기에 주는 것에서 시작합니다. 출시 판단에서는 특징 공간의 중심·퍼짐, 표본 품질, 목표 분포의 포괄 범위, 조건 정확도와 실행 비용을 따로 기록해야 합니다.",
};

export function GanLearningLocator({ current }: { current: GanStep }) {
  const currentStep = STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="GAN을 분포 게임에서 평가 계약까지 따라가는 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/adversarial-density-ratios" className="hover:text-primary">생성 모델 · 비교 신호</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">GAN · {currentStep.label}</strong>
      </nav>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <Link
            key={step.id}
            to={step.href}
            aria-current={step.id === current ? "step" : undefined}
            className={`min-w-0 border-t-2 pt-3 ${
              step.id === current
                ? "border-primary text-foreground"
                : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
            }`}
          >
            <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="ml-2 break-keep text-sm leading-5">{step.label}</strong>
            <span className="ml-2 text-[9px] font-bold text-primary">{step.track}</span>
            <span className="mt-1 block break-keep text-[11px] leading-5">{step.detail}</span>
          </Link>
        ))}
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <p className="text-[9px] font-bold text-primary">이 글이 답할 질문</p>
        <p className="mt-1 break-keep text-sm font-bold leading-6">{QUESTIONS[current]}</p>
      </div>
    </aside>
  );
}

export function GanLearningMapReturn({ current }: { current: GanStep }) {
  const position = STEPS.findIndex((step) => step.id === current);
  const next = STEPS[position + 1];

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 GAN 학습 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      <Link
        to={next?.href ?? "/cs/ai/diffusion-models"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next ? `다음 단계 · ${next.label} →` : "다음 계열 · 확산 모델로 이동 →"}
      </Link>
    </aside>
  );
}
