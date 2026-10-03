import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const CASES = [
  { beta: "0.1", target: "10배", actual: "9.09배", loop: "10", crossover: "78.2 rad/s", phase: "−120.7°", margin: 59.3 },
  { beta: "0.5", target: "2배", actual: "1.96배", loop: "50", crossover: "212.6 rad/s", phase: "−152.1°", margin: 27.9 },
] as const;
export default function FeedbackViz() {
  const [selected, setSelected] = useState(0);
  const state = CASES[selected];
  return <VizFrame eyebrow="가상 2극 선형 증폭기 A(0)=100" title="돌아오는 몫을 바꾸면 교차점도 이동합니다" description="직류 출력 배율과 루프 크기 1인 곳의 위상 여유를 같은 모델에서 비교합니다." note="두 극은 10·100 rad/s인 교육용 가정입니다. 위상 여유는 한 교차점의 선형 모델에서 계산했으며, 실제 부하·포화·기생 성분은 포함하지 않습니다.">
    <div className="flex flex-wrap gap-2" role="group" aria-label="되먹임 비율 선택">{CASES.map((item,index)=><button type="button" key={item.beta} aria-pressed={selected===index} onClick={()=>setSelected(index)} className={"rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary "+(selected===index?"border-primary bg-primary/10 text-primary":"border-border bg-background text-foreground hover:bg-muted")}>β={item.beta}</button>)}</div>
    <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite"><div className="rounded-lg border border-border bg-background p-4 text-sm"><p className="font-semibold">입력 1 V를 넣었을 때</p><p className="mt-3">무한 루프 이득의 목표 <strong>{state.target}</strong></p><p className="mt-2">실제 직류 출력 <strong>{state.actual}</strong></p><p className="mt-2">직류 루프 이득 <strong>{state.loop}</strong></p></div><div className="rounded-lg border border-border bg-background p-4 text-sm"><p className="font-semibold">루프 크기 1인 곳</p><p className="mt-3">교차 각주파수 <strong>{state.crossover}</strong></p><p className="mt-2">루프 위상 <strong>{state.phase}</strong></p><p className="mt-2">−180°까지 남은 각도 <strong>{state.margin.toFixed(1)}°</strong></p><div className="mt-4 h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label={"180도 중 위상 여유 "+state.margin.toFixed(1)+"도"}><div className="h-full rounded-full bg-blue-600 dark:bg-blue-400" style={{width:String(state.margin/180*100)+"%"}} /></div><p className="mt-2 text-xs text-muted-foreground">표시 막대는 남은 각도 ÷ 180°입니다.</p></div></div>
  </VizFrame>;
}
