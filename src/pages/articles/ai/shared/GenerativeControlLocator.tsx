import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "scope",
    branch: "공통 준비",
    label: "어댑터 범위",
    track: "개념",
    detail: "같은 LoRA 식이라도 이미지·영상 모델의 어느 정보 경로에 붙였는지에 따라 학습 능력이 달라집니다.",
    href: "/cs/ai/image-video-lora-architecture",
  },
  {
    id: "memory",
    branch: "공통 준비",
    label: "메모리 예산",
    track: "실무",
    detail: "학습 파라미터뿐 아니라 매 스텝 호출되는 동결 부품과 활성값까지 장치 상주 집합으로 계산합니다.",
    href: "/cs/ai/multi-component-finetuning-vram",
  },
  {
    id: "measurement",
    branch: "공통 준비",
    label: "계측기 검증",
    track: "실무",
    detail: "얼굴 유사도와 영역 변화량을 쓰기 전에 답을 아는 입력으로 측정 도구부터 검증합니다.",
    href: "/cs/ai/generative-measurement-controls",
  },
  {
    id: "verbs",
    branch: "편집 도구",
    label: "편집 의도",
    track: "실무",
    detail: "색 변경·교체·추가·삭제를 하나의 편집으로 뭉치지 않고 성공 조건에 따라 모델과 마스크를 고릅니다.",
    href: "/cs/ai/masked-edit-verb-routing",
  },
  {
    id: "removal",
    branch: "편집 도구",
    label: "삭제 계약",
    track: "실무",
    detail: "그려 넣는 확산 모델과 비워 내는 삭제 도구의 입력 계약이 왜 다른지 실패 사례로 확인합니다.",
    href: "/cs/ai/removal-is-not-inpainting",
  },
  {
    id: "resolution",
    branch: "편집 도구",
    label: "대상 해상도",
    track: "실무",
    detail: "전체 프레임이 아니라 편집 대상이 잠재공간에서 차지하는 칸 수로 성공 가능성을 판단합니다.",
    href: "/cs/ai/roi-resolution-identity-budget",
  },
  {
    id: "signals",
    branch: "정체성 제어",
    label: "신호 분리",
    track: "개념",
    detail: "정체성·포즈·방향을 서로 다른 조건 경로에 맡겨 한 신호가 다른 신호를 붙잡지 않게 합니다.",
    href: "/cs/ai/reference-identity-pose-separation",
  },
  {
    id: "diversity",
    branch: "정체성 제어",
    label: "다양성 진단",
    track: "참고",
    detail: "시드·문구·가중치·참조 뱅크를 차례로 분리해 같은 얼굴이 반복되는 원인을 좁힙니다.",
    href: "/cs/ai/generative-identity-diversity",
  },
] as const;

type GenerativeControlStep = (typeof STEPS)[number]["id"];

const QUESTIONS: Record<GenerativeControlStep, string> = {
  scope: "LoRA의 행렬식이 같아도 이미지와 영상에서 학습되는 능력이 달라지는 이유는 무엇입니까?",
  memory: "어댑터만 학습하는데도 여러 부품이 VRAM을 차지하는 이유와 줄일 수 있는 항목은 무엇입니까?",
  measurement: "생성 결과를 재는 숫자가 실제 의도한 차이를 측정하는지 어떻게 먼저 확인합니까?",
  verbs: "같은 마스크 편집 API가 색 변경·교체·추가·삭제를 모두 같은 방식으로 처리할 수 없는 이유는 무엇입니까?",
  removal: "확산 인페인팅이 대상을 지우는 대신 다른 물체를 채워 넣을 때 어떤 도구 계약으로 바꿔야 합니까?",
  resolution: "같은 모델과 설정인데 대상의 화면상 크기만 달라져 정체성 보존이 무너지는 이유는 무엇입니까?",
  signals: "참조 이미지에 정체성과 자세가 함께 들어 있을 때 두 신호를 어떤 경로로 나눠야 합니까?",
  diversity: "같은 얼굴이 반복될 때 시드·문구·가중치 중 실제 병목을 어떻게 구분합니까?",
};

const FINDINGS: Record<GenerativeControlStep, string> = {
  scope: "LoRA는 작은 변화량을 만드는 방법일 뿐입니다. 실제로 학습되는 능력은 host architecture에서 선택한 공간·시간·교차모달 경로와 학습 데이터가 결정하므로, artifact에는 base revision과 정확한 target module 목록이 함께 남아야 합니다.",
  memory: "동결은 gradient를 만들지 않는다는 뜻이지 장치에서 사라진다는 뜻이 아닙니다. 매 스텝 forward에 참여하는 부품은 상주하며, 메모리는 가중치·활성값·gradient·optimizer state를 부품별로 나눠 계산해야 합니다.",
  measurement: "계측값은 계측기의 적용 범위 안에서만 근거가 됩니다. 원본 자신·무동작·서로 다른 대상을 함께 넣어 탐지 실패, 오토인코더 바닥값, 스타일 범위를 확인한 뒤에만 비교값을 해석할 수 있습니다.",
  verbs: "편집 API 하나 안에도 형태를 보존하는 속성 변경, 새 경계를 만드는 교체, 없던 것을 만드는 추가, 있던 것을 비우는 삭제가 있습니다. 모델 선택과 마스크 확장 방향은 이 동작 분류 뒤에 결정해야 합니다.",
  removal: "확산 디노이저는 마스크 영역을 그럴듯하게 채우도록 학습됐습니다. 삭제 성공 조건은 새 물체를 그리지 않는 것이므로, 프롬프트 생성 모델을 계속 조정하기보다 제거 전용 모델과 그에 맞는 입력 계약을 선택해야 합니다.",
  resolution: "전체 이미지 해상도가 아니라 대상이 잠재 격자에서 차지하는 정보량이 보존 가능성을 제한합니다. 작은 얼굴은 ROI로 잘라 실제 입력 예산을 늘리고, 확대 지표는 정답을 아는 대조군으로 먼저 검증해야 합니다.",
  signals: "참조 조건 하나에 정체성과 자세를 함께 맡기면 두 요구가 충돌합니다. 정체성은 어텐션 경로, 포즈는 공간 조건, 방향은 문구처럼 서로 다른 손잡이로 나눠야 각 신호를 독립적으로 조절할 수 있습니다.",
  diversity: "표본을 늘리고 변수를 한 축씩 바꾸자 시드의 기여는 거의 사라지고 문구와 모델 가중치의 경계가 드러났습니다. 작은 표본에서 얻은 원인을 일반화하지 말고 충돌률과 계측 실패를 함께 기록해야 합니다.",
};

export function GenerativeControlLocator({ current }: { current: GenerativeControlStep }) {
  const currentStep = STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="이미지와 영상 생성 조정을 공통 준비와 두 실험 갈래로 나누는 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/modern-image-model-stack" className="hover:text-primary">이미지·영상 생성</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">생성 조정 · {currentStep.label}</strong>
      </nav>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-4">
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

export function GenerativeControlMapReturn({ current }: { current: GenerativeControlStep }) {
  const position = STEPS.findIndex((step) => step.id === current);
  const next = STEPS[position + 1];

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 이미지와 영상 생성 조정 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      <Link
        to={next?.href ?? "/cs/ai/negative-result-3d-face-control"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next ? `다음 단계 · ${next.label} →` : "다음 기록 · 실패한 3D 얼굴 제어 실험으로 이동 →"}
      </Link>
    </aside>
  );
}
