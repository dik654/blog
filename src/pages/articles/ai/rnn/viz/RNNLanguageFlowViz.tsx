import VizFrame from "@/components/viz/VizFrame";
import { RecurrentSceneControls, useRecurrentScenes } from "./RecurrentVizControls";

const SCENES = ["shift pair", "state→분포", "loss→PPL"] as const;

export default function RNNLanguageFlowViz() {
  const scenes = useRecurrentScenes(SCENES.length);
  const pairs = [["BOS", "나"], ["나", "간다"], ["간다", "EOS"]];
  return (
    <VizFrame eyebrow="Animated RNN language objective" title="같은 token 줄을 입력과 정답으로 한 칸 어긋나게 본다" description="Shift pair가 state와 vocabulary distribution을 만들고, 정답 probability가 NLL과 perplexity로 집계되는 순서를 보여 줍니다.">
      <div data-viz-canvas tabIndex={0} role="group" aria-label="RNN language model objective animation" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div className={`border p-5 ${scenes.active === 0 ? "border-primary bg-primary/10" : "border-border"}`}>
          <div className="grid grid-cols-3 gap-3">
            {pairs.map(([input, target], index) => <div key={input + target} className="border border-border bg-background p-3 text-center"><p className="text-[10px] text-muted-foreground">PAIR {index + 1}</p><p className="mt-2 font-mono text-sm"><span className="text-sky-600">{input}</span> <span className="text-primary">→</span> <span className="text-emerald-600">{target}</span></p></div>)}
          </div>
        </div>
        <div className="my-4 text-center text-2xl text-primary">↓</div>
        <div className={`grid gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1.2fr] sm:items-center ${scenes.active === 1 ? "opacity-100" : "opacity-65"}`}>
          <Node label="Prefix" value="w₁:ₜ" /> <Arrow /> <Node label="Lossy state" value="hₜ" /> <Arrow />
          <div className="border border-border bg-background p-4"><p className="text-xs font-bold">Vocabulary probability</p><div className="mt-3 space-y-2"><Bar label="간다" width="68%" /><Bar label="본다" width="21%" /><Bar label="기타" width="11%" /></div></div>
        </div>
        <div className={`mt-5 grid gap-3 sm:grid-cols-3 ${scenes.active === 2 ? "opacity-100" : "opacity-60"}`}>
          <Node label="정답 확률" value="pₜ[wₜ₊₁]" /> <Node label="놀람" value="−log p" /> <Node label="같은 계약의 척도" value="exp(mean NLL)" />
        </div>
        <RecurrentSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
function Node({label,value}:{label:string;value:string}){return <div className="border border-border bg-background p-4 text-center"><p className="text-[11px] text-muted-foreground">{label}</p><p className="mt-2 font-mono text-sm font-bold">{value}</p></div>}
function Arrow(){return <span aria-hidden="true" className="hidden text-xl text-primary sm:block">→</span>}
function Bar({label,width}:{label:string;width:string}){return <div className="grid grid-cols-[3rem_1fr] items-center gap-2 text-[11px]"><span>{label}</span><div className="h-2 bg-muted"><div className="h-full bg-primary" style={{width}} /></div></div>}
