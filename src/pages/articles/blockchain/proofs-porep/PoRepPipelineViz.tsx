export function PoRepPipelineViz() {
  const stages = [
    ["PC1", "CommD · ReplicaID · labels"],
    ["PC2", "encode replica · TreeC/TreeRLast"],
    ["C1", "vanilla challenges · circuit inputs"],
    ["C2", "SNARK bytes · independent verify"],
  ];
  return <div data-viz="porep-phase-artifacts" className="rounded-xl border border-border bg-card p-4 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">one sector · four typed phase receipts</p><div className="mt-4 grid gap-3 md:grid-cols-4">{stages.map(([title, detail], i) => <div key={title} className="min-w-0 rounded-lg border border-border bg-muted/20 p-4"><span className="text-xs font-semibold text-primary">0{i + 1}</span><p className="mt-2 font-semibold">{title}</p><p className="mt-1 break-words text-sm leading-6 text-muted-foreground">{detail}</p></div>)}</div></div>;
}
