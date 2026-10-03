import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const STEPS = [
  { label:"① n형 웨이퍼", title:"아직 p-n 접합이 없습니다", detail:"n형 실리콘 한 조각을 출발 바탕으로 둡니다.", mask:false, doped:false, contact:false },
  { label:"② 산화막 창", title:"100 µm만 실리콘을 드러냅니다", detail:"덮인 곳은 보호하고 가운데 창을 불순물의 입구로 씁니다.", mask:true, doped:false, contact:false },
  { label:"③ p형 확산", title:"가상 p형 폭은 104 µm입니다", detail:"100 µm 창에서 양쪽 2 µm씩 더 퍼진 교육용 가정입니다.", mask:true, doped:true, contact:false },
  { label:"④ 접촉 창", title:"중앙 80 µm에만 전극을 댑니다", detail:"가운데 정렬이면 양쪽 명목 거리는 각각 12 µm입니다.", mask:true, doped:true, contact:true },
] as const;
export default function PlanarProcessViz(){
 const [selected,setSelected]=useState(0);
 const step=STEPS[selected];
 return <VizFrame eyebrow="가상 n형 웨이퍼 단면" title="어디를 열고 어디를 덮어 둘까요?" description="단계를 누르며 산화막·p형 영역·전극 창을 차례로 살펴보세요." note="그림 폭은 실제 비율이 아닙니다. 100·2·80 µm는 교육용 가정이며 특허의 측정치가 아닙니다.">
   <div className="flex flex-wrap gap-2" role="group" aria-label="공정 단계 선택">{STEPS.map((item,i)=><button type="button" key={item.label} aria-pressed={selected===i} onClick={()=>setSelected(i)} className={"rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary "+(selected===i?"border-primary bg-primary/10 text-primary":"border-border bg-background text-foreground hover:bg-muted")}>{item.label}</button>)}</div>
   <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite"><div className="rounded-lg border border-border bg-background p-4 text-sm"><p className="font-semibold">{step.title}</p><p className="mt-3 leading-6">{step.detail}</p><p className="mt-3 text-muted-foreground">산화막 창 100 µm · 옆 확산 각 2 µm · 전극 창 80 µm</p></div><div className="rounded-lg border border-border bg-background p-4"><p className="text-xs font-semibold">가운데를 자른 단면: 위가 표면입니다</p><div className="relative mx-auto mt-5 h-28 w-full max-w-xs overflow-hidden rounded border border-border bg-blue-100 dark:bg-blue-950" role="img" aria-label={step.title+"; "+step.detail}>{step.mask&&(step.doped?<div className="absolute inset-x-0 top-0 h-3 bg-slate-500"/>:<><div className="absolute left-0 top-0 h-3 w-[30%] bg-slate-500"/><div className="absolute right-0 top-0 h-3 w-[30%] bg-slate-500"/></>)}{step.doped&&<div className="absolute left-[28%] top-3 h-9 w-[44%] rounded-b-2xl border-b border-amber-700 bg-amber-300/90 dark:bg-amber-700/80"/>}{step.contact&&<div className="absolute left-[34%] top-0 h-3 w-[32%] bg-yellow-500"/>}<span className="absolute bottom-3 left-3 text-xs font-semibold text-blue-900 dark:text-blue-100">n형 실리콘</span>{step.doped&&<span className="absolute left-[39%] top-5 text-xs font-semibold text-amber-950 dark:text-amber-100">p형</span>}</div><div className="mt-2 flex flex-wrap gap-3 text-xs"><span>■ 회색: 산화막</span><span>■ 주황: p형</span><span>■ 노랑: 전극</span></div></div></div>
 </VizFrame>;
}
