import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["encode", "condition", "denoise", "decode · release"] as const;

export default function LatentPipelineViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const a = scenes.active;
  const nodes = [
    ["pixel x", "512×512×3", "input·reference"],
    ["latent z", "64×64×4", "lossy bottleneck"],
    ["guided denoiser", "text + timestep", "two prediction branches"],
    ["decoded x̂", "pixel output", "quality·coverage gate"],
  ] as const;
  return (
    <VizFrame
      eyebrow="Animated latent generation pipeline"
      title="Pixel을 압축한 뒤 condition 방향을 더하고, 마지막에 다시 pixel로 복원한다"
      description="Encoder·denoiser·sampler·decoder가 서로 다른 artifact와 failure를 소유합니다. 제품 이름 하나로 이 경계를 지우지 않습니다."
      note="모든 component revision과 latent scaling이 generation receipt의 일부입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="latent diffusion component pipeline 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="grid gap-3 md:grid-cols-4">
          {nodes.map(([title, shape, detail], i) => (
            <div
              key={title}
              className={`relative min-w-0 border px-4 py-5 ${a === i ? "border-primary bg-primary/5" : "border-border bg-background"}`}
            >
              <p className="text-xs font-black text-primary">0{i + 1}</p>
              <p className="mt-2 font-black">{title}</p>
              <p className="mt-2 font-mono text-xs">{shape}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {detail}
              </p>
              {i < nodes.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute -bottom-3 left-1/2 text-primary md:-right-3 md:bottom-auto md:left-auto md:top-1/2"
                >
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Ledger
            label="compression receipt"
            value="shape · scale · reconstruction"
            active={a === 0}
          />
          <Ledger
            label="guidance receipt"
            value="condition · w · branch batching"
            active={a === 1 || a === 2}
          />
          <Ledger
            label="release receipt"
            value="quality · diversity · latency"
            active={a === 3}
          />
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
function Ledger({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={`border-l pl-4 ${active ? "border-primary" : "border-border"}`}
    >
      <p className="text-xs font-black">{label}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{value}</p>
    </div>
  );
}
