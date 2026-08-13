const source = [
  ["§4 환불", "기본 조건과 적용 시점"],
  ["§4.1 예외", "기업 계약은 별도 표 적용"],
  ["표 2", "기간별 환불률 · header 필요"],
] as const;

export default function ChunkingViz() {
  return (
    <figure data-viz className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <figcaption>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Boundary and recovery</p>
        <p className="mt-1 font-semibold">작은 child로 찾되 답할 때는 필요한 parent 구조를 복원합니다</p>
      </figcaption>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="divide-y divide-border border-y border-border">
          {source.map(([title, body], index) => (
            <div key={title} className="grid grid-cols-[3.7rem_1fr] gap-3 py-3">
              <span className="text-xs font-semibold text-muted-foreground">원문 {index + 1}</span>
              <div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p></div>
            </div>
          ))}
        </div>
        <div className="hidden text-muted-foreground lg:block" aria-hidden="true">→</div>
        <div className="space-y-4">
          <div className="border-l border-primary pl-4">
            <p className="text-xs font-semibold text-primary">검색 child</p>
            <p className="mt-1 text-sm">“기업 계약은 별도 표 적용”</p>
          </div>
          <div className="border-l border-border pl-4">
            <p className="text-xs font-semibold text-muted-foreground">복원 parent</p>
            <p className="mt-1 text-sm leading-6">§4 기본 조건 + §4.1 예외 + 표 2 header와 해당 row</p>
          </div>
          <p className="text-xs leading-5 text-muted-foreground">검색 precision과 generation에 필요한 문맥 크기를 같은 chunk 하나에 억지로 맡기지 않습니다.</p>
        </div>
      </div>
    </figure>
  );
}
