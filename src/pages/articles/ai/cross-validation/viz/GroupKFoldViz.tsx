const groups = [
  ["Patient A", "1,240 rows", "Site 1", "train"],
  ["Patient B", "780 rows", "Site 1", "train"],
  ["Patient C", "2,110 rows", "Site 2", "validation"],
  ["Patient D", "430 rows", "Site 2", "validation"],
];

export default function GroupKFoldViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Group manifest</p>
      <h3 className="mt-1 text-lg font-semibold">행을 섞지 않고 공유 원인을 가진 묶음 전체를 이동합니다</h3>
      <div className="mt-5 grid gap-x-6 gap-y-3 md:grid-cols-2">
        {groups.map(([group, rows, site, side]) => (
          <div key={group} className="grid grid-cols-[1fr_auto] gap-3 border-b border-border/60 py-3 first:pt-0 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0">
            <div><p className="text-sm font-semibold">{group}</p><p className="mt-1 text-xs text-muted-foreground">{rows} · {site}</p></div>
            <span className="self-start rounded-md border border-border/70 px-2 py-1 text-[11px] font-semibold text-muted-foreground">{side}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2"><p className="rounded-md bg-muted/40 px-3 py-2">row count · 4,560</p><p className="rounded-md bg-muted/40 px-3 py-2">독립 patient 수 · 4</p></div>
    </div>
  );
}
