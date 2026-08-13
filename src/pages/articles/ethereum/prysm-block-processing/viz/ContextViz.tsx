export default function ContextViz() {
  return (
    <figure className="my-8 rounded-xl border border-border bg-card p-5 sm:p-6">
      <figcaption className="text-sm font-bold">Block은 parent state에 적용되는 순서 있는 transaction입니다</figcaption>
      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:gap-6">
        <section className="min-w-0 border-l border-primary/60 pl-4"><p className="font-mono text-[11px] text-primary">INPUT</p><p className="mt-2 text-sm font-semibold">pre-state root + signed block</p><p className="mt-1 text-xs leading-5 text-muted-foreground">fork · slot · parent · proposer</p></section>
        <span aria-hidden className="hidden text-muted-foreground md:block">→</span>
        <section className="min-w-0 border-l border-primary/60 pl-4"><p className="font-mono text-[11px] text-primary">TRANSITION</p><p className="mt-2 text-sm font-semibold">fork별 ordered handlers</p><p className="mt-1 text-xs leading-5 text-muted-foreground">header · execution · RANDAO · operations</p></section>
        <span aria-hidden className="hidden text-muted-foreground md:block">→</span>
        <section className="min-w-0 border-l border-emerald-500/70 pl-4"><p className="font-mono text-[11px] text-emerald-600">OUTPUT</p><p className="mt-2 text-sm font-semibold">post-state root</p><p className="mt-1 text-xs leading-5 text-muted-foreground">모든 검증을 통과한 deterministic result</p></section>
      </div>
    </figure>
  );
}
