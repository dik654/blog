const JOBS = [
  { kind: "Sealing", context: "sector · upstream digest", done: "active actor state" },
  { kind: "WinningPoSt", context: "epoch · base · randomness", done: "valid block candidate" },
  { kind: "WindowPoSt", context: "deadline · partition", done: "included proof message" },
] as const;

export default function ModernProviderDutyViz() {
  return <div data-viz="lotus-provider-duty-router" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">task admission → fenced worker → chain completion</p><div className="mt-4 grid min-w-0 gap-3 lg:grid-cols-3">{JOBS.map((job, index) => <article key={job.kind} className="min-w-0 rounded-lg border border-border bg-muted/20 p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">{job.kind}</h3><span className="font-mono text-xs text-primary">0{index + 1}</span></div><p className="mt-3 break-words font-mono text-xs leading-5 text-muted-foreground">입력 · {job.context}</p><p className="mt-3 border-t border-border pt-3 text-sm">완료 · {job.done}</p></article>)}</div><div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground"><span className="rounded-md border border-border px-2 py-1">profile 고정</span><span className="rounded-md border border-border px-2 py-1">lease fencing</span><span className="rounded-md border border-border px-2 py-1">independent verify</span><span className="rounded-md border border-border px-2 py-1">reorg-aware receipt</span></div></div>;
}
