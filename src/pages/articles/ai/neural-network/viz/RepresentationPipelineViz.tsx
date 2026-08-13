import VizFrame from "@/components/viz/VizFrame";

const stages = [
  { label: "입력 좌표", shape: "x ∈ ℝᴰ", role: "관측한 feature" },
  { label: "은닉 표현 1", shape: "a¹ ∈ ℝᴴ¹", role: "경계·방향 조합" },
  { label: "은닉 표현 2", shape: "a² ∈ ℝᴴ²", role: "task에 필요한 재조합" },
  { label: "출력 parameter", shape: "zᴸ ∈ ℝᴷ", role: "예측 분포의 좌표" },
];

export default function RepresentationPipelineViz() {
  return (
    <VizFrame
      eyebrow="Representation pipeline"
      title="MLP의 각 층은 같은 data를 다음 판단에 유리한 좌표로 다시 표현합니다"
      description="원과 선으로 뉴런을 전부 그리는 대신, 각 layer가 넘기는 tensor의 의미와 shape를 따라갑니다."
    >
      <div className="grid gap-4 lg:grid-cols-4">
        {stages.map((stage, index) => (
          <article key={stage.label} className="min-w-0 border-l border-border pl-4 first:border-primary">
            <p className="text-[11px] font-bold tracking-[0.12em] text-muted-foreground">
              STEP {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 text-sm font-bold text-foreground">{stage.label}</p>
            <p className="mt-3 break-words font-mono text-xs text-primary">{stage.shape}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{stage.role}</p>
          </article>
        ))}
      </div>
      <p className="mt-6 border-t border-border/60 pt-4 text-xs leading-5 text-muted-foreground">
        은닉층에는 사람이 정답 feature를 직접 붙이지 않습니다. 최종 loss를 줄이는 방향으로 weight가 바뀌면서 중간 표현도 함께 학습됩니다.
      </p>
    </VizFrame>
  );
}
