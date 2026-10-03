import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const CASES = [
  { label: "기준 배선", resistance: "200 Ω", capacitance: "100 fF", driver: 60, wire: 14 },
  { label: "길이 두 배", resistance: "400 Ω", capacitance: "200 fF", driver: 110, wire: 48 },
  { label: "저항만 감소", resistance: "140 Ω", capacitance: "100 fF", driver: 60, wire: 9.8 },
  { label: "용량만 감소", resistance: "200 Ω", capacitance: "50 fF", driver: 35, wire: 9 },
] as const;

export default function InterconnectDelayViz() {
  const [selected, setSelected] = useState(0);
  const current = CASES[selected];
  const total = current.driver + current.wire;
  return <VizFrame eyebrow="가상 π 배선의 Elmore 근사" title="길이와 R·C를 바꾸면 두 지연 항이 다르게 움직입니다" description="출력 저항 500 Ω과 입력 용량 20 fF를 고정하고 배선 조건만 바꿉니다." note="막대는 158 ps를 전체 폭으로 둔 비교 그림입니다. 값은 첫 모멘트 근사이며 실측 전파 지연이 아닙니다.">
    <div className="flex flex-wrap gap-2" role="group" aria-label="배선 조건 선택">{CASES.map((caseItem, index) => <button type="button" key={caseItem.label} aria-pressed={selected === index} onClick={() => setSelected(index)} className={"rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary " + (selected === index ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:bg-muted")}>{caseItem.label}</button>)}</div>
    <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite"><div className="rounded-lg border border-border bg-background p-4 text-sm"><p>배선 저항 <strong>{current.resistance}</strong> · 배선 용량 <strong>{current.capacitance}</strong></p><p className="mt-3">출력 저항 항 <strong>{current.driver} ps</strong></p><p className="mt-2">배선 저항 항 <strong>{current.wire} ps</strong></p><p className="mt-3 text-lg font-semibold">합계 {total} ps</p></div><div className="rounded-lg border border-border bg-background p-4 text-xs"><p className="font-semibold">158 ps 기준의 항별 길이</p><div className="mt-4 flex h-6 overflow-hidden rounded-full bg-muted" aria-label={"출력 항 " + current.driver + " ps, 배선 항 " + current.wire + " ps"}><div className="bg-sky-500" style={{ width: String(current.driver / 158 * 100) + "%" }} /><div className="bg-amber-500" style={{ width: String(current.wire / 158 * 100) + "%" }} /></div><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1"><span>■ 출력 저항 항</span><span>■ 배선 저항 항</span></div><p className="mt-4 text-muted-foreground">기준의 배선 없는 출력×입력 값은 10 ps입니다.</p></div></div>
  </VizFrame>;
}
