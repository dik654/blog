import VizFrame from "@/components/viz/VizFrame";
import { RecurrentSceneControls, useRecurrentScenes } from "./RecurrentVizControls";

const SCENES = ["state 만들기", "시간축 펼치기", "방향 경계"] as const;

export default function RecurrentStateFlowViz() {
  const scenes = useRecurrentScenes(SCENES.length);
  const tokens = ["개가", "사람을", "물었다"];

  return (
    <VizFrame
      eyebrow="Animated recurrent state"
      title="입력 하나와 이전 state 하나가 다음 state 하나를 만든다"
      description="먼저 cell의 두 입력을 보고, 같은 cell이 시간축에서 반복되는 형태와 causal·bidirectional 경계를 차례로 확인합니다."
      note="Hidden state는 원문 저장소가 아니라 정해진 H개 좌표로 계속 덮어쓰는 손실 압축입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="RNN state and time unrolling animation"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="grid gap-5 lg:grid-cols-[0.8fr_auto_1.15fr] lg:items-center">
          <div className={`border p-5 ${scenes.active === 0 ? "border-primary bg-primary/10" : "border-border"}`}>
            <p className="text-xs font-bold text-muted-foreground">두 입력</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Node label="현재 관측" value="xₜ" />
              <Node label="직전 요약" value="hₜ₋₁" />
            </div>
          </div>
          <div aria-hidden="true" className="text-center text-2xl text-primary">→</div>
          <div className={`border p-5 ${scenes.active === 0 ? "border-primary bg-primary/10" : "border-border"}`}>
            <p className="text-xs font-bold text-muted-foreground">공유 cell fθ</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary font-mono font-black">tanh</div>
              <span className="text-xl text-primary">→</span>
              <Node label="새 요약" value="hₜ" />
            </div>
          </div>
        </div>

        <div className={`mt-6 border p-5 ${scenes.active === 1 ? "border-primary bg-primary/10" : "border-border"}`}>
          <p className="text-xs font-bold text-muted-foreground">한 cell을 시간 순서로 펼친 모습</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {tokens.map((token, index) => (
              <div key={token} className="relative border border-border bg-background p-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-sky-500 text-xs font-bold">x{index + 1}</div>
                <p className="mt-2 text-xs text-muted-foreground">{token}</p>
                <div className="mx-auto my-3 h-5 w-px bg-border" />
                <div className="border border-primary px-3 py-3 font-mono text-sm font-bold">h{index + 1}</div>
                {index < tokens.length - 1 ? <span className="absolute -right-3 top-[4.7rem] z-10 text-primary">→</span> : null}
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs font-bold text-primary">Wₓₕ · Wₕₕ · bₕ는 세 장면이 모두 공유</p>
        </div>

        <div className={`mt-6 grid gap-4 sm:grid-cols-2 ${scenes.active === 2 ? "opacity-100" : "opacity-60"}`}>
          <div className={`border p-4 ${scenes.active === 2 ? "border-emerald-500 bg-emerald-500/10" : "border-border"}`}>
            <p className="font-bold">Causal</p>
            <p className="mt-3 font-mono text-sm">h₁ → h₂ → h₃</p>
            <p className="mt-2 text-xs text-muted-foreground">streaming·next-token generation 가능</p>
          </div>
          <div className={`border p-4 ${scenes.active === 2 ? "border-amber-500 bg-amber-500/10" : "border-border"}`}>
            <p className="font-bold">Bidirectional</p>
            <p className="mt-3 font-mono text-sm">→ hₜ ←</p>
            <p className="mt-2 text-xs text-muted-foreground">전체 sequence가 있어야 하며 미래 정보가 섞임</p>
          </div>
        </div>
        <RecurrentSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

function Node({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 border border-border bg-background p-3 text-center"><p className="text-[11px] text-muted-foreground">{label}</p><p className="mt-2 font-mono text-lg font-black">{value}</p></div>;
}
