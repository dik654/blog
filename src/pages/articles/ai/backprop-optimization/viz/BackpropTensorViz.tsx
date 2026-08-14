import VizFrame from "@/components/viz/VizFrame";
import { BackpropSceneControls, useBackpropScenes } from "./BackpropVizControls";

const SCENES = ["loss seed", "tensor 분배", "책임 경계"] as const;

export default function BackpropTensorViz() {
  const scenes = useBackpropScenes(SCENES.length);
  return (
    <VizFrame eyebrow="Animated neural backward" title="scalar loss 하나가 error vector를 거쳐 세 tensor 책임으로 갈라진다" description="softmax–cross-entropy의 p−y와 linear layer의 dW·db·dX를 한 흐름에서 봅니다." note="Backpropagation은 gradient를 계산합니다. 그 gradient로 parameter를 언제 얼마나 바꿀지는 optimizer가 소유합니다.">
      <div data-viz-canvas tabIndex={0} role="group" aria-label="Neural network backpropagation animation" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div className="grid gap-3 sm:grid-cols-[0.75fr_auto_1fr_auto_1.35fr] sm:items-center">
          <Box active={scenes.active===0} label="scalar loss" value="L = 0.357" />
          <Arrow />
          <Box active={scenes.active<=1} label="logit 책임" value="G = p − y" />
          <Arrow />
          <div className={`grid gap-2 ${scenes.active===1?"opacity-100":"opacity-65"}`}><Box active={scenes.active===1} label="weight" value="dW = XᵀG"/><Box active={scenes.active===1} label="bias" value="db = row-sum(G)"/><Box active={scenes.active===1} label="앞 layer" value="dX = GWᵀ"/></div>
        </div>
        <div className={`mt-6 grid gap-3 sm:grid-cols-2 ${scenes.active===2?"opacity-100":"opacity-55"}`}><div className="border border-primary bg-primary/10 p-4"><p className="text-xs font-bold text-primary">BACKPROP 소유</p><p className="mt-2 text-sm">loss에서 각 parameter의 gradient까지 계산</p></div><div className="border border-border p-4"><p className="text-xs font-bold">OPTIMIZER 소유</p><p className="mt-2 text-sm">gradient와 state로 다음 parameter 결정</p></div></div>
        <BackpropSceneControls {...scenes} labels={SCENES}/>
      </div>
    </VizFrame>
  );
}

function Box({active,label,value}:{active:boolean;label:string;value:string}) { return <div className={`min-w-0 border p-4 text-center ${active?"border-primary bg-primary/10":"border-border bg-background"}`}><p className="text-[10px] font-bold text-muted-foreground">{label}</p><p className="mt-2 break-words font-mono text-xs font-black sm:text-sm">{value}</p></div>; }
function Arrow(){return <span aria-hidden className="hidden text-center text-xl font-black text-primary sm:block">←</span>;}
