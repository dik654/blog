import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";
const STEPS=[
 {label:"v1 정상",primary:"v1 · 실행",secondary:"비어 있음",next:"v1 유지",detail:"현재 앱을 그대로 실행합니다."},
 {label:"v2 받는 중",primary:"v1 · 실행",secondary:"v2 · 불완전",next:"차단되면 v1",detail:"완성·검증 전에는 시험 상태를 기록하지 않습니다."},
 {label:"검증 완료",primary:"v1 · 실행",secondary:"v2 · 유효",next:"TEST 교체",detail:"해시·서명을 확인한 후보만 시험 대상으로 표시합니다."},
 {label:"v2 시험",primary:"v2 · 시험",secondary:"v1 · 보존",next:"미확정이면 v1",detail:"제품 자가 검사를 통과해야 v2를 확정합니다."},
 {label:"v2 확정",primary:"v2 · 확정",secondary:"v1 · 보존",next:"v2 유지",detail:"이미지 OK 기록 뒤의 다음 부팅도 v2입니다."},
 {label:"시험 실패",primary:"v1 · 복귀",secondary:"v2 · 미확정",next:"v1 실행",detail:"시험 중 재시작되고 확인되지 않았기에 되돌립니다."},
] as const;
export default function FirmwareRecoveryViz(){
 const [selected,setSelected]=useState(0),s=STEPS[selected];
 return <VizFrame eyebrow="가상 4 MiB 외부 플래시 · 시험 swap" title="v1을 보존한 채 v2를 시험하고 확정합니다" description="받는 중·검증·시험·확정과 실패 복귀를 버튼으로 따라갑니다." note="MCUboot의 시험 swap 방식에 해당하는 설계 예입니다. RP2040 내장 ROM의 자동 A/B 기능을 나타내지 않습니다. 실제 슬롯에는 이미지 메타데이터·정렬 공간이 더 필요합니다.">
  <div className="flex flex-wrap gap-2" role="group" aria-label="펌웨어 업데이트 단계 선택">{STEPS.map((x,i)=><button type="button" key={x.label} aria-pressed={selected===i} onClick={()=>setSelected(i)} className={"rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary "+(selected===i?"border-primary bg-primary/10 text-primary":"border-border bg-background text-foreground hover:bg-muted")}>{x.label}</button>)}</div>
  <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite"><div className="rounded-lg border border-border bg-background p-4 text-sm"><p>부트·복구 <strong>256 KiB</strong></p><p className="mt-3">주 슬롯 1536 KiB · <strong>{s.primary}</strong></p><p className="mt-2">보조 슬롯 1536 KiB · <strong>{s.secondary}</strong></p><p className="mt-3">설정·보조 <strong>768 KiB</strong></p></div><div className="rounded-lg border border-border bg-background p-4 text-sm"><p>다음 부팅: <strong>{s.next}</strong></p><p className="mt-3">{s.detail}</p><p className="mt-4 text-xs text-muted-foreground">256+1536+1536+768=4096 KiB</p></div></div>
 </VizFrame>;
}
