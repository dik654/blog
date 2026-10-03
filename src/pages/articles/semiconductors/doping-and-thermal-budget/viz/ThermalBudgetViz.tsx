import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const CASES=[
 {label:"첫 1시간", budget:"3.6×10⁻¹¹ cm²", width:"120 nm", surface:"1.00", bars:[100,37,2]},
 {label:"다음 30분까지", budget:"1.08×10⁻¹⁰ cm²", width:"208 nm", surface:"0.58", bars:[58,41,15]},
] as const;
export default function ThermalBudgetViz(){
 const [selected,setSelected]=useState(0),state=CASES[selected];
 return <VizFrame eyebrow="고정 도즈·일정 D의 가상 확산" title="같은 양이 더 깊이 퍼지면 표면은 옅어집니다" description="두 가열 단계 뒤의 폭 척도와 깊이별 농도를 비교합니다." note="막대는 첫 단계의 표면 농도를 100으로 둔 가상 가우스 프로파일입니다. a는 퍼짐 척도이며 접합 깊이가 아닙니다.">
  <div className="flex flex-wrap gap-2" role="group" aria-label="가열 단계 선택">{CASES.map((x,i)=><button type="button" key={x.label} aria-pressed={selected===i} onClick={()=>setSelected(i)} className={"rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary "+(selected===i?"border-primary bg-primary/10 text-primary":"border-border bg-background text-foreground hover:bg-muted")}>{x.label}</button>)}</div>
  <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite"><div className="rounded-lg border border-border bg-background p-4 text-sm"><p className="font-semibold">누적 D×t: {state.budget}</p><p className="mt-3">폭 척도 a <strong>{state.width}</strong></p><p className="mt-2">첫 단계 대비 표면 농도 <strong>{state.surface}배</strong></p><p className="mt-3 text-muted-foreground">불순물 총량 Q는 일정하다는 모형입니다.</p></div><div className="rounded-lg border border-border bg-background p-4 text-xs"><p className="font-semibold">깊이별 농도 · 첫 단계 표면=100</p>{["표면","120 nm","240 nm"].map((label,i)=><div className="mt-3" key={label}><div className="flex justify-between"><span>{label}</span><span>{state.bars[i]}%</span></div><div className="mt-1 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-amber-500" style={{width:String(state.bars[i])+"%"}}/></div></div>)}</div></div>
 </VizFrame>;
}
