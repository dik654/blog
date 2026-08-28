import VizFrame from "@/components/viz/VizFrame";

const blocks = [
  ["Latent grid", "h × w × c"],
  ["Patch projection", "N tokens × d"],
  ["DiT blocks", "attention + FFN"],
  ["Output projection", "N × patch payload"],
  ["Unpatchify", "v̂ₜ 또는 ε̂ₜ"],
] as const;

export default function DiffusionTransformerBlockViz() {
  return (
    <VizFrame
      eyebrow="Diffusion Transformer"
      title="DiT는 noisy latent를 token sequence로 바꾼 뒤 같은 shape의 복원 방향을 되돌려 놓습니다"
      description="Transformer가 직접 image file을 생성하는 것이 아닙니다. 한 sampling step에서 noisy latent·time·condition을 읽고 다음 solver update에 쓸 velocity 또는 noise tensor를 냅니다."
      note="원 DiT의 class-conditioning ablation과 현대 text-to-image의 multimodal stream은 같은 architecture가 아닙니다. 이 Viz는 공통 tensor contract만 보여 줍니다."
    >
      <div data-viz-canvas className="flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
        {blocks.map(([title, shape], index) => (
          <div key={title} className="contents">
            <div className="w-[min(72vw,220px)] shrink-0 snap-start rounded-lg border border-border bg-background p-4 md:w-auto md:min-w-0">
              <p className="text-[11px] font-black text-primary">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-2 text-sm font-bold leading-6">{title}</p>
              <p className="mt-2 break-words font-mono text-xs leading-5 text-muted-foreground">{shape}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 border-t border-border pt-5 md:grid-cols-3">
        <Condition label="Time" value="t → scale·shift·gate modulation" />
        <Condition label="Text/image condition" value="cross-attention 또는 joint stream" />
        <Condition label="Position" value="2D/3D position encoding으로 token 위치 보존" />
      </div>
    </VizFrame>
  );
}

function Condition({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-primary/45 pl-4">
      <p className="text-xs font-black">{label}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{value}</p>
    </div>
  );
}
