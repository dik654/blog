const steps = [
  ["은행 입금", "eligible customer · fiat rail"],
  ["USDC mint", "issuer ledger · chain supply"],
  ["CCTP burn", "source domain · message nonce"],
  ["attest → mint", "destination domain · replay check"],
] as const;

export default function UsdcLifecycleViz() {
  return (
    <figure data-viz="usdc-lifecycle" className="not-prose my-8 rounded-xl border border-border bg-background p-5">
      <figcaption><p className="text-sm font-bold">발행·상환과 CCTP는 서로 다른 원장 흐름이다</p><p className="mt-1 text-xs leading-5 text-muted-foreground">준비금은 issuer liability를, CCTP attestation은 특정 burn message를 뒷받침합니다.</p></figcaption>
      <div data-viz-canvas className="mt-5 grid gap-3 sm:grid-cols-4">
        {steps.map(([title, note], index) => <div key={title} className="min-w-0 border-t border-primary/60 pt-3"><p className="text-xs font-mono text-primary">0{index + 1}</p><p className="mt-2 text-sm font-semibold">{title}</p><p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{note}</p></div>)}
      </div>
    </figure>
  );
}
