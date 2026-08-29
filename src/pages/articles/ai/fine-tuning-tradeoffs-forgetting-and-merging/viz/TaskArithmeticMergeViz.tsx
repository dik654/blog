import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: base에서 갈라진 두 fine-tuned checkpoint의 task vector를
 * 뽑아 더해서 새 checkpoint를 만드는 task arithmetic 절차.
 */
const SCENES = [
  "01 base와 두 fine-tuned checkpoint",
  "02 task vector 추출",
  "03 벡터 합산과 스케일",
  "04 합친 checkpoint 완성",
] as const;

const NOTES = [
  "같은 base θ_pre에서 domain 데이터로 학습한 checkpoint와 style 데이터로 학습한 checkpoint가 서로 다른 방향으로 이동합니다.",
  "각 checkpoint에서 base를 빼면 그 checkpoint만의 이동 방향(task vector) τ_domain, τ_style만 남습니다.",
  "두 task vector를 좌표별로 더하고 λ=1을 곱합니다. 평균과 달리 두 방향이 서로를 무디게 하지 않고 그대로 보존됩니다.",
  "θ_new = θ_pre + λ(τ_domain + τ_style) = (0.5, 0.3). 한 checkpoint가 domain 지식과 style 변화를 동시에 갖습니다.",
] as const;

const BASE = { x: 0, y: 0 };
const TAU_DOMAIN = { x: 0.6, y: -0.2 };
const TAU_STYLE = { x: -0.1, y: 0.5 };
const COMBINED = { x: TAU_DOMAIN.x + TAU_STYLE.x, y: TAU_DOMAIN.y + TAU_STYLE.y };
const MERGED = { x: BASE.x + COMBINED.x, y: BASE.y + COMBINED.y };

function fmt(value: number) {
  return value >= 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
}

function VectorCard({
  label,
  point,
  tone,
}: {
  label: string;
  point: { x: number; y: number };
  tone: "muted" | "domain" | "style" | "merged";
}) {
  const toneClass =
    tone === "domain"
      ? "border-primary/60 bg-primary/5 text-foreground"
      : tone === "style"
        ? "border-foreground/40 bg-foreground/5 text-foreground"
        : tone === "merged"
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-muted/40 text-muted-foreground";
  return (
    <div className={`flex min-h-20 flex-col items-center justify-center gap-1 border px-3 py-2 text-center ${toneClass}`}>
      <p className="text-[11px] font-bold">{label}</p>
      <p className="font-mono text-sm">
        ({fmt(point.x)}, {fmt(point.y)})
      </p>
    </div>
  );
}

export default function TaskArithmeticMergeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="Task arithmetic"
      title="여러 fine-tuning의 delta를 벡터 합으로 합칩니다"
      description="2차원 toy 예에서 base·domain fine-tuned·style fine-tuned checkpoint가 task vector를 거쳐 하나의 checkpoint로 합쳐지는 과정입니다."
      note="실제 모델은 수십억 차원이며 여기서는 좌표 두 개로만 단순화했습니다. 방향 간섭이 없는 이상적인 경우만 보여 줍니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Task arithmetic model merging"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[24rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[active]}</h4>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <VectorCard label="θ_pre (base)" point={BASE} tone="muted" />
            <VectorCard
              label={active === 0 ? "θ_ft domain" : "τ_domain"}
              point={active === 0 ? { x: BASE.x + TAU_DOMAIN.x, y: BASE.y + TAU_DOMAIN.y } : TAU_DOMAIN}
              tone="domain"
            />
            <VectorCard
              label={active === 0 ? "θ_ft style" : "τ_style"}
              point={active === 0 ? { x: BASE.x + TAU_STYLE.x, y: BASE.y + TAU_STYLE.y } : TAU_STYLE}
              tone="style"
            />
          </div>

          {active >= 2 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <VectorCard label="τ_domain + τ_style" point={COMBINED} tone="merged" />
              {active >= 3 && (
                <VectorCard label="θ_new = θ_pre + Σ" point={MERGED} tone="merged" />
              )}
            </div>
          )}

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
