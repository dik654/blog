const rows = [
  ["Source", "규정 v17 · ACL=employee", "정답이 존재하고 요청자가 읽을 수 있는가"],
  ["Chunk", "§4.2 · chars 1180–1540", "근거 위치와 구조가 보존됐는가"],
  ["Index", "emb-v6 · corpus-2026-08", "Query와 document가 같은 공간인가"],
  ["Retrieve", "rank 2 · rerank .91", "정답 후보가 generation까지 남았는가"],
  ["Answer", "claim c2 → chunk 8f31", "주장과 원문을 다시 확인할 수 있는가"],
] as const;

export default function OverviewViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-3 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Answer-to-source trace</p>
        <p className="mt-1 font-semibold">답변 한 줄에서 검색 전 source revision까지 거슬러 올라갑니다</p>
      </figcaption>
      <div className="divide-y divide-border">
        {rows.map(([stage, receipt, check], index) => (
          <div key={stage} className="grid gap-2 px-4 py-3 sm:grid-cols-[5rem_11rem_1fr] sm:items-center sm:px-5">
            <p className="text-xs font-semibold text-muted-foreground">{String(index + 1).padStart(2, "0")} · {stage}</p>
            <p className="break-words font-mono text-xs text-foreground">{receipt}</p>
            <p className="text-sm leading-6 text-muted-foreground">{check}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
