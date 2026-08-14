const rounds = [
  ["ARK", "round constants"],
  ["S-box", "full: all lanes · partial: selected lane"],
  ["Mix", "MDS / pinned sparse transform"],
] as const;

export function PoseidonKernelViz() {
  return (
    <figure className="not-prose my-8 rounded-xl border border-border bg-background p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-bold">Parameter artifact에서 batch tree까지</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Kernel은 profile이 정한 round를 실행할 뿐, constants나 tree semantics를 임의로 고르지 않습니다.</p>
      </figcaption>
      <div className="grid min-w-0 gap-3 lg:grid-cols-[1fr_1.7fr_1fr]">
        <div className="min-w-0 rounded-lg border border-border bg-muted/20 p-4"><p className="text-xs font-bold text-primary">Profile</p><p className="mt-2 break-words text-xs leading-5">field · width · rate/capacity · α · RF/RP · constants digest</p></div>
        <div className="grid min-w-0 gap-2 sm:grid-cols-3">{rounds.map(([title, detail]) => <div key={title} className="min-w-0 rounded-lg border border-border bg-background p-3"><p className="text-xs font-semibold">{title}</p><p className="mt-1 break-words text-[11px] leading-4 text-muted-foreground">{detail}</p></div>)}</div>
        <div className="min-w-0 rounded-lg border border-border bg-muted/20 p-4"><p className="text-xs font-bold text-primary">Batch / tree</p><p className="mt-2 break-words text-xs leading-5">independent states → level frontier → root + receipt</p></div>
      </div>
    </figure>
  );
}
