export function FilecoinProofStackViz() {
  const rows = [
    ["PoRep", "seal_*", "replica relation"],
    ["WindowPoSt", "window_post", "deadline storage"],
    ["WinningPoSt", "winning_post", "epoch eligibility"],
  ];
  return <div data-viz="rust-fil-proofs-api-router" className="rounded-xl border border-border bg-card p-4 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">claim → config → pinned API → receipt</p><div className="mt-4 space-y-3">{rows.map(([claim, api, output]) => <div key={claim} className="grid min-w-0 gap-2 rounded-lg border border-border bg-muted/20 p-4 sm:grid-cols-[0.8fr_1fr_1.2fr] sm:items-center"><p className="font-semibold">{claim}</p><code className="break-words text-sm text-primary">{api}</code><p className="break-words text-sm text-muted-foreground">{output}</p></div>)}</div></div>;
}
