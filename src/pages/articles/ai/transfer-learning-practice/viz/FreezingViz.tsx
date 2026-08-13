const rows = [
  ["Lower backbone", "off", "제외", "eval/fixed", "완전 고정"],
  ["Upper backbone", "stage별", "stage별", "명시", "partial 후보"],
  ["New task head", "on", "포함", "train", "target 학습"],
];

export default function FreezingViz() {
  return <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
    <figcaption className="border-b border-border px-4 py-4 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">Freeze audit</p><h3 className="mt-1 text-base font-semibold sm:text-lg">Gradient·optimizer·module buffer를 서로 다른 열에서 확인합니다</h3></figcaption>
    <div className="px-4 py-5 sm:px-6">
      <div className="overflow-x-auto"><div className="min-w-[38rem] grid grid-cols-[9rem_6rem_7rem_7rem_1fr] border-y border-border text-sm">
        {['Layer','requires_grad','optimizer','module mode','의미'].map((v,i)=><div key={v} className={`${i?'border-l ':''}border-border px-3 py-3 font-semibold text-muted-foreground`}>{v}</div>)}
        {rows.flatMap(row=>row.map((v,i)=><div key={`${row[0]}-${i}`} className={`${i?'border-l ':''}border-t border-border px-3 py-3 ${i===0?'font-semibold':'text-muted-foreground'}`}>{v}</div>))}
      </div></div>
      <p className="mt-5 border-l border-sky-500 pl-4 text-sm text-muted-foreground">BatchNorm running mean·variance는 parameter가 아니라 buffer이므로 requires_grad만으로 멈추지 않습니다.</p>
    </div>
  </figure>;
}
