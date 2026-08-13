const stages = [
  {
    index: "01",
    role: "Question",
    name: "Query q",
    body: "현재 token 또는 decoder state가 무엇을 찾는지 표현합니다.",
    note: "shape · nq × dk",
  },
  {
    index: "02",
    role: "Address",
    name: "Keys K",
    body: "각 source 위치를 query와 비교할 수 있는 주소로 바꿉니다.",
    note: "score · QKᵀ",
  },
  {
    index: "03",
    role: "Selection",
    name: "Weights A",
    body: "mask와 softmax를 거쳐 query별 합이 1인 분포를 만듭니다.",
    note: "row-wise softmax",
  },
  {
    index: "04",
    role: "Content",
    name: "Values V → Z",
    body: "선택된 위치의 content를 weight로 섞어 새 representation을 만듭니다.",
    note: "output · AV",
  },
];

export default function AttentionPipelineViz() {
  return (
    <figure
      data-viz="attention-pipeline"
      className="not-prose my-9 overflow-hidden rounded-xl border border-border/75 bg-card"
    >
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Canonical computation</p>
        <p className="mt-1 font-semibold">Attention은 score 함수가 아니라 선택하고 읽는 전체 경로입니다</p>
      </figcaption>
      <div className="grid gap-px bg-border/60 md:grid-cols-4">
        {stages.map((stage) => (
          <div key={stage.index} className="min-w-0 bg-background p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold text-muted-foreground">{stage.index}</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-primary">{stage.role}</p>
            </div>
            <p className="mt-4 font-semibold">{stage.name}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.body}</p>
            <p className="mt-4 border-t border-border/60 pt-3 font-mono text-[11px] text-foreground/70">{stage.note}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
