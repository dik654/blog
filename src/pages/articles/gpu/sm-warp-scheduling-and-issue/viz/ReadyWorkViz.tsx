import { useState } from "react";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
const names = ["A", "B", "C", "D"];
export function makeWorkTimeline(firstRead: 4 | 8) {
  const readyAt = [1, 1, 1, 1];
  const issuedCount = [0, 0, 0, 0];
  return Array.from({ length: 6 }, (_, index) => {
    const clock = index + 1;
    const before = [...readyAt];
    const eligible = before.map((t, i) => t <= clock ? i : -1).filter(i => i >= 0);
    const chosen = eligible[0] ?? -1;
    if (chosen >= 0) {
      const latency = chosen === 1 && issuedCount[1] === 0 ? firstRead : 4;
      readyAt[chosen] = clock + latency;
      issuedCount[chosen] += 1;
    }
    return { clock, before, eligible, chosen };
  });
}
export default function ReadyWorkViz() {
  const [firstRead, setFirstRead] = useState<4 | 8>(8);
  const state = useAnimatedScenes(6, 2500);
  const s = makeWorkTimeline(firstRead)[state.active];
  const detail = s.clock === 6
    ? firstRead === 8 ? "A·B·C·D의 다음 준비는9·10·7·8입니다. 네 묶음 모두 앞 결과를 기다려 이번 기회가 빕니다." : "B의 첫 결과가6에 도착했습니다. 배치 수는 그대로4개지만 B가 준비되어 빈 기회를 채웁니다."
    : `${s.clock}에서 ${names[s.chosen]}를 선택합니다. 준비된 ${s.eligible.length}개 가운데 하나를 내보내며, 나머지 묶음도 계속 배치되어 있습니다.`;
  return <div tabIndex={0} onKeyDown={state.onKeyDown} aria-label="네 묶음의 여섯 번 선택" className="my-8 outline-offset-4">
    <figure data-viz="ready-work" className="m-0 flex flex-col rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:p-5" style={{ height: "min(680px, calc(100svh - 140px))" }}>
      <figcaption className="mb-3 shrink-0 text-base font-semibold">{s.clock}번째 눈금의 시작 상태</figcaption>
      <div data-viz-canvas className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div role="group" aria-label="B의 첫 읽기 대기" className="mb-2 grid grid-cols-[1fr_auto_auto] items-center gap-2 text-sm"><span>B의 첫 읽기 대기</span>{([8,4] as const).map(n=><button type="button" key={n} aria-pressed={firstRead===n} onClick={()=>{setFirstRead(n);state.setPlaying(false);}} className={`min-h-10 rounded-md border px-3 ${firstRead===n?"border-sky-500 bg-sky-50 dark:bg-sky-950":"border-neutral-300 dark:border-neutral-700"}`}>{n}</button>)}</div>
        <div className="space-y-2">{names.map((name,i)=><div key={name} className={`grid min-h-9 grid-cols-[2rem_1fr_auto] items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${s.chosen===i?"border-emerald-500 bg-emerald-50 dark:bg-emerald-950":s.eligible.includes(i)?"border-sky-400":"border-neutral-200 dark:border-neutral-700"}`}><span className="font-semibold">{name}</span><span>{s.eligible.includes(i)?"다음 계산 준비됨":`${s.before[i]}에 준비 · ${s.before[i]-s.clock} 뒤`}</span><span className="text-xs">{s.chosen===i?"선택":s.eligible.includes(i)?"후보":"대기"}</span></div>)}</div>
        <svg aria-hidden="true" className="mx-auto h-7 w-6" viewBox="0 0 24 28"><path d="M12 0v23m-5-5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1"/></svg>
        <div className="rounded-full border px-3 py-2 text-center text-sm">배치4 · 준비{s.eligible.length} · 발행{s.chosen>=0?1:0}</div>
        <div aria-live="polite" className="mt-3 min-h-20 text-sm leading-6">{detail}</div>
      </div>
      <div data-viz-controls className="mt-3 shrink-0 border-t pt-3">
        <div role="group" aria-label="눈금 선택" className="grid grid-cols-6 gap-2">{Array.from({length:6},(_,i)=><button type="button" key={i} aria-label={`${i+1}번째 눈금`} aria-pressed={state.active===i} onClick={()=>state.setActive(i)} className={`min-h-10 rounded-md border text-xs ${state.active===i?"border-sky-500 bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-100":"border-neutral-300 dark:border-neutral-700"}`}>{i+1}</button>)}</div>
        <div className="mt-2 grid grid-cols-3 gap-2"><button type="button" onClick={()=>state.setActive(state.active-1)} className="min-h-10 rounded-md border text-xs">이전</button><button type="button" disabled={state.reducedMotion} onClick={()=>state.setPlaying(!state.playing)} className="min-h-10 rounded-md border text-xs disabled:opacity-60">{state.reducedMotion?"재생 꺼짐":state.playing?"일시정지":"재생"}</button><button type="button" onClick={()=>state.setActive(state.active+1)} className="min-h-10 rounded-md border text-xs">다음</button></div>
        <div className="mt-2 text-xs leading-5 text-neutral-500">← → 눈금 이동 · Space 재생/정지 · 선택 순서와 지연은 가정</div>
      </div>
    </figure>
  </div>;
}
