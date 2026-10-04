import {useAnimatedScenes} from "@/components/viz/useAnimatedScenes";
import {AnimatedSceneControls} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
const labels=["하나씩 전달","목록 한 번 전달","매번 완료 기다림"] as const;
const notes=[
"전달은 0–3·3–6·6–9·9–12 μs, 계산 완료는 5·8·11·14 μs입니다. 준비와 계산이 겹칩니다.",
"목록 전달 2 μs 뒤 계산 네 개가 이어집니다. 같은 답 22를 10 μs에 얻습니다. 계산 시간의 합은 여전히 8 μs입니다.",
"다음 전달을 앞 계산이 끝난 뒤 시작합니다. 계산 완료가 5·10·15·20 μs로 늦어집니다."
];
const cpu=[[[0,3],[3,6],[6,9],[9,12]],[[0,2]],[[0,3],[5,8],[10,13],[15,18]]];
const gpu=[[[3,5],[6,8],[9,11],[12,14]],[[2,4],[4,6],[6,8],[8,10]],[[3,5],[8,10],[13,15],[18,20]]];
const values=[4,8,11,22];const x=(t:number)=>55+t*13;
export default function CudaGraphTimelineViz(){
 const scenes=useAnimatedScenes(3,6000);const s=scenes.active;
 return <VizFrame eyebrow="같은 네 작업 · 가정" title="답은 22로 같고 끝나는 시각이 달라집니다" description="입력 3에 +1, ×2, +3, ×2를 차례로 적용합니다. 전달하는 쪽과 계산하는 쪽은 동시에 일할 수 있습니다." note="단일 실행열의 설명용 시간표입니다. 실제 CPU·GPU 호출을 측정한 결과가 아닙니다.">
 <div data-viz-canvas role="group" tabIndex={0} onKeyDown={scenes.onKeyDown} aria-label="네 작업의 전달과 완료 시간표" className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
 <div className="flex flex-none flex-col py-1"><h4 className="font-bold">{labels[s]}</h4>
 <svg viewBox="0 0 340 245" role="img" aria-label={labels[s]+"의 시간축과 결과"} className="mt-1 h-auto max-h-72 w-full">
 <defs><marker id="graph-time-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8" className="fill-foreground"/></marker></defs>
 <text x="170" y="23" textAnchor="middle" className="fill-foreground text-[14px]">입력 3 → 4 → 8 → 11 → 22</text>
 {[0,5,10,15,20].map(t=><g key={t}><path d={"M"+x(t)+" 40V174"} className="stroke-border" strokeDasharray="3 3"/><text x={x(t)} y="194" textAnchor="middle" className="fill-foreground text-[14px]">{t}</text></g>)}
 <text x="8" y="75" className="fill-foreground text-[14px]">전달</text><text x="8" y="144" className="fill-foreground text-[14px]">계산</text>
 {cpu[s].map(([a,b],i)=><g key={i}><rect x={x(a)} y="51" width={x(b)-x(a)} height="34" rx="3" className="fill-muted stroke-border"/><text x={(x(a)+x(b))/2} y="73" textAnchor="middle" className="fill-foreground text-[14px]">{i+1}</text></g>)}
 {gpu[s].map(([a,b],i)=><g key={i}><rect x={x(a)} y="120" width={x(b)-x(a)} height="34" rx="3" className="fill-primary/20 stroke-primary"/><text x={(x(a)+x(b))/2} y="143" textAnchor="middle" className="fill-foreground text-[14px]">{values[i]}</text></g>)}
 <path d={"M"+x(cpu[s][0][1])+" 88V116"} className="stroke-foreground" markerEnd="url(#graph-time-arrow)"/>
 <text x="170" y="222" textAnchor="middle" className="fill-foreground text-[15px]">완료 {s===0?14:s===1?10:20} μs · 가로축 단위 μs</text>
 </svg><p className="mt-1 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{notes[s]}</p></div>
 <AnimatedSceneControls {...scenes} labels={labels}/></div></VizFrame>;
}
