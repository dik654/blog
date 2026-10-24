import VizFrame from "@/components/viz/VizFrame";
import { RecurrentSceneControls } from "../../rnn/viz/RecurrentVizControls";
import { useRecurrentScenes } from "../../rnn/viz/useRecurrentScenes";

const SCENES = [
  { label: "reset", note: "hprev=(2,−1)에 r=(0,.5)를 곱하면 candidate가 볼 과거는 (0,−.5)가 됩니다." },
  { label: "candidate", note: "현재 입력 x와 reset-filtered history를 합쳐 새 내용 후보 h̃를 만듭니다. 아직 최종 state는 아닙니다." },
  { label: "update", note: "hprev=2, candidate=10, z=.25이면 .75×2+.25×10=4가 됩니다." },
  { label: "budget", note: "같은 D와 H에서 GRU는 affine block 3개·state H, LSTM은 block 4개·state 2H입니다." },
] as const;

export default function GRUFlowViz() {
  const scenes = useRecurrentScenes(SCENES.length);
  return <VizFrame eyebrow="한 state를 두 gate로 갱신합니다" title="Reset은 candidate용 과거를 고르고, update는 기존 state와 candidate를 섞습니다" description="두 gate가 서로 다른 선에 작용하는 과정을 숫자와 함께 장면별로 봅니다." note="GRU 식의 update convention과 reset 적용 위치는 구현마다 다를 수 있으므로 checkpoint를 옮길 때 실제 식을 확인해야 합니다.">
    <div id={scenes.playbackId} data-viz-canvas tabIndex={0} role="group" aria-label="GRU reset candidate and update animation" onKeyDown={scenes.onKeyDown} className="overflow-hidden outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <SceneIndex active={scenes.active} />
      <div className="grid min-h-72 place-items-center border border-primary bg-primary/[.05] px-3 py-5">
        {scenes.active === 0 ? <ResetHistory /> : null}
        {scenes.active === 1 ? <Candidate /> : null}
        {scenes.active === 2 ? <Update /> : null}
        {scenes.active === 3 ? <Budget /> : null}
        <p aria-live="polite" className="mt-5 max-w-2xl text-center text-xs leading-5 text-muted-foreground">{SCENES[scenes.active].note}</p>
      </div>
      <ol className="sr-only">{SCENES.map((scene, index) => <li key={scene.label}>{index + 1}. {scene.label}: {scene.note}</li>)}</ol>
      <RecurrentSceneControls {...scenes} labels={SCENES.map((scene) => scene.label)} />
    </div>
  </VizFrame>;
}

function SceneIndex({ active }: { active: number }) {
  return <div className="mb-3 grid grid-cols-4 gap-px bg-border p-px">{SCENES.map((scene, index) => <div key={scene.label} className={`bg-background px-1 py-2 text-center ${index === active ? "text-primary" : "text-muted-foreground"}`}><span className="font-mono text-[9px]">0{index + 1}</span><strong className="mt-1 block break-keep text-[9px] sm:text-[10px]">{scene.label}</strong></div>)}</div>;
}

function ResetHistory() {
  return <div className="grid w-full items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]"><Box label="이전 state" value="(2, −1)" note="hₜ₋₁"/><Arrow/><Box label="reset gate" value="(0, .5)" note="rₜ"/><Arrow/><Box label="허용된 과거" value="(0, −.5)" note="rₜ⊙hₜ₋₁"/></div>;
}

function Candidate() {
  return <div className="grid w-full items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]"><Box label="현재 입력" value="xₜ" note="새 evidence"/><Arrow/><Box label="허용된 과거" value="rₜ⊙hₜ₋₁" note="filtered history"/><Arrow/><Box label="새 내용 후보" value="h̃ₜ" note="tanh projection"/></div>;
}

function Update() {
  return <div className="w-full max-w-2xl"><div className="grid grid-cols-2 gap-px bg-border p-px"><Box label="기존 state 유지" value=".75×2=1.5" note="(1−z)hprev"/><Box label="candidate 기록" value=".25×10=2.5" note="z·candidate"/></div><p className="mt-4 border-l-2 border-primary pl-4 font-mono text-sm font-bold">hₜ = 1.5 + 2.5 = <span className="text-primary">4</span></p></div>;
}

function Budget() {
  return <div className="grid w-full gap-3 sm:grid-cols-2"><Box label="GRU" value="3H(D+H+1)" note="recurrent state H"/><Box label="LSTM" value="4H(D+H+1)" note="recurrent state 2H"/></div>;
}

function Box({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="border border-border bg-background p-4 text-center"><p className="text-[10px] text-muted-foreground">{label}</p><p className="mt-2 break-words font-mono text-sm font-black">{value}</p><p className="mt-2 text-[10px] text-muted-foreground">{note}</p></div>;
}

function Arrow() {
  return <span aria-hidden="true" className="hidden self-center text-primary sm:block">→</span>;
}
