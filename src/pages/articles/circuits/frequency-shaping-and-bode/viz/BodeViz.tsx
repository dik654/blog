import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const POINTS = [
  { label: "0.1 × 경계", ratio: 0.1, hz: "15.9 Hz", amplitude: "4.98 V", gain: "−0.043 dB", phase: "−5.7°" },
  { label: "경계", ratio: 1, hz: "159 Hz", amplitude: "3.54 V", gain: "−3.01 dB", phase: "−45°" },
  { label: "10 × 경계", ratio: 10, hz: "1592 Hz", amplitude: "0.50 V", gain: "−20.043 dB", phase: "−84.3°" },
] as const;
const db = (x: number) => 20 * Math.log10(1 / Math.sqrt(1 + x * x));
const phase = (x: number) => -Math.atan(x) * 180 / Math.PI;
const path = (f: (x: number) => number, min: number, max: number) => Array.from({ length: 101 }, (_, i) => {
  const x = 15 + i * 2.8;
  const value = f(10 ** (-2 + i * 0.04));
  const y = 110 - (value - min) / (max - min) * 85;
  return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
}).join(" ");
export default function BodeViz() {
  const [selected, setSelected] = useState(1);
  const point = POINTS[selected];
  return <VizFrame eyebrow="1 kΩ·1 µF, 무부하 이상 회로" title="주파수를 열 배씩 바꿔 보세요" description="축전기 출력의 최대 진폭·dB·위상을 같은 입력 5 V에 대해 비교합니다." note="가로축은 f/fc의 로그 눈금입니다. 보이는 꺾임은 이상 RC의 연속 곡선이며, −20 dB/dec는 높은 주파수에서의 근사 기울기입니다.">
    <div className="flex flex-wrap gap-2" role="group" aria-label="주파수 선택">{POINTS.map((item, index) => <button type="button" key={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)} className={`rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${selected === index ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:bg-muted"}`}>{item.label}</button>)}</div>
    <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite"><div className="rounded-lg border border-border bg-background p-4 text-sm"><p className="font-semibold">{point.hz}</p><p className="mt-3">출력 최대 진폭 <strong>{point.amplitude}</strong></p><p className="mt-2">전압 진폭 비 <strong>{point.gain}</strong></p><p className="mt-2">입력 대비 위상 <strong>{point.phase}</strong></p><p className="mt-3 text-muted-foreground">f/fc={point.ratio}입니다. −3 dB에서도 출력은 0이 아닙니다.</p></div>
      <div className="rounded-lg border border-border bg-background p-3 text-xs"><p className="font-semibold">위: 진폭비 dB · 아래: 위상 °</p><svg className="mt-2 h-auto w-full" viewBox="0 0 310 245" role="img" aria-label="1 kΩ·1 µF 저역 통과 회로의 로그 주파수별 진폭비와 위상 곡선"><path d="M15 110 H295 M15 230 H295" stroke="#94a3b8" strokeWidth="1" fill="none"/><path d={path(db,-40,0)} stroke="#2563eb" strokeWidth="1.2" fill="none"/><path d={path(phase,-90,0).replaceAll(/(\d+(?:\.\d+)?) (\d+(?:\.\d+)?)/g, (_m,x,y) => `${x} ${Number(y)+120}`)} stroke="#d97706" strokeWidth="1.2" fill="none"/><path d={`M${155+70*Math.log10(point.ratio)} 10 V235`} stroke="#64748b" strokeDasharray="4 4" fill="none"/><text x="15" y="243" fill="currentColor">0.01fc</text><text x="143" y="243" fill="currentColor">fc</text><text x="263" y="243" fill="currentColor">100fc</text></svg><div className="mt-1 flex gap-3"><span className="text-blue-600 dark:text-blue-400">━ 진폭</span><span className="text-amber-600 dark:text-amber-400">━ 위상</span></div></div></div>
  </VizFrame>;
}
