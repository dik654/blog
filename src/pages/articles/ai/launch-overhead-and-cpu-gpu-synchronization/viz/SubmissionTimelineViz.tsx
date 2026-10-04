import {useAnimatedScenes} from "@/components/viz/useAnimatedScenes";
import {AnimatedSceneControls} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
const labels=["미리 전달","매회 기다림","목록 미리 전달","목록 매회 기다림"] as const;
const rows=[
{prep:[[0,2],[8,10],[16,18]],sent:[[2,5],[5,8],[10,13],[13,16],[18,21],[21,24]],work:[[5,7],[8,10],[13,15],[16,18],[21,23],[24,26]],done:"10 · 18 · 26",end:26,note:"첫 두 계산은 5–7·8–10 μs입니다. 다음 회 준비를 8 μs에 시작해 이전 계산과 겹칩니다. 전달 종료는 24 μs입니다."},
{prep:[[0,2],[10,12],[20,22]],sent:[[2,5],[5,8],[12,15],[15,18],[22,25],[25,28]],work:[[5,7],[8,10],[15,17],[18,20],[25,27],[28,30]],done:"10 · 20 · 30",end:30,note:"앞 회의 계산 완료 10·20 μs 뒤에 다음 준비를 시작합니다. 계산 여섯 개의 합 12 μs는 그대로입니다."},
{prep:[[0,2],[3,5],[6,8]],sent:[[2,3],[5,6],[8,9]],work:[[3,5],[5,7],[7,9],[9,11],[11,13],[13,15]],done:"7 · 11 · 15",end:15,note:"두 계산의 목록을 한 번 전달하는 비용을 1 μs로 둡니다. 전달은 9 μs에 끝나고 같은 계산 여섯 개는 15 μs에 끝납니다."},
{prep:[[0,2],[7,9],[14,16]],sent:[[2,3],[9,10],[16,17]],work:[[3,5],[5,7],[10,12],[12,14],[17,19],[19,21]],done:"7 · 14 · 21",end:21,note:"매회 기다려도 목록을 전달하는 이득이 남습니다. 하나씩 전달하며 기다린 30 μs보다 짧은 21 μs에 끝납니다."}
];const x=(n:number)=>44+n*9;
export default function SubmissionTimelineViz(){const scenes=useAnimatedScenes(4,6500);const r=rows[scenes.active];return <VizFrame eyebrow="세 회의 같은 계산 · 가정" title="결과 8·18·38이 언제 나오나요?" description="한 회에 1을 더하고 2를 곱합니다. 준비 2 μs, 하나씩 전달 3 μs, 각 계산 2 μs를 사용합니다." note="실제 장치 측정이 아닌 단일 실행열의 시간표입니다. 회마다 기다리는 호출과 복사의 추가 비용은 0으로 두었습니다.">
<div data-viz-canvas role="group" tabIndex={0} onKeyDown={scenes.onKeyDown} aria-label="세 회의 전달과 계산 시간표" className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
<div className="flex flex-none flex-col py-1"><h4 className="font-bold">{labels[scenes.active]}</h4><svg viewBox="0 0 340 248" className="mt-2 h-auto max-h-72 w-full" role="img" aria-label={labels[scenes.active]+", 완료 "+r.done+" 마이크로초"}>
<defs><marker id="submission-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8" className="fill-foreground"/></marker></defs>
<text x="170" y="21" textAnchor="middle" className="fill-foreground text-[14px]">3 → 4 → 8 → 9 → 18 → 19 → 38</text>
{[0,5,10,15,20,25,30].map(t=><g key={t}><path d={"M"+x(t)+" 40V168"} className="stroke-border" strokeDasharray="3 3"/><text x={x(t)} y="187" textAnchor="middle" className="fill-foreground text-[14px]">{t}</text></g>)}
<text x="3" y="79" className="fill-foreground text-[14px]">준비</text><text x="3" y="145" className="fill-foreground text-[14px]">계산</text>
{r.prep.map(([a,b],i)=><rect key={"p"+i} x={x(a)} y="54" width={x(b)-x(a)} height="33" rx="2" className="fill-muted stroke-border"/>)}
{r.sent.map(([a,b],i)=><rect key={"s"+i} x={x(a)} y="54" width={x(b)-x(a)} height="33" rx="2" className="fill-primary/20 stroke-primary"/>)}
{r.work.map(([a,b],i)=><rect key={"w"+i} x={x(a)} y="120" width={x(b)-x(a)} height="33" rx="2" className="fill-primary/30 stroke-primary"/>)}
<path d={"M"+x(r.sent[0][1])+" 91V116"} className="stroke-foreground" markerEnd="url(#submission-arrow)"/>
<text x="170" y="213" textAnchor="middle" className="fill-foreground text-[14px]">회별 완료 {r.done} μs</text><text x="170" y="239" textAnchor="middle" className="fill-muted-foreground text-[14px]">위쪽 회색: 준비 · 색: 전달 / 단위 μs</text>
</svg><p className="mt-1 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{r.note}</p></div><AnimatedSceneControls {...scenes} labels={labels}/></div></VizFrame>;}
