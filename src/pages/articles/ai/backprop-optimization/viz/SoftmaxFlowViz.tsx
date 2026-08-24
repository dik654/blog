import VizFrame from "@/components/viz/VizFrame";
import { BackpropSceneControls } from "./BackpropVizControls";
import { useBackpropScenes } from "./useBackpropScenes";

const SCENES = ["공동 분모", "temperature", "출력 경계"] as const;
const BASE = [2, 1, 0.5];

export default function SoftmaxFlowViz() {
  const scenes = useBackpropScenes(SCENES.length);
  const probabilities = scenes.active === 1 ? [0.51, 0.31, 0.18] : [0.57, 0.29, 0.14];
  return (
    <VizFrame eyebrow="Animated normalization" title="세 score가 하나의 분모를 공유해 서로 경쟁한다" description="지수 weight, temperature, categorical output 경계를 도형과 bar로 분리해 봅니다." note="Softmax는 각 class를 독립적으로 켜는 switch가 아닙니다. 한 class의 몫이 늘면 다른 class의 몫이 줄어드는 공동 예산입니다.">
      <div data-viz-canvas tabIndex={0} role="group" aria-label="Softmax normalization animation" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1.25fr] lg:items-center">
          <div className="space-y-2">{BASE.map((value,index)=><div key={value} className={`flex items-center justify-between border p-3 ${scenes.active===0?"border-primary bg-primary/10":"border-border"}`}><span className="text-xs text-muted-foreground">class {index+1} logit</span><span className="font-mono font-black">{value}</span></div>)}</div>
          <div className="text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary bg-primary/10 text-center text-xs font-bold">exp<br/>÷ 합계</div><p className="mt-2 text-[10px] text-muted-foreground">공동 분모</p></div>
          <div className="space-y-3">{probabilities.map((value,index)=><div key={index}><div className="mb-1 flex justify-between text-xs"><span>class {index+1}</span><span className="font-mono">{Math.round(value*100)}%</span></div><div className="h-6 border border-border bg-muted/20"><div className="h-full bg-primary/70 transition-[width] duration-500" style={{width:`${value*100}%`}} /></div></div>)}</div>
        </div>
        <div className={`mt-6 grid gap-3 sm:grid-cols-2 ${scenes.active===2?"opacity-100":"opacity-55"}`}><div className={`border p-4 ${scenes.active===2?"border-emerald-500 bg-emerald-500/10":"border-border"}`}><p className="font-bold">서로 배타적</p><p className="mt-2 text-xs text-muted-foreground">고양이 또는 개 또는 새 → softmax 한 개</p></div><div className={`border p-4 ${scenes.active===2?"border-amber-500 bg-amber-500/10":"border-border"}`}><p className="font-bold">동시에 여러 label</p><p className="mt-2 text-xs text-muted-foreground">실내이면서 야간 → class별 sigmoid</p></div></div>
        <BackpropSceneControls {...scenes} labels={SCENES}/>
      </div>
    </VizFrame>
  );
}
