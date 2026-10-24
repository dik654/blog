import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "foundation",
    branch: "공통 원리",
    label: "손상과 복원",
    track: "개념",
    detail: "원본에서 학습용 잡음 쌍을 만들고, 생성할 때는 복원 방향을 반복해서 묻습니다.",
    href: "/cs/ai/diffusion-models",
  },
  {
    id: "continuous",
    branch: "공통 원리",
    label: "연속시간 전송",
    track: "개념",
    detail: "같은 확률분포 이동을 무작위 경로와 결정적 경로로 나누고 수치 오차를 셉니다.",
    href: "/cs/ai/diffusion-continuous-time",
  },
  {
    id: "latent",
    branch: "이미지 경로",
    label: "잠재공간 생성",
    track: "실무",
    detail: "픽셀을 압축한 뒤 조건 방향을 더하고 품질·포괄·비용을 따로 판정합니다.",
    href: "/cs/ai/latent-diffusion-guidance",
  },
  {
    id: "representation",
    branch: "이미지 경로",
    label: "표현 계약",
    track: "개념",
    detail: "복원용 잠재표현과 의미 표현이 무엇을 남기고 잃는지 구분합니다.",
    href: "/cs/ai/visual-representation-tokenizers",
  },
  {
    id: "transformer",
    branch: "이미지 경로",
    label: "복원기 구조",
    track: "개념",
    detail: "잠재 격자를 토큰으로 바꾸고 시간·조건을 넣어 같은 모양의 복원 방향을 냅니다.",
    href: "/cs/ai/diffusion-transformer-architecture",
  },
  {
    id: "stack",
    branch: "이미지 경로",
    label: "전체 조립",
    track: "참고",
    detail: "조건 인코더·표현·생성기·복원기의 상태와 실패 책임을 한 지도에 놓습니다.",
    href: "/cs/ai/modern-image-model-stack",
  },
  {
    id: "language",
    branch: "언어 경로",
    label: "마스크 복원",
    track: "개념",
    detail: "연속 잡음 대신 토큰을 가리고 여러 위치를 함께 복원하는 별도 갈래를 봅니다.",
    href: "/cs/ai/diffusion-language-models",
  },
] as const;

type DiffusionStep = (typeof STEPS)[number]["id"];

const QUESTIONS: Record<DiffusionStep, string> = {
  foundation: "학습에서는 잡음 수준 하나만 보는데 생성에서는 왜 같은 신경망을 여러 번 호출합니까?",
  continuous: "같은 시간별 분포를 만드는 무작위 경로와 결정적 경로는 무엇이 같고 무엇이 다릅니까?",
  latent: "픽셀 대신 잠재공간에서 생성할 때 어느 구성요소가 어떤 손실과 실패를 소유합니까?",
  representation: "같은 이미지를 압축해도 복원용 잠재표현과 의미 표현이 서로 바뀌어 쓰일 수 없는 이유는 무엇입니까?",
  transformer: "Diffusion Transformer는 잠재 격자·시간·조건을 받아 한 번의 복원 호출에서 무엇을 반환합니까?",
  stack: "한 이미지 생성 요청이 네 구성요소를 지날 때 상태·버전·병목·실패 책임은 어디에 남습니까?",
  language: "연속값 잡음을 쓰지 않는 언어에서도 손상과 반복 복원이라는 확산 원리를 어떻게 구현합니까?",
};

const FINDINGS: Record<DiffusionStep, string> = {
  foundation: "학습은 임의 시간의 잡음 쌍 하나를 만들지만 생성은 단순한 잡음에서 시작해 복원 예측을 여러 번 적용합니다. 따라서 학습 단계 수, 표본추출 단계 수, 실제 신경망 호출 수는 따로 기록해야 합니다.",
  continuous: "Reverse SDE와 probability-flow ODE는 이상적인 score에서 같은 시간별 분포를 가질 수 있지만 입자 경로와 수치 오차는 다릅니다. 실제 실행에서는 solver와 신경망 호출 횟수가 별도 비용을 만듭니다.",
  latent: "인코더는 복원 가능한 정보의 상한을, 복원기는 반복 계산을, sampler는 호출 순서를, 디코더는 픽셀 복원을 소유합니다. 조건 방향을 크게 만드는 것과 품질·분포 포괄을 함께 개선하는 것은 같은 주장이 아닙니다.",
  representation: "복원 손실은 픽셀을 되살릴 정보를, 의미 학습은 과제에 불필요한 변화를 지우는 불변성을 보상합니다. 어느 표현이 좋은지는 이름이 아니라 학습 목표와 다음 소비자가 요구하는 정보로 판정합니다.",
  transformer: "DiT는 파일을 직접 만드는 언어 모델이 아니라 잠재 격자를 토큰화해 한 solver 단계의 잡음·속도·원본 예측을 반환하는 복원기입니다. 토큰 수와 호출 횟수가 서로 다른 비용 축입니다.",
  stack: "현대 이미지 생성은 조건 인코더, 시각 표현, 반복 생성기, 디코더의 조합입니다. 한 제품 이름 아래에서도 각 구성요소의 버전·텐서 계약·관측 지표와 되돌리기 단위를 따로 남겨야 합니다.",
  language: "언어 확산은 토큰 값을 연속 보간하지 않고 원 토큰의 확률 질량을 MASK 상태로 옮깁니다. 여러 위치를 함께 복원할 수 있지만 반복 단계마다 바뀌는 전체 문맥 때문에 일반적인 인과적 KV 캐시를 그대로 쓸 수 없습니다.",
};

export function DiffusionLearningLocator({ current }: { current: DiffusionStep }) {
  const currentStep = STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="확산 모델을 공통 원리에서 이미지와 언어 경로로 나누는 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/score-based-generative-models" className="hover:text-primary">생성 모델 · 점수 방향</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">확산 모델 · {currentStep.label}</strong>
      </nav>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-7">
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
            <span className="block text-[9px] font-bold text-primary">{step.branch}</span>
            <span className="mt-1 block font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="mt-1 block break-keep text-sm leading-5">{step.label}</strong>
            <span className="mt-1 block text-[9px] font-bold text-primary">{step.track}</span>
            <span className="mt-1 hidden break-keep text-[11px] leading-5 sm:block">{step.detail}</span>
          </Link>
        ))}
      </div>

      <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground sm:hidden">
        {currentStep.detail}
      </p>

      <div className="mt-4 border-t border-border pt-3">
        <p className="text-[9px] font-bold text-primary">이 글이 답할 질문</p>
        <p className="mt-1 break-keep text-sm font-bold leading-6">{QUESTIONS[current]}</p>
      </div>
    </aside>
  );
}

export function DiffusionLearningMapReturn({ current }: { current: DiffusionStep }) {
  const position = STEPS.findIndex((step) => step.id === current);
  const next = STEPS[position + 1];

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 확산 모델 학습 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      <Link
        to={next?.href ?? "/cs/ai/image-video-lora-architecture"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next ? `다음 단계 · ${next.label} →` : "다음 주제 · 이미지·비디오 LoRA로 이동 →"}
      </Link>
    </aside>
  );
}
