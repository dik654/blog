export default function ContextViz() {
  return (
    <figure className="my-8 rounded-xl border border-border bg-card p-5 sm:p-6">
      <figcaption className="text-sm font-bold">Epoch processing은 32개 slot 동안 쌓인 증거를 다음 epoch의 장부로 접습니다</figcaption>
      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:gap-6">
        <section className="min-w-0 border-l border-primary/60 pl-4"><p className="font-mono text-[11px] text-primary">OBSERVE</p><p className="mt-2 text-sm font-semibold">participation · checkpoint</p><p className="mt-1 text-xs leading-5 text-muted-foreground">현재·이전 epoch의 누적 evidence</p></section>
        <span aria-hidden className="hidden text-muted-foreground md:block">→</span>
        <section className="min-w-0 border-l border-primary/60 pl-4"><p className="font-mono text-[11px] text-primary">ACCOUNT</p><p className="mt-2 text-sm font-semibold">finality · balance · queue</p><p className="mt-1 text-xs leading-5 text-muted-foreground">순서를 지키는 deterministic transition</p></section>
        <span aria-hidden className="hidden text-muted-foreground md:block">→</span>
        <section className="min-w-0 border-l border-emerald-500/70 pl-4"><p className="font-mono text-[11px] text-emerald-600">PREPARE</p><p className="mt-2 text-sm font-semibold">next-epoch state</p><p className="mt-1 text-xs leading-5 text-muted-foreground">rotation · lookahead · post-state root</p></section>
      </div>
    </figure>
  );
}
