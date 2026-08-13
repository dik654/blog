const LAYERS = [
  { title: "Consensus layer · Prysm", detail: "head · safe · finalized · proposer duty" },
  { title: "인증된 Engine JSON-RPC", detail: "versioned method · JWT · ordered calls" },
  { title: "Execution client", detail: "payload validation · canonical execution view · build" },
] as const;

export default function ContextViz() {
  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-border bg-card p-5 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">ownership boundary</p>
        <p className="mt-2 text-base font-bold">합의 판단과 EVM 실행 사이에는 상태가 있는 프로토콜이 놓입니다</p>
      </figcaption>
      <div className="grid min-w-0 gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:gap-6">
        {LAYERS.map((layer, index) => (
          <div key={layer.title} className="contents">
            <section className="min-w-0 border-l border-primary/60 pl-4">
              <p className="font-mono text-[11px] text-muted-foreground">0{index + 1}</p>
              <h3 className="mt-1 break-words text-sm font-bold">{layer.title}</h3>
              <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{layer.detail}</p>
            </section>
            {index < LAYERS.length - 1 ? (
              <span aria-hidden className="hidden text-muted-foreground md:block">→</span>
            ) : null}
          </div>
        ))}
      </div>
    </figure>
  );
}
