const proof = ["A ∈ G₁", "B ∈ G₂", "C ∈ G₁"] as const;

export default function Groth16FlowViz() {
  return (
    <figure data-viz="groth16-flow" data-viz-canvas className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5"><p className="text-sm font-semibold text-foreground">QAP witness를 세 group element와 한 pairing product check로 압축한다</p><p className="mt-1 text-xs leading-5 text-muted-foreground">CRS는 relation과 secret trapdoor powers를 결속하고 public input은 verifier의 linear combination으로 proof에 다시 결속됩니다.</p></figcaption>
      <div className="grid gap-3 lg:grid-cols-[1.1fr_auto_1fr_auto_1.1fr] lg:items-stretch">
        <div className="rounded-lg border border-border bg-background p-4"><p className="text-xs font-semibold text-primary">Circuit-specific CRS</p><p className="mt-2 break-words text-xs leading-5 text-muted-foreground">QAP evaluations encoded in G₁/G₂<br/>α · β · γ · δ · τ powers</p></div>
        <span aria-hidden className="self-center text-center text-sm text-muted-foreground">→</span>
        <div className="rounded-lg border border-border bg-violet-400/5 p-4"><p className="text-xs font-semibold text-primary">Proof π</p><div className="mt-2 grid gap-2">{proof.map((item) => <span key={item} className="rounded-md border border-border bg-background px-2 py-1 font-mono text-xs">{item}</span>)}</div></div>
        <span aria-hidden className="self-center text-center text-sm text-muted-foreground">→</span>
        <div className="rounded-lg border border-emerald-400/40 bg-emerald-400/5 p-4"><p className="text-xs font-semibold text-primary">Verifier</p><p className="mt-2 break-words font-mono text-xs leading-5">multi-pairing<br/>+ final exponentiation<br/>→ accept / reject</p></div>
      </div>
    </figure>
  );
}
