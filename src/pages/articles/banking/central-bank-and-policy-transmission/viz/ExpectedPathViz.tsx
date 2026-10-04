import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
const states=[
 {label:"처음 예상",rates:[4.5,4,3.5],premium:0.3,note:"각 칸은 앞으로 각 1년 구간에 예상한 평균 단기금리입니다. 세 구간 평균 4%에 0.3%포인트를 더하면 3년 금리의 근삿값은 4.3%입니다."},
 {label:"인상 뒤 경로",rates:[4.75,3.5,3],premium:0.3,note:"첫 구간은 높아졌지만 뒤 두 구간의 예상은 더 크게 낮아졌습니다. 평균 3.75%에 같은 0.3%포인트를 더해 장기금리는 4.05%가 됩니다."},
 {label:"위험 보상 변화",rates:[4.75,3.5,3],premium:0.6,note:"같은 경로라도 기간 프리미엄을 0.6%포인트로 바꾸면 4.35%입니다. 관측된 장기금리 하나로 기대 경로와 프리미엄을 각각 알아낼 수는 없습니다."},
];
export default function ExpectedPathViz(){
 const scene=useAnimatedScenes(states.length,4500);const s=states[scene.active];const avg=s.rates.reduce((a,b)=>a+b,0)/3;
 return <figure data-viz="expected-path" className="my-8 border-y border-border py-4"><figcaption className="mb-3 text-sm leading-6">가정한 3년 경로와 선형 근사입니다. 오늘의 1일 금리를 첫 1년 평균과 자동으로 같게 놓지는 않습니다.</figcaption>
 <div data-viz-canvas tabIndex={0} role="group" aria-label="기대 경로와 기간 프리미엄의 세 장면" onKeyDown={scene.onKeyDown} className="flex h-[min(540px,calc(100dvh-150px))] flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
 <div className="min-h-0 flex-1 overflow-y-auto px-1 py-3"><div className="grid grid-cols-3 gap-3">{s.rates.map((r,i)=><div key={i} className="border-b border-border pb-3"><p className="text-xs">{i+1}년째 평균</p><p className="mt-2 text-xl font-semibold tabular-nums">{r}%</p><div className="mt-3 flex h-20 items-end"><div aria-hidden className="w-full bg-primary/30" style={{height:`${r/5*100}%`}}/></div></div>)}</div>
 <p className="my-4 text-base tabular-nums">평균 {avg.toFixed(2)}% + {s.premium.toFixed(2)}%p<br/><strong className="text-2xl">3년 금리 ≈ {(avg+s.premium).toFixed(2)}%</strong></p><p className="text-sm leading-7">{s.note}</p></div>
 <AnimatedSceneControls {...scene} labels={states.map(x=>x.label)}/></div></figure>;
}
