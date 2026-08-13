const rows = [
  ["Unstructured", "weight 하나", "values + indices", "범용 sparse kernel", "아주 높은 sparsity에서 저장·traffic"],
  ["N:M", "M개 중 N개", "고정 local pattern", "지원 sparse MMA", "적격 operator의 처리량"],
  ["Structured", "channel · head · block", "작아진 dense tensor", "일반 dense kernel", "shape·FLOPs·latency"],
] as const;

export default function OverviewViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-card">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">제거 단위에서 runtime까지</p>
        <h3 className="mt-1 text-base font-semibold">같은 sparsity라도 실행 계약은 다릅니다</h3>
      </figcaption>
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[1.05fr_1fr_1.2fr_1.2fr_1.55fr] border-b border-border bg-muted/25 px-5 py-2.5 text-xs font-medium text-muted-foreground">
            <span>방식</span><span>제거 단위</span><span>artifact</span><span>필요 operator</span><span>직접 얻는 효과</span>
          </div>
          {rows.map((row) => (
            <div key={row[0]} className="grid grid-cols-[1.05fr_1fr_1.2fr_1.2fr_1.55fr] border-b border-border/70 px-5 py-3 text-sm last:border-b-0">
              <strong>{row[0]}</strong>
              {row.slice(1).map((cell) => <span key={cell} className="pr-3 text-muted-foreground">{cell}</span>)}
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-3">
        {[["01", "Mask", "무엇을 남겼는가"], ["02", "Lowering", "어떤 tensor·format이 되었는가"], ["03", "Runtime", "어떤 kernel이 실제 선택됐는가"]].map(([n, title, body]) => (
          <div key={n} className="min-w-0 bg-card px-4 py-3">
            <p className="text-[11px] font-medium text-muted-foreground">{n}</p>
            <p className="mt-0.5 text-sm font-semibold">{title}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
