const folds = [[0,4,5],[0,5,6],[0,6,7]] as const;

export default function TemporalValidationViz() {
  return (
    <figure data-viz="temporal-validation" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6"><p className="text-sm font-bold">Rolling-origin evaluation은 forecast origin을 앞으로 옮긴다</p><p className="mt-1 text-xs leading-5 text-muted-foreground">미래를 학습 구간에 섞지 않은 채 여러 시점에서 같은 horizon을 시험합니다.</p></figcaption>
      <div className="space-y-4 p-4 sm:p-6">
        {folds.map(([start,trainEnd,test],i)=><div key={i} className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-3"><span className="font-mono text-xs font-bold text-muted-foreground">Fold {i+1}</span><div className="grid grid-cols-8 gap-1">{Array.from({length:8},(_,j)=><span key={j} className={`h-7 rounded-sm border ${j>=start&&j<trainEnd?"border-primary/20 bg-primary/15":j===test?"border-amber-500/35 bg-amber-500/15":"border-border/50 bg-muted/20"}`} title={j===test?"validation origin":j<trainEnd?"train":"unused"} />)}</div></div>)}
      </div>
      <div className="flex gap-5 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground sm:px-6"><span><i className="mr-2 inline-block h-2 w-2 rounded-sm bg-primary/30" />train</span><span><i className="mr-2 inline-block h-2 w-2 rounded-sm bg-amber-500/30" />forecast</span></div>
    </figure>
  );
}
