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
      <ResponsiveVizTable columns={["Stage", "질문", "Evidence", "Owner"]} rows={rows} desktopMinWidthClassName="min-w-[44rem]" />
    </figure>
  );
}
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
