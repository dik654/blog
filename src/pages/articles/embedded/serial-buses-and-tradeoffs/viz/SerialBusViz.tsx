import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";
const CASES=[
 {label:"I²C 400 kHz",format:"7묶음 × 9클록",bits:"63클록",time:"157.5 µs",scale:157.5,note:"START·STOP·스트레칭 제외"},
 {label:"I²C 100 kHz",format:"같은 7묶음 × 9클록",bits:"63클록",time:"630 µs",scale:630,note:"낮은 클록만 바꾼 가정"},
 {label:"SPI 1 MHz",format:"명령 1 + 데이터 4바이트",bits:"40클록",time:"40 µs",scale:40,note:"CS·장치별 지연 제외"},
 {label:"UART 115200",format:"데이터 4바이트 × 8N1",bits:"40비트",time:"347.2 µs",scale:347.2,note:"요청·주소 프레임 제외"},
] as const;
export default function SerialBusViz(){
 const [selected,setSelected]=useState(0),s=CASES[selected];
 return <VizFrame eyebrow="네 바이트 페이로드 · 서로 다른 가상 거래" title="선로 시간만 세면 거래의 빠진 부분이 보입니다" description="버튼마다 클록·프레임 수와 제외한 시간을 함께 확인합니다." note="세 버스의 거래 형식이 같지 않으므로 막대는 제품 성능 순위가 아닙니다. 실제 시간은 장치 규격·대기·배선으로 달라집니다.">
  <div className="flex flex-wrap gap-2" role="group" aria-label="직렬 버스 조건 선택">{CASES.map((x,i)=><button type="button" key={x.label} aria-pressed={selected===i} onClick={()=>setSelected(i)} className={"rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary "+(selected===i?"border-primary bg-primary/10 text-primary":"border-border bg-background text-foreground hover:bg-muted")}>{x.label}</button>)}</div>
  <div className="mt-5 rounded-lg border border-border bg-background p-4 text-sm" aria-live="polite"><p>{s.format}</p><p className="mt-2">{s.bits} · 순수 선로 시간 <strong>{s.time}</strong></p><div className="mt-4 h-5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-sky-500" style={{width:String(s.scale/630*100)+"%"}}/></div><p className="mt-3 text-xs text-muted-foreground">{s.note}</p></div>
 </VizFrame>;
}
