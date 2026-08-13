const rows = [
  ["Trainable scope", "head", "upper+head", "all"],
  ["Activation/optimizer memory", "낮음", "중간", "높음"],
  ["Representation change", "없음", "부분", "전체"],
  ["통과 질문", "pipeline 정상?", "partial gain?", "full gain pays?"],
];

export default function FeatureVsFinetuneViz() {
  return <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
    <figcaption className="border-b border-border px-4 py-4 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">Fair comparison</p><h3 className="mt-1 text-base font-semibold sm:text-lg">Score 한 칸이 아니라 evidence와 system cost가 있는 비교표를 만듭니다</h3></figcaption>
    <div className="px-4 py-5 sm:px-6"><div className="overflow-x-auto"><div className="min-w-[40rem] grid grid-cols-4 border-y border-border text-sm">
      {['Criterion','Fixed','Partial','Full'].map((v,i)=><div key={v} className={`${i?'border-l ':''}border-border px-3 py-3 font-semibold`}>{v}</div>)}
      {rows.flatMap(row=>row.map((v,i)=><div key={`${row[0]}-${i}`} className={`${i?'border-l ':''}border-t border-border px-3 py-3 ${i===0?'font-semibold':'text-muted-foreground'}`}>{v}</div>))}
    </div></div><p className="mt-5 border-l border-indigo-500 pl-4 text-sm text-muted-foreground">Mean ± seed uncertainty · worst slice · calibration · wall time · peak memory를 같은 row에 기록합니다.</p></div>
  </figure>;
}
