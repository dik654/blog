import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";
const CASES=[
 {label:"대기 40 µs",wait:40,irq:73,total:493,slack:507},
 {label:"대기 600 µs",wait:600,irq:633,total:1053,slack:-53},
] as const;
export default function InterruptLatencyViz(){
 const [selected,setSelected]=useState(0),s=CASES[selected];
 return <VizFrame eyebrow="GPIO2 사건 뒤 1 ms · 가상 최악 예산" title="대기 하나가 늘면 같은 코드도 마감을 놓칩니다" description="검출 5, 진입 8, ISR 20, 작업 깨우기 40, I²C 300, 계산 80 µs를 고정합니다." note="모든 시간값은 예시입니다. 두 사례의 대기 40/600 µs도 RP2040의 실측 보증값이 아닙니다.">
  <div className="flex flex-wrap gap-2" role="group" aria-label="인터럽트 대기 선택">{CASES.map((x,i)=><button type="button" key={x.label} aria-pressed={selected===i} onClick={()=>setSelected(i)} className={"rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary "+(selected===i?"border-primary bg-primary/10 text-primary":"border-border bg-background text-foreground hover:bg-muted")}>{x.label}</button>)}</div>
  <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite"><div className="rounded-lg border border-border bg-background p-4 text-sm"><p>인터럽트 대기 <strong>{s.wait} µs</strong></p><p className="mt-2">ISR 접수까지 <strong>{s.irq} µs</strong></p><p className="mt-2">처리 완료 <strong>{s.total} µs</strong></p><p className={"mt-3 text-lg font-semibold "+(s.slack<0?"text-red-600":"text-emerald-700")}>{s.slack<0?"마감 초과 "+(-s.slack):"남는 시간 "+s.slack} µs</p></div><div className="rounded-lg border border-border bg-background p-4 text-sm"><p className="font-semibold">1 ms 마감 대비 완료 시점</p><div className="relative mt-5 h-5 overflow-hidden rounded-full bg-muted"><div className={"h-full rounded-full "+(s.total>1000?"bg-red-500":"bg-emerald-500")} style={{width:String(Math.min(100,s.total/1100*100))+"%"}}/><div className="absolute inset-y-0 border-l-2 border-foreground" style={{left:String(1000/1100*100)+"%"}}/></div><p className="mt-3 text-xs text-muted-foreground">검은 선: 사건 뒤 1000 µs 마감</p></div></div>
 </VizFrame>;
}
