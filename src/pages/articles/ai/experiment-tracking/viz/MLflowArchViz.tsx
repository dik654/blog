const backend = ["run / model IDs", "params · metrics · tags", "artifact URI · signature"];
const objects = ["model weights", "prediction tables", "evaluation reports"];

export default function MLflowArchViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">MLflow storage boundary</p>
      <h3 className="mt-1 text-lg font-semibold">Metadata와 큰 object는 따로 저장하지만 같은 lifecycle로 복구합니다</h3>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="rounded-lg border border-border/60 bg-background p-4">
          <p className="text-sm font-semibold">Backend store</p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">query · transaction · migration</p>
          <div className="mt-4 space-y-2">{backend.map(item => <p key={item} className="border-t border-border/50 pt-2 text-xs">{item}</p>)}</div>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3 text-center">
          <p className="font-mono text-[11px] font-semibold">artifact_uri</p>
          <p className="mt-1 text-[11px] text-muted-foreground">+ digest · schema</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background p-4">
          <p className="text-sm font-semibold">Artifact store</p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">large bytes · object versioning</p>
          <div className="mt-4 space-y-2">{objects.map(item => <p key={item} className="border-t border-border/50 pt-2 text-xs">{item}</p>)}</div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[["Backup", "같은 recovery point"],["Access", "server/client credential 경계"],["Integrity", "dangling URI 주기 검사"]].map(([a,b]) => <div key={a} className="rounded-lg border border-border/60 px-4 py-3"><p className="text-xs font-semibold">{a}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{b}</p></div>)}
      </div>
    </div>
  );
}
