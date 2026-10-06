import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";

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
      <ResponsiveVizTable columns={["문서", "Dense rank", "Sparse rank", "RRF", "ACL", "Rerank"]} rows={candidates} firstColumnClassName="font-mono" />
      <p className="mt-4 text-xs leading-5 text-muted-foreground">d-91은 관련성이 높아도 권한이 없으므로 reranker와 prompt로 넘어가지 않습니다. “검색 후 삭제”와 다른 경계입니다.</p>
    </figure>
  );
}
