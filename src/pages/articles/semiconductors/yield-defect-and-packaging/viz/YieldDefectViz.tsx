import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const CASES = [
  { label: "기준: 면적 1", area: "1 cm²", density: "0.1개/cm²", lambda: "0.1", yield: 90.48, expected: "904.8" },
  { label: "위험 면적 4배", area: "4 cm²", density: "0.1개/cm²", lambda: "0.4", yield: 67.03, expected: "670.3" },
  { label: "결함 밀도 2배", area: "1 cm²", density: "0.2개/cm²", lambda: "0.2", yield: 81.87, expected: "818.7" },
] as const;
export default function YieldDefectViz() {
 const [selected,setSelected]=useState(0),current=CASES[selected];
 return <VizFrame eyebrow="독립 점 결함의 가상 포아송 모형" title="임계 면적과 결함 밀도를 바꾸면 0개일 확률이 달라집니다" description="각 상태는 동일한 결함 모형을 따르는 가상 다이 한 개의 통과 확률입니다." note="1000개당 값은 각각 별도의 가상 후보 집합에서 구한 기댓값입니다. 서로 다른 크기의 다이가 한 웨이퍼에 1000개씩 놓인다는 뜻이 아닙니다.">
  <div className="flex flex-wrap gap-2" role="group" aria-label="결함 모형 조건 선택">{CASES.map((item,index)=><button type="button" key={item.label} aria-pressed={selected===index} onClick={()=>setSelected(index)} className={"rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary "+(selected===index?"border-primary bg-primary/10 text-primary":"border-border bg-background text-foreground hover:bg-muted")}>{item.label}</button>)}</div>
  <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite"><div className="rounded-lg border border-border bg-background p-4 text-sm"><p>임계 면적 <strong>{current.area}</strong></p><p className="mt-2">결함 밀도 <strong>{current.density}</strong></p><p className="mt-2">평균 λ <strong>{current.lambda}개</strong></p><p className="mt-3 text-lg font-semibold">결함 0개: {current.yield}%</p></div><div className="rounded-lg border border-border bg-background p-4 text-sm"><p className="font-semibold">가상 후보 1000개당 기댓값</p><div className="mt-4 h-5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-emerald-500" style={{width:String(current.yield)+"%"}}/></div><p className="mt-3">약 <strong>{current.expected}개</strong>가 이 결함 모형을 통과</p><p className="mt-2 text-xs text-muted-foreground">실제 한 번의 정수 개수와 다릅니다.</p></div></div>
 </VizFrame>;
}
