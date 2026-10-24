import VizFrame from "@/components/viz/VizFrame";
import { RecurrentSceneControls } from "./RecurrentVizControls";
import { useRecurrentScenes } from "./useRecurrentScenes";

const SCENES = [
  { label: "shift pair", note: "[BOS, 나, 간다, EOS]를 입력과 한 칸 앞선 정답으로 나누면 세 개의 학습 pair가 생깁니다." },
  { label: "state→분포", note: "Prefix를 접은 hₜ를 vocabulary logit으로 펼치고 softmax로 다음-token probability를 만듭니다." },
  { label: "loss→PPL", note: "정답 probability만 골라 NLL을 계산하고 valid token 평균을 exp해 같은 조건의 PPL로 읽습니다." },
] as const;

export default function RNNLanguageFlowViz() {
  const scenes = useRecurrentScenes(SCENES.length);
  return (
    <VizFrame eyebrow="한 문장을 예측 학습 자료로 바꿉니다" title="BOS→나, 나→간다, 간다→EOS가 probability·loss·PPL로 이어집니다" description="한 장면씩 넘기며 같은 token sequence가 model input, 다음-token distribution, 평가값으로 바뀌는 경로를 봅니다." note="예시 확률은 계산 경로를 보여 주기 위한 값입니다. 실제 PPL 비교에는 같은 corpus·tokenizer·mask가 필요합니다.">
      <div id={scenes.playbackId} data-viz-canvas tabIndex={0} role="group" aria-label="RNN language model objective animation" onKeyDown={scenes.onKeyDown} className="overflow-hidden outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <SceneIndex active={scenes.active} />
        <div className="grid min-h-72 place-items-center border border-primary bg-primary/[.05] px-3 py-5">
          {scenes.active === 0 ? <ShiftPairs /> : null}
          {scenes.active === 1 ? <StateToDistribution /> : null}
          {scenes.active === 2 ? <LossToPerplexity /> : null}
          <p aria-live="polite" className="mt-5 max-w-2xl text-center text-xs leading-5 text-muted-foreground">{SCENES[scenes.active].note}</p>
        </div>
        <ol className="sr-only">{SCENES.map((scene, index) => <li key={scene.label}>{index + 1}. {scene.label}: {scene.note}</li>)}</ol>
        <RecurrentSceneControls {...scenes} labels={SCENES.map((scene) => scene.label)} />
      </div>
    </VizFrame>
  );
}

function SceneIndex({ active }: { active: number }) {
  return <div className="mb-3 grid grid-cols-3 gap-px bg-border p-px">{SCENES.map((scene, index) => <div key={scene.label} className={`bg-background px-1 py-2 text-center ${index === active ? "text-primary" : "text-muted-foreground"}`}><span className="font-mono text-[9px]">0{index + 1}</span><strong className="mt-1 block break-keep text-[10px]">{scene.label}</strong></div>)}</div>;
}

function ShiftPairs() {
  const pairs = [["BOS", "나"], ["나", "간다"], ["간다", "EOS"]] as const;
  return <div className="grid w-full gap-3 sm:grid-cols-3">{pairs.map(([input, target]) => <div key={`${input}-${target}`} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border border-border bg-background px-3 py-5 text-center"><div><p className="text-[10px] text-muted-foreground">입력</p><strong className="mt-1 block">{input}</strong></div><span className="text-primary">→</span><div><p className="text-[10px] text-muted-foreground">정답</p><strong className="mt-1 block text-primary">{target}</strong></div></div>)}</div>;
}

function StateToDistribution() {
  return <div className="grid w-full items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1.3fr]"><Node label="읽은 prefix" value="BOS · 나" /><Arrow /><Node label="현재 state" value="h₂" /><Arrow /><div className="space-y-3 border border-border bg-background p-4"><ProbabilityBar label="간다" value="68%" width="68%" /><ProbabilityBar label="본다" value="21%" width="21%" /><ProbabilityBar label="기타" value="11%" width="11%" /></div></div>;
}

function LossToPerplexity() {
  const steps = [["정답 확률", "0.25"], ["token NLL", "−ln .25"], ["평균 NLL", "ln 4"], ["PPL", "4"]] as const;
  return <div className="grid w-full grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">{steps.map(([label, value], index) => <div key={label} className="bg-background px-2 py-5 text-center"><p className="text-[10px] text-muted-foreground">0{index + 1} · {label}</p><strong className="mt-2 block font-mono text-sm text-primary">{value}</strong></div>)}</div>;
}

function Node({ label, value }: { label: string; value: string }) {
  return <div className="border border-border bg-background p-5 text-center"><p className="text-[10px] text-muted-foreground">{label}</p><strong className="mt-2 block font-mono">{value}</strong></div>;
}

function ProbabilityBar({ label, value, width }: { label: string; value: string; width: string }) {
  return <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 text-[11px]"><span>{label}</span><span className="h-2 bg-muted"><span className="block h-full bg-primary" style={{ width }} /></span><span className="text-right font-mono">{value}</span></div>;
}

function Arrow() {
  return <span aria-hidden="true" className="hidden text-primary sm:block">→</span>;
}
