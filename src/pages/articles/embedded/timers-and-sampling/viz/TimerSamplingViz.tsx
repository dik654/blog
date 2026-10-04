import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";
const CASES=[{label:"원래 30 Hz",frequency:30},{label:"원래 70 Hz",frequency:70}] as const;
const SAMPLES=Array.from({length:6},(_,n)=>({n,time:n*10,low:Math.cos(2*Math.PI*30*n/100),high:Math.cos(2*Math.PI*70*n/100)}));
export default function TimerSamplingViz(){
 const [selected,setSelected]=useState(0),s=CASES[selected];
 return <VizFrame eyebrow="10 ms 간격 · 100 Hz의 가상 등간격 샘플" title="원래 30 Hz와 70 Hz가 같은 여섯 값을 남깁니다" description="중심 1.65 V를 빼고 1 V로 나눈 값입니다. 두 버튼을 바꿔도 같은 기록이 남습니다." note="코사인 단일 성분·정확한 등간격·위상 0을 가정합니다. 실제 센서에는 아날로그 필터와 시각 지터를 따로 고려합니다.">
  <div className="flex flex-wrap gap-2" role="group" aria-label="입력 코사인 빈도 선택">{CASES.map((x,i)=><button type="button" key={x.label} aria-pressed={selected===i} onClick={()=>setSelected(i)} className={"rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary "+(selected===i?"border-primary bg-primary/10 text-primary":"border-border bg-background text-foreground hover:bg-muted")}>{x.label}</button>)}</div>
  <div className="mt-5 rounded-lg border border-border bg-background p-4" aria-live="polite"><p className="font-semibold">입력 {s.frequency} Hz → 기록에는 30 Hz 모양</p><div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs sm:grid-cols-6">{SAMPLES.map(x=><div key={x.n} className="rounded-md border border-border p-2"><p className="text-muted-foreground">{x.time} ms</p><p className="mt-2 font-mono font-semibold">{(selected===0?x.low:x.high).toFixed(2)}</p></div>)}</div><p className="mt-4 text-xs text-muted-foreground">n=0…5에서 cos(2π·70n/100)=cos(2π·30n/100)입니다.</p></div>
 </VizFrame>;
}
