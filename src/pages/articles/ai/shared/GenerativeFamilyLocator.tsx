import { Link } from "react-router-dom";

const HUB = {
  id: "map",
  label: "공통 지도",
  detail: "관측값·조건·분포를 고정하고 어떤 계산을 가능하게 만들지 정합니다.",
  href: "/cs/ai/generative-theory",
} as const;

const FAMILIES = [
  {
    id: "autoregressive",
    label: "조건부 분해",
    detail: "앞에서 본 값을 조건으로 다음 값의 확률을 곱합니다.",
    href: "/cs/ai/autoregressive-generative-models",
  },
  {
    id: "latent",
    label: "숨은 원인",
    detail: "보이지 않는 원인을 합하고 사후분포를 근사합니다.",
    href: "/cs/ai/latent-variable-generative-models",
  },
  {
    id: "flow",
    label: "가역 밀도",
    detail: "쉬운 분포를 가역적으로 옮기고 부피 변화를 보정합니다.",
    href: "/cs/ai/normalizing-flows",
  },
  {
    id: "adversarial",
    label: "비교 신호",
    detail: "실제 표본과 생성 표본을 구별해 밀도비 신호를 얻습니다.",
    href: "/cs/ai/adversarial-density-ratios",
  },
  {
    id: "score",
    label: "점수 방향",
    detail: "밀도 값 대신 더 높은 밀도로 향하는 국소 방향을 배웁니다.",
    href: "/cs/ai/score-based-generative-models",
  },
] as const;

type GenerativeFamilyStep = typeof HUB.id | (typeof FAMILIES)[number]["id"];

const QUESTIONS: Record<GenerativeFamilyStep, string> = {
  map: "생성 모델 계열은 같은 생성 문제에서 어떤 계산을 서로 다르게 선택합니까?",
  autoregressive: "전체 시퀀스 확률을 왜 앞부분에 조건부인 다음 값 확률의 곱으로 바꿉니까?",
  latent: "관측하지 못한 생성 원인을 어떻게 합하고, 어려운 사후분포를 어떻게 근사합니까?",
  flow: "가역 변환으로 좌표를 바꿀 때 왜 부피 변화만큼 밀도를 보정해야 합니까?",
  adversarial: "생성 분포의 정규화된 밀도를 몰라도 판별기는 어떤 비교 신호를 만들 수 있습니까?",
  score: "밀도 값을 직접 계산하지 않고 더 높은 밀도로 가는 방향을 어떻게 학습합니까?",
};

const FINDINGS: Record<GenerativeFamilyStep, string> = {
  map: "생성 모델 계열은 좋은 표본을 만드는 서로 다른 버전이 아닙니다. 정확한 조건부 확률, 숨은 원인의 적분, 가역 밀도, 두 분포의 비교, 국소 점수처럼 계산 가능하게 만든 대상이 서로 다릅니다.",
  autoregressive: "확률의 연쇄법칙은 시퀀스의 결합확률을 정확한 조건부 곱으로 바꿉니다. 학습 때는 정답 앞부분을 한꺼번에 알지만 생성 때는 앞 출력이 나와야 다음 조건이 생기므로 순차 지연이 남습니다.",
  latent: "관측값의 확률은 가능한 숨은 원인의 결합확률을 모두 합한 값입니다. 이 적분과 실제 사후분포가 어려워 계산 가능한 추론 분포를 배우며, ELBO와 사후분포 사이의 KL이 근사 격차가 됩니다.",
  flow: "가역 함수는 표본·역추론·정확한 밀도를 하나의 변환으로 연결합니다. 대신 차원이 같고 역함수와 야코비안 행렬식이 계산 가능해야 한다는 구조적 대가를 냅니다.",
  adversarial: "이상적인 판별기는 한 위치에서 실제 밀도가 실제·생성 밀도 합에서 차지하는 비율을 냅니다. 이 점별 최적해와 유한 신경망 두 개를 번갈아 학습하는 실제 동역학은 별개의 문제입니다.",
  score: "점수는 로그 밀도의 기울기라 정규화 상수를 몰라도 현재 위치에서 확률이 커지는 방향을 알려 줍니다. 확산 모델은 노이즈 수준마다 이 방향을 배워 역과정을 구성합니다.",
};

const ORDER: readonly GenerativeFamilyStep[] = [
  "map",
  "autoregressive",
  "latent",
  "flow",
  "adversarial",
  "score",
];

function stepFor(id: GenerativeFamilyStep) {
  return id === "map" ? HUB : FAMILIES.find((family) => family.id === id)!;
}

export function GenerativeFamilyLocator({ current }: { current: GenerativeFamilyStep }) {
  const currentStep = stepFor(current);

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="생성 문제에서 다섯 모델 계열로 갈라지는 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">생성 모델 · {currentStep.label}</strong>
      </nav>

      <Link
        to={HUB.href}
        aria-current={current === HUB.id ? "step" : undefined}
        className={`mt-4 block border-l-2 px-4 py-3 ${
          current === HUB.id
            ? "border-primary bg-primary/[0.05] text-foreground"
            : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
        }`}
      >
        <span className="flex flex-wrap items-baseline gap-x-2">
          <strong className="break-keep text-sm">{HUB.label}</strong>
          <span className="text-[9px] font-bold text-primary">개념</span>
        </span>
        <span className="mt-1 block break-keep text-[11px] leading-5">{HUB.detail}</span>
      </Link>

      <div className="my-2 flex items-center gap-3 text-[10px] text-muted-foreground" aria-hidden>
        <span className="h-4 border-l border-dashed border-border" />
        <span>같은 문제를 푸는 다섯 갈래</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {FAMILIES.map((family, index) => (
          <Link
            key={family.id}
            to={family.href}
            aria-current={family.id === current ? "step" : undefined}
            className={`min-w-0 border-t-2 pt-3 ${
              family.id === current
                ? "border-primary text-foreground"
                : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
            }`}
          >
            <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="ml-2 break-keep text-sm leading-5">{family.label}</strong>
            <span className="mt-1 block break-keep text-[11px] leading-5">{family.detail}</span>
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

export function GenerativeFamilyMapReturn({ current }: { current: GenerativeFamilyStep }) {
  const position = ORDER.indexOf(current);
  const next = position < ORDER.length - 1 ? stepFor(ORDER[position + 1]) : null;

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 생성 모델 계열 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      <Link
        to={next?.href ?? "/cs/ai/vae"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next ? `다음 갈래 · ${next.label} →` : "다음 확대 · VAE 구현으로 이동 →"}
      </Link>
    </aside>
  );
}
