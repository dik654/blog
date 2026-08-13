const steps = [
  ["1", "Raw split", "시간 cutoff를 먼저 고정"],
  ["2", "Fit", "결측·scaler는 train만"],
  ["3", "Window", "각 origin의 과거만 입력"],
  ["4", "Refit", "rolling fold마다 다시 추정"],
] as const;

export default function LeakageBoundaryViz() {
  return (
    <figure data-viz="leakage-boundary" className="not-prose my-9 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6"><p className="text-sm font-bold">경계는 history를 끊는 선이 아니라 미래 지식을 막는 선이다</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Validation 첫 예측은 train 마지막 구간을 look-back으로 써도 되지만, transform과 target은 미래를 미리 보면 안 됩니다.</p></figcaption>
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
        {steps.map(([n, title, body]) => <div key={n} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-lg border border-border/70 bg-background p-4"><span className="font-mono text-xs font-black text-primary">{n}</span><div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p></div></div>)}
      </div>
      <div className="border-t border-border/60 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-6"><b className="text-foreground">허용:</b> origin 이전의 train history · <b className="text-foreground">금지:</b> validation 전체로 scaler fit, 미래 target로 feature 생성</div>
    </figure>
  );
}
