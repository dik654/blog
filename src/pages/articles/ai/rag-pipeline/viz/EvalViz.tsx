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
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-left text-xs">
          <thead><tr className="border-y border-border text-muted-foreground"><th className="py-2 pr-4">Stage</th><th className="py-2 pr-4">질문</th><th className="py-2 pr-4">Evidence</th><th className="py-2">Owner</th></tr></thead>
          <tbody>{rows.map(([stage, question, metric, owner]) => <tr key={stage} className="border-b border-border/70"><td className="py-3 pr-4 font-semibold">{stage}</td><td className="py-3 pr-4 text-muted-foreground">{question}</td><td className="py-3 pr-4">{metric}</td><td className="py-3 text-muted-foreground">{owner}</td></tr>)}</tbody>
        </table>
      </div>
    </figure>
  );
}
