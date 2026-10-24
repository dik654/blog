import VizFrame from "@/components/viz/VizFrame";

const stages = [
  {
    label: "조건",
    title: "조건 인코더",
    shape: "프롬프트·참조 → c",
  },
  {
    label: "표현",
    title: "시각 오토인코더",
    shape: "이미지 x ↔ 잠재값 z",
  },
  {
    label: "생성",
    title: "확산 Transformer",
    shape: "(zₜ, t, c) → v̂ₜ",
  },
  {
    label: "복원",
    title: "디코더",
    shape: "z₀ → 이미지 x̂",
  },
];

export default function ModernImageStackViz() {
  return (
    <VizFrame
      eyebrow="현대 이미지 생성 시스템"
      title="한 모델처럼 보여도 실제로는 네 구성요소가 서로 다른 계약을 맡습니다"
      description="프롬프트는 조건 표현으로, 이미지는 압축 잠재값으로 바뀝니다. Transformer는 잠재값의 이동 방향을 반복해서 예측하고 디코더가 마지막 잠재값을 픽셀로 되돌립니다."
      note="이 그림은 대표적인 잠재 확산·흐름 스택입니다. 픽셀 공간 생성이나 자기회귀 이미지 모델까지 모두 이 구성을 따른다는 뜻은 아닙니다."
      canvasClassName="max-h-[min(28rem,calc(100svh-20rem))] overflow-y-auto"
    >
      <div
        data-viz-canvas
        className="grid min-w-0 gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center"
      >
        {stages.map((stage, index) => (
          <div key={stage.title} className="contents">
            <div className="min-w-0 rounded-lg border border-border bg-background p-4">
              <p className="text-[11px] font-black text-primary">{stage.label}</p>
              <p className="mt-2 text-sm font-bold leading-6 text-foreground">
                {stage.title}
              </p>
              <p className="mt-2 break-words font-mono text-xs leading-5 text-muted-foreground">
                {stage.shape}
              </p>
            </div>
            {index < stages.length - 1 && (
              <span
                aria-hidden="true"
                className="text-center text-lg text-muted-foreground md:px-1"
              >
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
        <Boundary label="학습 대상" value="속도·잡음 예측값과 구성요소별 목표" />
        <Boundary label="병목" value="잠재 토큰 수 × 신경망 호출 수 × 모델 폭" />
        <Boundary label="월드모델에 없는 것" value="행동·시간·다음 상태 전이" />
      </div>
    </VizFrame>
  );
}

function Boundary({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-primary/45 pl-4">
      <p className="text-xs font-black text-foreground">{label}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{value}</p>
    </div>
  );
}
