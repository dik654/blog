import VizFrame from "@/components/viz/VizFrame";

const layers = [
  ["Symbol identity", "one-hot / token ID", "same or different"],
  ["Observed usage", "word × context counts", "corpus evidence"],
  ["Association", "PPMI / weighting", "above baseline"],
  ["Compression", "SVD / learned objective", "dense coordinates"],
  ["Evaluation", "neighbor + downstream", "task evidence"],
] as const;

export default function RepresentationContractViz() {
  return (
    <VizFrame
      eyebrow="Measurement pipeline"
      title="단어 vector는 corpus에서 평가까지 이어지는 선택의 결과입니다"
      description="각 단계가 바뀌면 같은 단어라도 다른 이웃과 방향을 갖기 때문에 embedding 이름만으로 의미를 고정할 수 없습니다."
    >
      <div className="divide-y divide-border/70">
        {layers.map(([name, operator, output], index) => (
          <div
            key={name}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[3rem_9rem_1fr_8rem] sm:items-center sm:gap-5"
          >
            <span className="font-mono text-xs font-bold text-primary">
              0{index + 1}
            </span>
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="break-words font-mono text-xs leading-5 text-muted-foreground">
              {operator}
            </p>
            <p className="text-xs font-semibold text-foreground/70 sm:text-right">
              {output}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
