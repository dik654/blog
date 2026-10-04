import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";
const CASES=[
 {label:"자원 대기 없음",segments:[["제어","0–1"],["센서","1–3"],["로그","3–5"],["제어","5–6"],["로그","6–7"]],finish:3,slack:1},
 {label:"로그가 뮤텍스 보유",segments:[["제어","0–1"],["로그 임계 구간","1–3"],["센서","3–5"]],finish:5,slack:-1},
] as const;
export default function SchedulingDeadlineViz(){
 const [selected,setSelected]=useState(0),s=CASES[selected];
 return <VizFrame eyebrow="한 코어 · 가상 고정 우선순위 일정" title="같은 센서 코드가 공유 자원 대기에 따라 3 ms 또는 5 ms에 끝납니다" description="센서의 0 ms 준비 시각에서 4 ms가 상대 마감입니다." note="두 번째 상태는 다른 시작 시점에서 로그가 이미 뮤텍스를 얻었고 2 ms의 임계 구간이 남은 별도 시작 조건입니다. 값은 FreeRTOS 실측이 아닙니다.">
  <div className="flex flex-wrap gap-2" role="group" aria-label="작업 일정 조건 선택">{CASES.map((x,i)=><button type="button" key={x.label} aria-pressed={selected===i} onClick={()=>setSelected(i)} className={"rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary "+(selected===i?"border-primary bg-primary/10 text-primary":"border-border bg-background text-foreground hover:bg-muted")}>{x.label}</button>)}</div>
  <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite"><div className="rounded-lg border border-border bg-background p-4 text-sm"><p className="font-semibold">CPU가 실제 실행한 순서</p><ol className="mt-3 min-h-[160px] space-y-2">{s.segments.map(([name,time],i)=><li key={i} className="flex justify-between gap-4"><span>{name}</span><strong>{time} ms</strong></li>)}</ol></div><div className="rounded-lg border border-border bg-background p-4 text-sm"><p>센서 완료 <strong>{s.finish} ms</strong></p><p className="mt-2">센서 마감 <strong>4 ms</strong></p><p className={"mt-4 text-lg font-semibold "+(s.slack<0?"text-red-600":"text-emerald-700")}>{s.slack<0?"마감 초과 1 ms":"남는 시간 1 ms"}</p><p className="mt-3 text-xs text-muted-foreground">평균 점유율 46%만으로 이 차이를 알 수 없습니다.</p></div></div>
 </VizFrame>;
}
