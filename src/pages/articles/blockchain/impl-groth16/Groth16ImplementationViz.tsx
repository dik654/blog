export function Groth16ImplementationViz() {
  const stages = [
    ["artifact profile", "circuit · R1CS · key digest"],
    ["witness", "public/private layout parity"],
    ["QAP quotient", "FFT domain and divisibility"],
    ["MSM plan", "A · B · C · H queries"],
    ["proof receipt", "A∈G1 · B∈G2 · C∈G1"],
  ];
  return (
    <div data-viz="groth16-implementation-pipeline" className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">one pinned proving workload</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stages.map(([title, detail], index) => (
          <div key={title} className="min-w-0 rounded-lg border border-border bg-muted/20 p-4">
            <div className="flex items-center gap-2"><span className="grid size-6 shrink-0 place-items-center rounded-full border border-primary/40 text-xs font-semibold text-primary">{index + 1}</span><p className="break-words font-semibold">{title}</p></div>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
