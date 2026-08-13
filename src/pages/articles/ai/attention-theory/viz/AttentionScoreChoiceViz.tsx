const choices = [
  {
    title: "Additive",
    formula: "vᵀ tanh(Wq q + Wk k)",
    cost: "작은 MLP",
    condition: "q와 k 차원이 달라도 projection으로 맞춥니다.",
  },
  {
    title: "Dot product",
    formula: "qᵀk",
    cost: "parameter 없음",
    condition: "비교하는 마지막 차원이 같아야 합니다.",
  },
  {
    title: "Bilinear",
    formula: "qᵀWk",
    cost: "학습 matrix W",
    condition: "learned metric을 쓰지만 matmul 경로를 유지합니다.",
  },
  {
    title: "Scaled dot product",
    formula: "qᵀk / √dk",
    cost: "dot + scalar scale",
    condition: "큰 dk에서 softmax logit scale을 안정시킵니다.",
  },
];

export default function AttentionScoreChoiceViz() {
  return (
    <figure data-viz="attention-score-choices" className="not-prose my-9 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Same contract, different scorer</p>
        <p className="mt-1 font-semibold">바뀌는 것은 score 계산이고 softmax·value aggregation은 그대로입니다</p>
      </figcaption>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {choices.map((choice) => (
          <div key={choice.title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{choice.title}</p>
              <p className="text-xs text-muted-foreground">{choice.cost}</p>
            </div>
            <p className="mt-3 overflow-x-auto rounded-md bg-muted/60 px-3 py-2 font-mono text-xs text-foreground">{choice.formula}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{choice.condition}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
