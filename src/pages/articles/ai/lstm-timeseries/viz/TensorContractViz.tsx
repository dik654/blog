const rows = [
  ["B · batch", "독립된 forecast origin 또는 series sample"],
  ["L · sequence", "origin 이전의 look-back step"],
  ["F · feature", "각 step에서 실제로 관측 가능한 변수"],
] as const;

export default function TensorContractViz() {
  return (
    <figure data-viz="tensor-contract" className="not-prose my-9 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6"><p className="text-sm font-bold">Tensor shape는 데이터 의미와 함께 읽는다</p></figcaption>
      <div className="grid gap-5 p-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center sm:p-6">
        <div className="rounded-lg border border-border/70 bg-background p-4">
          <p className="font-mono text-sm font-bold text-primary">X : [B, L, F]</p>
          <div className="mt-4 space-y-3">{rows.map(([axis, body]) => <div key={axis} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 text-xs leading-5"><b>{axis}</b><span className="text-muted-foreground">{body}</span></div>)}</div>
        </div>
        <span aria-hidden className="text-center text-sm text-muted-foreground">↓<span className="hidden md:inline"> → </span></span>
        <div className="space-y-3">
          <div className="rounded-lg border border-primary/35 bg-primary/[0.05] p-4"><p className="font-mono text-sm font-bold">LSTM → h</p><p className="mt-1 text-xs leading-5 text-muted-foreground">마지막 state 또는 step별 state</p></div>
          <div className="rounded-lg border border-border/70 bg-background p-4"><p className="font-mono text-sm font-bold">Ŷ : [B, H, Dᵧ]</p><p className="mt-1 text-xs leading-5 text-muted-foreground">horizon × target dimension</p></div>
        </div>
      </div>
    </figure>
  );
}
