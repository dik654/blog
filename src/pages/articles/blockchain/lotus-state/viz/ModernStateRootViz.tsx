const STAGES = [
  { step: "01", title: "Resolve", detail: "robust address → f0100" },
  { step: "02", title: "Actor record", detail: "Code · Head · nonce · balance" },
  { step: "03", title: "Actor state", detail: "Head → HAMT/AMT child roots" },
  { step: "04", title: "Flush", detail: "surviving updates → new root CID" },
] as const;

export default function ModernStateRootViz() {
  return (
    <div
      data-viz="lotus-state-root-pipeline"
      className="not-prose min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            한 actor mutation의 root lineage
          </p>
          <h3 className="mt-2 text-base font-semibold">
            주소를 해석한 뒤 record와 child state를 바꾸고 새 root를 봉인한다
          </h3>
        </div>
        <span className="rounded-md border border-border px-2 py-1 font-mono text-xs text-muted-foreground">
          f0100 · nonce 7→8
        </span>
      </div>
      <ol className="mt-5 grid min-w-0 gap-4 md:grid-cols-4">
        {STAGES.map((stage, index) => (
          <li key={stage.step} className="relative min-w-0">
            <div className="h-full rounded-lg border border-border bg-background p-4">
              <p className="font-mono text-xs text-primary">{stage.step}</p>
              <p className="mt-2 font-semibold">{stage.title}</p>
              <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
                {stage.detail}
              </p>
            </div>
            {index < STAGES.length - 1 && (
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
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <p className="rounded-lg bg-muted/30 p-3 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Read:</strong> 가장 위 snapshot layer에서
          찾고, 없을 때만 base HAMT로 내려갑니다.
        </p>
        <p className="rounded-lg bg-muted/30 p-3 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Commit:</strong> revert되지 않은 변경만
          canonical encoding으로 저장합니다.
        </p>
      </div>
    </div>
  );
}
