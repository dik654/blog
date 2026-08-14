const SERVICES = [
  { step: "01", title: "Ethereum L1", detail: "execution RPC · beacon data · batch origin" },
  { step: "02", title: "op-node", detail: "rollup config · derivation · fork choice" },
  { step: "03", title: "Engine API", detail: "shared JWT · versioned payload handoff" },
  { step: "04", title: "op-reth", detail: "EVM execution · state root · JSON-RPC" },
] as const;

export default function ModernGiwaNodeViz() {
  return (
    <div
      data-viz="giwa-node-derivation-handoff"
      className="not-prose min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            GIWA verifier node · pinned generation
          </p>
          <h3 className="mt-2 text-base font-semibold">
            L1 input을 op-node가 해석하고 op-reth가 실행한다
          </h3>
        </div>
        <span className="rounded-md border border-border px-2 py-1 font-mono text-xs text-muted-foreground">
          node v0.6.0
        </span>
      </div>
      <ol className="mt-5 grid min-w-0 gap-4 md:grid-cols-4">
        {SERVICES.map((service, index) => (
          <li key={service.step} className="relative min-w-0">
            <div className="h-full rounded-lg border border-border bg-background p-4">
              <p className="font-mono text-xs text-primary">{service.step}</p>
              <p className="mt-2 font-semibold">{service.title}</p>
              <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
                {service.detail}
              </p>
            </div>
            {index < SERVICES.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute -bottom-3 left-1/2 text-xs text-muted-foreground md:-right-3 md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2"
              >
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </span>
            )}
          </li>
        ))}
      </ol>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["unsafe", "sequencer가 만든 최신 head"],
          ["safe", "L1 batch에서 derivation된 head"],
          ["finalized", "해당 L1 origin이 finalized된 head"],
        ].map(([label, detail]) => (
          <div key={label} className="rounded-lg bg-muted/30 p-3">
            <p className="font-mono text-xs font-semibold text-primary">{label}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
