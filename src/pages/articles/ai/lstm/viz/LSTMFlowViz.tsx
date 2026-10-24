import VizFrame from "@/components/viz/VizFrame";
import { RecurrentSceneControls } from "../../rnn/viz/RecurrentVizControls";
import { useRecurrentScenes } from "../../rnn/viz/useRecurrentScenes";

const SCENES = [
  { label: "두 state", note: "C는 보존·쓰기 결과를 이어 가는 memory lane이고, h는 현재 cell을 읽어 밖과 다음 gate에 공개하는 값입니다." },
  { label: "보존·쓰기", note: "Cprev=2에서 f=.5가 1을 남기고, i=.75와 candidate=.5가 .375를 더해 C=1.375를 만듭니다." },
  { label: "공개", note: "o=.5는 완성된 cell을 그대로 복사하지 않고 tanh(1.375)의 절반인 h≈.44만 공개합니다." },
  { label: "직접 경로", note: "cell의 direct derivative에는 forget gate가 남습니다. f=.99가 100번 이어져도 .99¹⁰⁰≈.366으로 줄어듭니다." },
] as const;

export default function LSTMFlowViz() {
  const scenes = useRecurrentScenes(SCENES.length);
  return <VizFrame eyebrow="한 channel의 숫자를 끝까지 추적합니다" title="Cell 2에서 1을 남기고 0.375를 더해 C=1.375, h≈0.44를 만듭니다" description="두 state를 구분한 뒤 forget·input·output gate가 어느 값에 작용하는지 장면별로 봅니다." note="현대적인 no-peephole LSTM의 교육용 한 channel입니다. Framework별 gate order와 bias layout은 다를 수 있습니다.">
    <div id={scenes.playbackId} data-viz-canvas tabIndex={0} role="group" aria-label="LSTM state gate and gradient animation" onKeyDown={scenes.onKeyDown} className="overflow-hidden outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <SceneIndex active={scenes.active} />
      <div className="grid min-h-72 place-items-center border border-primary bg-primary/[.05] px-3 py-5">
        {scenes.active === 0 ? <TwoStates /> : null}
        {scenes.active === 1 ? <PreserveAndWrite /> : null}
        {scenes.active === 2 ? <ExposeHidden /> : null}
        {scenes.active === 3 ? <DirectPath /> : null}
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

function TwoStates() {
  return <div className="grid w-full gap-3 sm:grid-cols-[1fr_auto_1fr]"><State label="Cell memory lane" value="Cₜ₋₁ → Cₜ" note="보존하고 새 내용을 더함"/><span className="self-center text-center text-2xl text-primary">≠</span><State label="Exposed hidden" value="hₜ₋₁ → hₜ" note="cell에서 읽어 공개함"/></div>;
}

function PreserveAndWrite() {
  return <div className="w-full max-w-2xl"><div className="grid grid-cols-2 gap-px bg-border p-px"><State label="보존" value=".5 × 2 = 1" note="fₜ⊙Cₜ₋₁"/><State label="기록" value=".75 × .5 = .375" note="iₜ⊙gₜ"/></div><p className="mt-4 border-l-2 border-primary pl-4 font-mono text-sm font-bold">Cₜ = 1 + .375 = <span className="text-primary">1.375</span></p></div>;
}

function ExposeHidden() {
  return <div className="grid w-full items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]"><State label="완성된 cell" value="Cₜ=1.375" note="memory lane"/><Arrow/><State label="bounded read" value="tanh(Cₜ)" note="약 .88"/><Arrow/><State label="output gate" value="hₜ≈.44" note=".5 × .88"/></div>;
}

function DirectPath() {
  return <div className="w-full max-w-2xl"><div className="grid grid-cols-4 gap-px bg-border p-px">{["f₁", "× f₂", "× …", "× f₁₀₀"].map((value) => <div key={value} className="bg-background px-2 py-5 text-center font-mono text-sm font-bold">{value}</div>)}</div><p className="mt-4 border-l-2 border-primary pl-4 font-mono text-sm font-bold">.99¹⁰⁰ ≈ <span className="text-primary">.366</span></p></div>;
}

function State({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="border border-border bg-background p-4 text-center"><p className="text-[10px] text-muted-foreground">{label}</p><p className="mt-2 font-mono text-sm font-black">{value}</p><p className="mt-2 text-[10px] text-muted-foreground">{note}</p></div>;
}

function Arrow() {
  return <span aria-hidden="true" className="hidden self-center text-primary sm:block">→</span>;
}
