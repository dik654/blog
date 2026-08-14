const stages = [
  { label: "Setup", sub: "relation → pk, vk", tone: "border-slate-400/40" },
  { label: "Prove", sub: "pk, x, w → π", tone: "border-border" },
  { label: "Verify", sub: "vk, x, π → bool", tone: "border-emerald-400/40" },
] as const;

export default function SNARKInterfaceViz() {
  return (
    <figure data-viz="snark-interface" data-viz-canvas className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5"><p className="text-sm font-semibold text-foreground">Relation은 고정하고 instance와 witness의 공개 범위를 나눈다</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Proof π는 verifier가 witness 없이 relation membership을 검사하도록 만든 cryptographic artifact입니다.</p></figcaption>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
        {stages.map((stage, index) => (
          <div key={stage.label} className="contents">
            <div className={`min-w-0 rounded-lg border bg-background p-4 ${stage.tone}`}><p className="text-xs font-semibold text-primary">{stage.label}</p><p className="mt-2 break-words font-mono text-xs leading-5 text-muted-foreground">{stage.sub}</p></div>
            {index < stages.length - 1 ? <span aria-hidden className="self-center text-center text-sm text-muted-foreground">→</span> : null}
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-3"><p className="text-xs font-semibold">Completeness</p><p className="mt-1 text-xs leading-5 text-muted-foreground">참인 statement와 올바른 witness는 accept</p></div>
        <div className="rounded-lg border border-border bg-background p-3"><p className="text-xs font-semibold">Soundness</p><p className="mt-1 text-xs leading-5 text-muted-foreground">거짓 statement의 accept 확률을 제한</p></div>
        <div className="rounded-lg border border-border bg-background p-3"><p className="text-xs font-semibold">Zero knowledge</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Validity 밖의 witness 정보를 숨김</p></div>
      </div>
    </figure>
  );
}
