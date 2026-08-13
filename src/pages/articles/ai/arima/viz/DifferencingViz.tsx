export default function DifferencingViz() {
  return (
    <figure data-viz="differencing" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6"><p className="text-sm font-bold">차분은 level을 없애고 increment를 모델링한다</p></figcaption>
      <div className="grid items-center gap-4 p-4 sm:grid-cols-[1fr_auto_1fr] sm:p-6">
        <div className="rounded-lg border border-border/70 bg-background p-4"><p className="text-xs font-bold text-muted-foreground">원 series</p><div className="mt-4 flex h-20 items-end gap-2">{[24,31,37,48,54,63,70].map((h,i)=><span key={i} className="min-w-0 flex-1 rounded-t-sm bg-primary/20" style={{height:`${h}%`}} />)}</div><p className="mt-3 text-xs text-muted-foreground">상승 level + 변화</p></div>
        <div className="text-center"><p className="font-mono text-sm font-bold text-primary">Δ</p><p className="mt-1 text-xs text-muted-foreground">Yₜ−Yₜ₋₁</p></div>
        <div className="rounded-lg border border-primary/35 bg-primary/[0.045] p-4"><p className="text-xs font-bold text-muted-foreground">차분 series</p><div className="mt-4 flex h-20 items-center gap-2">{[38,57,46,66,42,59].map((h,i)=><span key={i} className="min-w-0 flex-1 rounded-sm bg-primary/45" style={{height:`${Math.max(8,h/3)}%`}} />)}</div><p className="mt-3 text-xs text-muted-foreground">변화량의 의존성</p></div>
      </div>
      <p className="border-t border-border/60 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-6">과도한 차분은 유용한 low-frequency signal을 지우고 innovation variance를 키울 수 있습니다.</p>
    </figure>
  );
}
