import { useState } from "react";

/** 설명용 1차원 모델. 학습된 encoder나 로봇 제어기를 실행하지 않습니다. */
export default function WorldPlanningViz(){
  const [observed,setObserved]=useState(false);
  const position=observed?0.8:0;
  const plans=[[-1,-1],[-1,1],[1,-1],[1,1]];
  const rows=plans.map(actions=>({actions,end:position+actions[0]+actions[1],cost:(position+actions[0]+actions[1]-2)**2}));
  const best=Math.min(...rows.map(r=>r.cost));
  return <figure className="my-8 rounded-xl border p-4 sm:p-6" aria-label="관측에서 후보 예측과 행동을 거쳐 다시 관측하는 과정">
    <figcaption className="mb-4 text-base font-semibold">같은 관측에서 네 후보를 비교한다 · 가정 모형</figcaption>
    <div className="flex flex-wrap items-center gap-3 text-sm leading-6">
      <span className="border-b-2 border-sky-500 px-2 py-1">관측 x={position.toFixed(1)}</span><span aria-hidden="true">→</span>
      <span className="border-b-2 border-violet-500 px-2 py-1">모델 x′=x+a로 두 번 예측</span><span aria-hidden="true">→</span>
      <span className="border-b-2 border-emerald-500 px-2 py-1">목표 2와 비교</span>
    </div>
    <div className="my-5 overflow-x-auto">
      <table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="p-2">행동 두 개</th><th className="p-2">예측 위치</th><th className="p-2">목표와 제곱거리</th></tr></thead>
        <tbody>{rows.map(r=><tr key={r.actions.join(',')} className={r.cost===best?'border-b bg-emerald-50 dark:bg-emerald-950/30':'border-b'}><td className="p-2">{r.actions.map(a=>a>0?'+1':'−1').join(', ')}</td><td className="p-2 font-mono">{r.end.toFixed(1)}</td><td className="p-2 font-mono">{r.cost.toFixed(2)}{r.cost===best?' · 최소':''}</td></tr>)}</tbody>
      </table>
    </div>
    <div className="flex flex-wrap gap-3"><button className="rounded border px-4 py-2 text-sm disabled:opacity-50" disabled={observed} onClick={()=>setObserved(true)}>첫 행동 +1 실행 후 관측</button><button className="rounded border px-4 py-2 text-sm" onClick={()=>setObserved(false)}>초기 관측으로</button></div>
    <p aria-live="polite" className="mt-4 text-sm leading-7">{observed?'모델은 첫 위치를 1.0으로 예상했지만 실제 관측은 0.8입니다. 새 계획은 관측 0.8에서 시작합니다. 목표 도달 보장은 별도입니다.':'지금은 모델 안에서만 후보를 비교했습니다. 첫 행동을 실제로 실행하면 새 관측으로 예측 오차를 확인할 수 있습니다.'}</p>
  </figure>;
}
