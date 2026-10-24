import VizFrame from "@/components/viz/VizFrame";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

const SCENES = [
  { label: "한 번 갱신", value: "0 + 0.5×1 → 0.462", note: "h₀=0과 x₁=1을 같은 transition에 넣으면 h₁=tanh(0.5)≈0.462가 됩니다." },
  { label: "세 번 반복", value: "0.462 → 0.354 → 0.654", note: "입력 1→0→1을 순서대로 넣습니다. x₂가 0이어도 h₁의 흔적 때문에 h₂는 0이 아닙니다." },
  { label: "한 벌 공유", value: "Wₓₕ=0.5 · Wₕₕ=0.8", note: "세 칸은 다른 layer가 아닙니다. 같은 두 weight를 세 번 호출하고 h 값만 바뀝니다." },
  { label: "방향 경계", value: "causal ≠ bidirectional", note: "왼쪽 state만 쓰면 streaming이 가능하지만, 역방향 state를 합치면 문장 전체가 먼저 필요합니다." },
] as const;

export default function RecurrentStateFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200, { loop: false });

  return (
    <VizFrame
      eyebrow="입력 1 → 0 → 1을 끝까지 추적합니다"
      title="같은 계산을 세 번 호출하면 state가 0 → 0.462 → 0.354 → 0.654로 바뀝니다"
      description="먼저 숫자의 이동을 본 뒤 state, shared weight, causal이라는 이름을 붙입니다."
      note="모든 수치는 hₜ=tanh(0.8hₜ₋₁+0.5xₜ)인 교육용 스칼라 가정입니다. 실제 RNN에서는 x와 h가 벡터입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="RNN state and time unrolling animation"
        onKeyDown={scenes.onKeyDown}
        className="overflow-hidden outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="mb-3 grid grid-cols-4 gap-px bg-border p-px" aria-label="RNN 상태 추적의 네 장면">
          {SCENES.map((scene, index) => (
            <div key={scene.label} className={`min-w-0 bg-background px-1 py-2 text-center ${scenes.active === index ? "text-primary" : "text-muted-foreground"}`}>
              <span className="font-mono text-[9px]">0{index + 1}</span>
              <strong className="mt-1 block break-keep text-[9px] leading-4 sm:text-[10px]">{scene.label}</strong>
            </div>
          ))}
        </div>

        <div className="grid min-h-64 place-items-center border border-primary bg-primary/[.05] px-3 py-5">
          {scenes.active === 0 ? <div>
          <p className="mb-5 text-center text-xs font-bold text-muted-foreground">첫 입력을 state에 반영</p>
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <CircleNode label="현재 입력" value="x₁=1" tone="sky" />
              <span className="text-lg text-primary">+</span>
              <CircleNode label="직전 state" value="h₀=0" tone="amber" />
            </div>
            <FlowArrow />
            <div className="flex h-20 w-20 rotate-45 items-center justify-center border border-primary bg-primary/10 sm:h-24 sm:w-24">
              <div className="-rotate-45 text-center">
                <p className="font-mono text-sm font-black">tanh</p>
                <p className="mt-1 text-[10px] text-muted-foreground">0.8h+0.5x</p>
              </div>
            </div>
            <FlowArrow />
            <CircleNode label="새 state" value="h₁=.462" tone="emerald" />
          </div>
          </div> : null}

          {scenes.active === 1 ? <StateRail /> : null}

          {scenes.active === 2 ? <div className="w-full max-w-2xl">
            <p className="text-center text-xs font-bold text-muted-foreground">값은 세 번 만들어지지만 parameter는 늘지 않습니다</p>
            <div className="mt-6 grid grid-cols-3 gap-px bg-border p-px text-center">
              {["t=1 · h₁=.462", "t=2 · h₂=.354", "t=3 · h₃=.654"].map((label) => <div key={label} className="bg-background px-2 py-5 font-mono text-xs font-bold">{label}</div>)}
            </div>
            <div className="mt-5 border-l-2 border-primary pl-4 text-sm leading-6"><strong className="text-primary">모두 같은 식</strong><span className="ml-2 font-mono">tanh(0.8hₜ₋₁+0.5xₜ)</span></div>
          </div>
          : null}

          {scenes.active === 3 ? <div className="w-full">
          <p className="mb-5 text-center text-xs font-bold text-muted-foreground">어느 입력까지 볼 수 있는지가 사용 가능한 상황을 정합니다</p>
          <div className="grid gap-7 sm:grid-cols-2 sm:gap-10">
            <DirectionRail label="Causal · 지금까지의 입력만 사용" arrows={["→", "→"]} />
            <DirectionRail label="Bidirectional · 미래 방향도 사용" arrows={["↔", "↔"]} />
          </div>
          </div> : null}

          <p aria-live="polite" className="mt-6 max-w-2xl text-center text-xs leading-5 text-muted-foreground"><strong className="text-primary">{SCENES[scenes.active].value}</strong><span className="mx-2">·</span>{SCENES[scenes.active].note}</p>
        </div>

        <ol className="sr-only">{SCENES.map((scene, index) => <li key={scene.label}>{index + 1}. {scene.label}: {scene.value}. {scene.note}</li>)}</ol>
        <AnimatedSceneControls labels={SCENES.map((scene) => scene.label)} active={scenes.active} playing={scenes.playing} reducedMotion={scenes.reducedMotion} setActive={scenes.setActive} setPlaying={scenes.setPlaying} />
      </div>
    </VizFrame>
  );
}

function CircleNode({ label, value, tone }: { label: string; value: string; tone: "sky" | "amber" | "emerald" }) {
  const colors = { sky: "border-sky-500 bg-sky-500/10", amber: "border-amber-500 bg-amber-500/10", emerald: "border-emerald-500 bg-emerald-500/10" };
  return <div className="text-center"><div className={`relative flex h-16 w-16 items-center justify-center rounded-full border sm:h-20 sm:w-20 ${colors[tone]}`}><span className="font-mono text-xs font-black sm:text-sm">{value}</span></div><p className="mt-1 text-[10px] text-muted-foreground sm:mt-2 sm:text-[11px]">{label}</p></div>;
}

function FlowArrow() {
  return <div aria-hidden="true" className="flex rotate-90 items-center text-primary sm:rotate-0"><span className="h-px w-4 bg-primary sm:w-12" /><span className="text-xl">→</span></div>;
}

function StateRail() {
  const steps = [["x₁=1", "h₁=.462"], ["x₂=0", "h₂=.354"], ["x₃=1", "h₃=.654"]] as const;
  return <div className="grid w-full gap-4 sm:grid-cols-3">{steps.map(([input, state], index) => <div key={input} className="relative border-l-2 border-primary pl-3"><p className="font-mono text-xs text-muted-foreground">{input}</p><p className="mt-2 font-mono text-base font-black text-primary">{state}</p><p className="mt-1 text-[10px] text-muted-foreground">{index === 0 ? "첫 흔적 생성" : index === 1 ? "입력이 0이어도 흔적 유지" : "이전 흔적과 새 입력 결합"}</p></div>)}</div>;
}

function DirectionRail({ label, arrows }: { label: string; arrows: string[] }) {
  return <div><div className="flex items-center justify-center gap-2">{[1, 2, 3].map((step, index) => <span key={step} className="contents"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary/10">h{step}</span>{index < 2 ? <span className="text-primary">{arrows[index]}</span> : null}</span>)}</div><p className="mt-3 text-center text-xs font-bold">{label}</p></div>;
}
