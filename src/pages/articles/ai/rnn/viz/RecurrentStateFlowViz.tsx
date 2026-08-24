import VizFrame from "@/components/viz/VizFrame";
import { RecurrentSceneControls } from "./RecurrentVizControls";
import { useRecurrentScenes } from "./useRecurrentScenes";

const SCENES = ["state 만들기", "시간축 펼치기", "방향 경계"] as const;
const SCENE_COPY = [
  "현재 관측과 직전 요약이 같은 transition 안에서 만나 새 state가 됩니다.",
  "Cell 모양은 반복되지만 weight는 한 벌이고, state 값만 시간에 따라 달라집니다.",
  "미래 방향 화살표가 추가되는 순간 streaming에 쓸 수 없는 encoder가 됩니다.",
] as const;

export default function RecurrentStateFlowViz() {
  const scenes = useRecurrentScenes(SCENES.length);

  return (
    <VizFrame
      eyebrow="Animated recurrent state"
      title="하나의 state가 만들어지고, 시간축으로 흘러가는 모습을 본다"
      description="원형은 값, 마름모는 공유 계산, 선은 dependency입니다. 도형을 먼저 읽고 장면을 넘기면 용어가 붙는 순서가 보입니다."
      note="Hidden state는 원문 저장소가 아니라 정해진 H개 좌표로 계속 갱신되는 손실 압축입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="RNN state and time unrolling animation"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <p aria-live="polite" className="mb-7 border-l border-primary pl-4 text-sm leading-6">
          <span className="block text-xs font-bold text-primary">장면 {String(scenes.active + 1).padStart(2, "0")}</span>
          {SCENE_COPY[scenes.active]}
        </p>

        <div className={`transition-opacity ${scenes.active === 0 ? "opacity-100" : "opacity-45"}`}>
          <p className="mb-5 text-xs font-bold text-muted-foreground">한 timestep의 도형</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <div className="flex items-center gap-3">
              <CircleNode label="현재 관측" value="xₜ" tone="sky" active={scenes.active === 0} />
              <span className="text-lg text-primary">+</span>
              <CircleNode label="직전 요약" value="hₜ₋₁" tone="amber" active={scenes.active === 0} />
            </div>
            <FlowArrow active={scenes.active === 0} />
            <div className="flex h-24 w-24 rotate-45 items-center justify-center border border-primary bg-primary/10">
              <div className="-rotate-45 text-center">
                <p className="font-mono text-lg font-black">fθ</p>
                <p className="mt-1 text-[10px] text-muted-foreground">공유 transition</p>
              </div>
            </div>
            <FlowArrow active={scenes.active === 0} />
            <CircleNode label="새 요약" value="hₜ" tone="emerald" active={scenes.active === 0} />
          </div>
        </div>

        <div className={`mt-10 border-t border-border pt-7 transition-opacity ${scenes.active === 1 ? "opacity-100" : "opacity-45"}`}>
          <p className="mb-5 text-xs font-bold text-muted-foreground">같은 cell을 세 번 호출한 시간 rail</p>
          <div className="grid gap-6 sm:grid-cols-3 sm:gap-3">
            {["개가", "사람을", "물었다"].map((token, index) => (
              <div key={token} className="relative flex items-center sm:flex-col">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sky-500 bg-sky-500/10 font-mono text-sm font-black">
                  x{index + 1}
                </div>
                <div className="mx-3 h-px flex-1 bg-border sm:mx-0 sm:my-2 sm:h-5 sm:w-px sm:flex-none" />
                <div className="flex h-14 min-w-28 items-center justify-center border border-primary bg-background font-mono font-black">
                  h{index + 1}
                </div>
                <p className="ml-3 text-xs text-muted-foreground sm:ml-0 sm:mt-2">{token}</p>
                {index < 2 ? <span className="absolute -bottom-5 left-5 text-primary sm:bottom-auto sm:left-auto sm:right-1 sm:top-[4.4rem]"><span className="sm:hidden">↓</span><span className="hidden sm:inline">→</span></span> : null}
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-primary">
            {scenes.active === 1 ? <Pulse /> : null}
            Wₓₕ · Wₕₕ · bₕ는 모든 timestep이 공유
          </div>
        </div>

        <div className={`mt-10 border-t border-border pt-7 transition-opacity ${scenes.active === 2 ? "opacity-100" : "opacity-45"}`}>
          <p className="mb-5 text-xs font-bold text-muted-foreground">화살표 방향이 정하는 배포 경계</p>
          <div className="grid gap-7 sm:grid-cols-2 sm:gap-10">
            <DirectionRail label="Causal · streaming 가능" arrows={["→", "→"]} active={scenes.active === 2} />
            <DirectionRail label="Bidirectional · 전체 sequence 필요" arrows={["↔", "↔"]} active={scenes.active === 2} />
          </div>
        </div>

        <RecurrentSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

function CircleNode({ label, value, tone, active }: { label: string; value: string; tone: "sky" | "amber" | "emerald"; active: boolean }) {
  const colors = { sky: "border-sky-500 bg-sky-500/10", amber: "border-amber-500 bg-amber-500/10", emerald: "border-emerald-500 bg-emerald-500/10" };
  return <div className="text-center"><div className={`relative flex h-20 w-20 items-center justify-center rounded-full border ${colors[tone]}`}>{active ? <span className="absolute right-1 top-1"><Pulse /></span> : null}<span className="font-mono text-lg font-black">{value}</span></div><p className="mt-2 text-[11px] text-muted-foreground">{label}</p></div>;
}

function FlowArrow({ active }: { active: boolean }) {
  return <div aria-hidden="true" className="flex items-center text-primary"><span className="h-px w-8 bg-primary sm:w-12" />{active ? <Pulse /> : null}<span className="text-xl">→</span></div>;
}

function DirectionRail({ label, arrows, active }: { label: string; arrows: string[]; active: boolean }) {
  return <div><div className="flex items-center justify-center gap-2">{[1, 2, 3].map((step, index) => <span key={step} className="contents"><span className={`flex h-10 w-10 items-center justify-center rounded-full border ${active ? "border-primary bg-primary/10" : "border-border"}`}>h{step}</span>{index < 2 ? <span className="text-primary">{arrows[index]}</span> : null}</span>)}</div><p className="mt-3 text-center text-xs font-bold">{label}</p></div>;
}

function Pulse() {
  return <span aria-hidden="true" className="block h-2 w-2 animate-pulse rounded-full bg-primary" />;
}
