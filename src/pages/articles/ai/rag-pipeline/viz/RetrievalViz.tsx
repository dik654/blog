const candidates = [
  ["d-17", "2", "1", "0.0325", "허용", "1"],
  ["d-04", "1", "—", "0.0164", "허용", "3"],
  ["d-91", "—", "2", "0.0161", "차단", "제외"],
  ["d-22", "5", "4", "0.0308", "허용", "2"],
] as const;

export default function RetrievalViz() {
  return (
    <figure data-viz className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <figcaption>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Candidate funnel</p>
        <p className="mt-1 font-semibold">두 검색 목록을 합치고 ACL을 적용한 뒤 reranker가 허가 후보만 읽습니다</p>
      </figcaption>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-xs">
          <thead><tr className="border-y border-border text-muted-foreground"><th className="py-2 pr-3">문서</th><th className="py-2 pr-3">Dense rank</th><th className="py-2 pr-3">Sparse rank</th><th className="py-2 pr-3">RRF</th><th className="py-2 pr-3">ACL</th><th className="py-2">Rerank</th></tr></thead>
          <tbody>{candidates.map(row => <tr key={row[0]} className="border-b border-border/70">{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={`py-3 pr-3 ${index === 0 ? "font-mono font-semibold" : "text-muted-foreground"}`}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">d-91은 관련성이 높아도 권한이 없으므로 reranker와 prompt로 넘어가지 않습니다. “검색 후 삭제”와 다른 경계입니다.</p>
    </figure>
  );
}
