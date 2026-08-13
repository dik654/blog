import VizFrame from "@/components/viz/VizFrame";

const models = [
  ["CBOW", "context embeddings", "평균·합", "center word", "한 window당 target 하나"],
  ["Skip-gram", "center embedding", "pair별 score", "context words", "한 window에서 여러 pair"],
];

export default function PredictionDirectionViz() {
  return (
    <VizFrame
      eyebrow="Two prediction directions"
      title="CBOW와 Skip-gram은 같은 embedding table을 쓰더라도 학습 example의 방향이 다릅니다"
      description="속도와 희귀어 품질은 architecture 이름만이 아니라 corpus frequency·window·sampling 예산에 좌우됩니다."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {models.map(([name,input,aggregation,target,cost])=><article key={name} className="rounded-lg border border-border/70 bg-background p-4"><p className="text-sm font-bold text-primary">{name}</p><dl className="mt-4 grid grid-cols-[5rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-xs leading-5"><dt className="text-muted-foreground">입력</dt><dd>{input}</dd><dt className="text-muted-foreground">중간</dt><dd>{aggregation}</dd><dt className="text-muted-foreground">예측</dt><dd>{target}</dd><dt className="text-muted-foreground">표본 수</dt><dd>{cost}</dd></dl></article>)}
      </div>
    </VizFrame>
  );
}
