import VizFrame from "@/components/viz/VizFrame";

const stages = [
  {
    label: "조건",
    title: "Text·image encoder",
    shape: "prompt/reference → c",
  },
  {
    label: "표현",
    title: "Visual autoencoder",
    shape: "image x ↔ latent z",
  },
  {
    label: "생성",
    title: "Diffusion transformer",
    shape: "(zₜ, t, c) → v̂ₜ",
  },
  {
    label: "복원",
    title: "Decoder",
    shape: "z₀ → image x̂",
  },
];

export default function ModernImageStackViz() {
  return (
    <VizFrame
      eyebrow="현대 이미지 생성 시스템"
      title="한 모델처럼 보여도 실제로는 네 component가 서로 다른 계약을 맡습니다"
      description="Prompt는 조건 표현으로, image는 압축 latent로 바뀝니다. Transformer는 그 latent의 이동 방향을 반복해서 예측하고 decoder가 마지막 latent를 pixel로 되돌립니다."
      note="이 그림은 대표적인 latent diffusion·flow stack입니다. Pixel-space 생성이나 autoregressive image model까지 모든 이미지 모델이 이 구성을 따른다는 뜻은 아닙니다."
      canvasClassName="max-h-[min(28rem,calc(100dvh-20rem))] overflow-y-auto"
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
        <Boundary label="학습 대상" value="velocity/noise target와 component별 objective" />
        <Boundary label="병목" value="latent token 수 × network 호출 수 × model width" />
        <Boundary label="월드모델에 없는 것" value="action·time·next-state transition" />
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
