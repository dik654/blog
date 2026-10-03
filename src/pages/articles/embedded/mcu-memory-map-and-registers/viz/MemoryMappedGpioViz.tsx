import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";
const STEPS=[
 {label:"1. 낮게 준비",address:"0xD0000018",register:"GPIO_OUT_CLR",direction:"입력 상태",latch:"0",pin:"아직 구동 안 함"},
 {label:"2. 출력 허용",address:"0xD0000024",register:"GPIO_OE_SET",direction:"출력",latch:"0",pin:"낮게 구동"},
 {label:"3. 출력 세움",address:"0xD0000014",register:"GPIO_OUT_SET",direction:"출력",latch:"1",pin:"높게 구동"},
 {label:"4. 다시 내림",address:"0xD0000018",register:"GPIO_OUT_CLR",direction:"출력",latch:"0",pin:"낮게 구동"},
] as const;
export default function MemoryMappedGpioViz(){
 const [selected,setSelected]=useState(0),s=STEPS[selected];
 return <VizFrame eyebrow="RP2040 GPIO5 · 기능 SIO 선택 가정" title="같은 0x20을 어느 주소에 쓰는지가 동작을 바꿉니다" description="주소는 레지스터를, 0x20은 GPIO5 비트를 고릅니다." note="물리적 핀 전압은 외부 배선과 패드 설정에 따라 달라집니다. 외부 LED의 켜짐·꺼짐을 보장하는 그림은 아닙니다.">
  <div className="flex flex-wrap gap-2" role="group" aria-label="GPIO5 단계 선택">{STEPS.map((x,i)=><button type="button" key={x.label} aria-pressed={selected===i} onClick={()=>setSelected(i)} className={"rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary "+(selected===i?"border-primary bg-primary/10 text-primary":"border-border bg-background text-foreground hover:bg-muted")}>{x.label}</button>)}</div>
  <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite"><div className="rounded-lg border border-border bg-background p-4 text-sm"><p className="font-semibold">{s.register}</p><p className="mt-2 font-mono">{s.address} ← 0x20</p><p className="mt-3">출력 허용: <strong>{s.direction}</strong></p><p className="mt-2">출력 래치: <strong>{s.latch}</strong></p></div><div className="rounded-lg border border-border bg-background p-4 text-sm"><p className="font-semibold">GPIO5의 가상 상태</p><div className={"mt-5 h-5 rounded-full "+(s.latch==="1"?"bg-amber-500":"bg-slate-300")}/><p className="mt-4">{s.pin}</p><p className="mt-2 text-xs text-muted-foreground">선택기에서 SIO 기능을 먼저 설정했다고 가정합니다.</p></div></div>
 </VizFrame>;
}
