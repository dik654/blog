import VizFrame from "@/components/viz/VizFrame";
import { RecurrentSceneControls } from "./RecurrentVizControls";
import { useRecurrentScenes } from "./useRecurrentScenes";

const SCENES = [
  { label: "역방향 합산", note: "같은 W가 세 시점에 쓰였으므로 contribution 2, −1, 3을 한 update 전에 더해 ∂L/∂W=4로 만듭니다." },
  { label: "Jacobian 배율", note: "먼 state의 책임은 local derivative를 차례대로 통과합니다. 0.5가 열 번 반복되면 약 0.00098만 남습니다." },
  { label: "detach 경계", note: "h₁₂₈ 값은 다음 chunk로 넘기지만 이전 graph와의 derivative edge는 끊습니다." },
] as const;

export default function BPTTLearningFlowViz() {
  const scenes = useRecurrentScenes(SCENES.length);
  return <VizFrame eyebrow="같은 시간축을 뒤에서 앞으로 읽습니다" title="Forward state는 이어지고 backward credit은 선택한 경계까지만 돌아갑니다" description="공유 weight의 책임 합산, 반복 Jacobian의 배율, truncated BPTT의 value-carry와 graph-detach를 분리합니다." note="Gradient clipping은 큰 update를 제한하지만 작아진 장기 신호를 되살리지는 않습니다.">
    <div id={scenes.playbackId} data-viz-canvas tabIndex={0} role="group" aria-label="BPTT gradient and truncation animation" onKeyDown={scenes.onKeyDown} className="overflow-hidden outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <SceneIndex active={scenes.active} />
      <div className="grid min-h-72 place-items-center border border-primary bg-primary/[.05] px-3 py-5">
        {scenes.active === 0 ? <GradientSum /> : null}
        {scenes.active === 1 ? <JacobianScale /> : null}
        {scenes.active === 2 ? <DetachBoundary /> : null}
        <p aria-live="polite" className="mt-5 max-w-2xl text-center text-xs leading-5 text-muted-foreground">{SCENES[scenes.active].note}</p>
      </div>
      <ol className="sr-only">{SCENES.map((scene, index) => <li key={scene.label}>{index + 1}. {scene.label}: {scene.note}</li>)}</ol>
      <RecurrentSceneControls {...scenes} labels={SCENES.map((scene) => scene.label)} />
    </div>
  </VizFrame>;
}

function SceneIndex({ active }: { active: number }) {
  return <div className="mb-3 grid grid-cols-3 gap-px bg-border p-px">{SCENES.map((scene, index) => <div key={scene.label} className={`bg-background px-1 py-2 text-center ${index === active ? "text-primary" : "text-muted-foreground"}`}><span className="font-mono text-[9px]">0{index + 1}</span><strong className="mt-1 block break-keep text-[10px]">{scene.label}</strong></div>)}</div>;
}

function GradientSum() {
  return <div className="w-full max-w-2xl"><div className="grid grid-cols-3 gap-px bg-border p-px text-center">{["t₁ · +2", "t₂ · −1", "t₃ · +3"].map((value) => <div key={value} className="bg-background px-2 py-5 font-mono text-sm font-bold">{value}</div>)}</div><p className="mt-5 border-l-2 border-primary pl-4 font-mono text-sm font-bold">∂L/∂W = 2 − 1 + 3 = <span className="text-primary">4</span></p></div>;
}

function JacobianScale() {
  const values = [["0.5¹", ".5"], ["0.5²", ".25"], ["0.5⁵", ".031"], ["0.5¹⁰", ".00098"]] as const;
  return <div className="grid w-full grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">{values.map(([power, value]) => <div key={power} className="bg-background px-2 py-5 text-center"><p className="font-mono text-sm font-bold">{power}</p><p className="mt-2 font-mono text-xs text-primary">{value}</p></div>)}</div>;
}

function DetachBoundary() {
  return <div className="grid w-full gap-3 sm:grid-cols-[1fr_auto_1fr]"><div className="border border-border bg-background p-5 text-center"><p className="font-bold">chunk A</p><p className="mt-2 font-mono text-xs">h₀ … h₁₂₈</p></div><div className="flex flex-col items-center justify-center"><span className="text-primary">state 값 →</span><span className="my-2 h-8 border-l border-dashed border-rose-500"/><span className="text-xs text-rose-600">gradient ✕</span></div><div className="border border-border bg-background p-5 text-center"><p className="font-bold">chunk B</p><p className="mt-2 font-mono text-xs">detach(h₁₂₈) …</p></div></div>;
}
