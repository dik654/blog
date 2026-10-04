import VizFrame from "@/components/viz/VizFrame";
import { BackpropSceneControls } from "./BackpropVizControls";
import { useBackpropScenes } from "./useBackpropScenes";

const SCENES = ["forward 값", "reverse 기여", "저장과 재계산"] as const;
const paths = [
  [["처음 값", "w=3 · x=2 · b=0"], ["같은 중간값", "a=wx+b=6"], ["두 사용처", "a²=36 · 그대로 a=6"], ["마지막 합", "L=36+6=42"]],
  [["출발 기여", "dL/dL=1"], ["두 길의 기여", "제곱:12 · 그대로:1"], ["같은 a에 더함", "dL/da=12+1=13"], ["입력별로 반환", "dw=26 · dx=39 · db=13"]],
  [["곱셈이 남길 값", "w=3 · x=2"], ["제곱이 남길 값", "a=6"], ["a를 버렸다면", "3×2+0을 다시 계산"], ["재현 조건", "같은 입력·같은 연산"]],
];

export default function AutodiffGraphViz() {
  const scenes = useBackpropScenes(SCENES.length);
  return <VizFrame eyebrow="같은 사례의 계산 순서" title="한 값을 두 번 쓴 뒤 돌아온 기여를 합칩니다" description="w=3,x=2,b=0,L=a²+a인 가정 사례입니다. 각 행은 위에서 아래로 읽습니다." note="Gradient를 돌려받은 입력 값은 아직 바뀌지 않습니다. 저장을 줄이는 경우에도 같은 forward 값을 재현해야 합니다.">
    <div data-viz-canvas tabIndex={0} role="group" aria-label="Automatic differentiation graph animation" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <ol className="space-y-3">{paths[scenes.active].map(([label,value],i)=><li key={label} className="grid min-h-20 grid-cols-[1.5rem_1fr] items-start gap-3 border border-border p-4"><span className="text-sm text-muted-foreground">{i+1}</span><div className="min-w-0"><p className="text-sm font-semibold">{label}</p><p className="mt-2 break-words font-mono text-sm leading-7">{value}</p></div></li>)}</ol>
      <BackpropSceneControls {...scenes} labels={SCENES} />
    </div>
  </VizFrame>;
}
