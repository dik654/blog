const rows = [
  ["Retrieval", "정답 후보를 가져왔나", "Recall@k · NDCG@k", "Retriever·fusion·reranker"],
  ["Context", "정답 span이 prompt에 남았나", "Span coverage · distractor ratio", "Chunk·dedup·budget"],
  ["Answer", "주장이 근거와 맞나", "Correctness · faithfulness · abstain", "Prompt·generator"],
  ["Citation", "주장과 source가 연결됐나", "Precision · recall · source validity", "Claim linker·validator"],
  ["System", "운영 경계를 지켰나", "p95 · cost · ACL · injection", "Gateway·policy·runtime"],
] as const;

export default function EvalViz() {
  return (
    <figure data-viz className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <figcaption>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Layered evaluation</p>
        <p className="mt-1 font-semibold">낮은 점수를 “RAG가 나쁘다”로 뭉개지 않고 고칠 stage까지 연결합니다</p>
      </figcaption>
      <div className="mt-4 grid border-y border-border sm:hidden">
        {rows.map(([stage, question, evidence, owner], index) => (
          <div
            key={stage}
            className="grid grid-cols-[1.1rem_minmax(0,1fr)] gap-2 border-b border-border/70 py-2.5 last:border-b-0"
          >
            <span className="pt-0.5 font-mono text-[9px] text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p className="break-keep text-xs font-bold">{stage} · {question}</p>
              <p className="mt-1 break-keep text-[11px] leading-5 text-muted-foreground">
                근거 {evidence}
              </p>
              <p className="mt-1 break-keep text-[11px] leading-5">
                수정 {owner}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden sm:block">
        <ResponsiveVizTable columns={["Stage", "질문", "Evidence", "Owner"]} rows={rows} desktopMinWidthClassName="min-w-[44rem]" />
      </div>
    </figure>
  );
}
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
