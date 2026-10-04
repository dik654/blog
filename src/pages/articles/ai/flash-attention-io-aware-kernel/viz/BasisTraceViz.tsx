import {useAnimatedScenes} from "@/components/viz/useAnimatedScenes";
import {AnimatedSceneControls} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
const labels=["둘 다 보정","기준 유지","분모만 보정"] as const;
const states=[
  {scaleU:"× e⁻²",scaleL:"× e⁻²",newU:"+ 8.298722",newL:"+ 1.049787",u:"8.876695",l:"1.203438",o:"7.376113",note:"기준을 3에서 5로 옮깁니다. 옛 분자와 분모 모두 같은 배율로 줄여 새 조각과 더합니다."},
  {scaleU:"× 1",scaleL:"× 1",newU:"+ 61.319725",newL:"+ 7.756936",u:"65.590396",l:"8.892271",o:"7.376113",note:"기준 3을 유지합니다. 새 조각도 3을 뺀 지수로 계산하면 두 합의 비율은 같습니다."},
  {scaleU:"× 1 · 누락",scaleL:"× e⁻²",newU:"+ 8.298722",newL:"+ 1.049787",u:"12.569393",l:"1.203438",o:"10.444571 · 오답",note:"분모만 기준 5로 옮기면 분자와 기준이 어긋납니다. 마지막 나눗셈으로 보정 누락이 복구되지는 않습니다."}
];
export default function BasisTraceViz(){
 const scenes=useAnimatedScenes(states.length,5000);const s=states[scenes.active];
 return <VizFrame eyebrow="가정한 네 점수" title="두 합의 기준을 함께 바꿉니다" description="첫 조각의 합은 같고 다음 조각을 더하는 규칙만 바꿉니다." note="점수 [1,3,2,5]와 값 [2,4,6,8]의 실수 산술을 반올림해 표시합니다.">
 <div data-viz-canvas role="group" aria-label="분자와 분모의 기준 비교" tabIndex={0} onKeyDown={scenes.onKeyDown} className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
 <div className="flex flex-none flex-col py-2"><h4 className="font-bold">{labels[scenes.active]}</h4>
 <svg viewBox="0 0 340 280" role="img" aria-label="옛 두 합을 보정하고 새 항을 더해 출력까지 나누는 과정" className="mt-3 h-auto max-h-72 w-full">
 <defs><marker id="flash20-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L7 4L1 7" fill="none" className="stroke-primary"/></marker></defs>
 {[85,255].map(x=><g key={x}><path d={`M${x} 63V69M${x} 96V107M${x} 135V149`} fill="none" className="stroke-primary" strokeWidth="1" markerEnd="url(#flash20-arrow)"/><rect x={x-62} y="29" width="124" height="34" rx="7" className="fill-background stroke-border"/><rect x={x-62} y="149" width="124" height="34" rx="7" className="fill-primary/10 stroke-primary"/></g>)}
 <g textAnchor="middle" className="fill-foreground text-[14px]">
 <text x="85" y="17">값의 가중합 u</text><text x="255" y="17">지수합 ℓ</text>
 <text x="85" y="51">4.270671</text><text x="255" y="51">1.135335</text>
 <text x="85" y="90">{s.scaleU}</text><text x="255" y="90">{s.scaleL}</text>
 <text x="85" y="128">{s.newU}</text><text x="255" y="128">{s.newL}</text>
 <text x="85" y="171">{s.u}</text><text x="255" y="171">{s.l}</text>
 <text x="170" y="227">분자 ÷ 분모</text><text x="170" y="263">{s.o}</text>
 </g><path d="M85 183V202H255V183M170 202V208M170 235V246" fill="none" className="stroke-primary" strokeWidth="1" markerEnd="url(#flash20-arrow)"/>
 </svg><p className="mt-3 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{s.note}</p></div>
 <AnimatedSceneControls {...scenes} labels={labels}/></div></VizFrame>;
}
