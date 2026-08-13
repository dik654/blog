import VizFrame from "@/components/viz/VizFrame";

const paths = [
  {
    title: "얕은 표현",
    premise: "많은 조합을 한 층에서 바로 구분",
    stages: ["입력", "넓은 basis", "출력"],
    tradeoff: "특정 함수족에서는 필요한 width가 매우 커질 수 있음",
  },
  {
    title: "깊은 표현",
    premise: "작은 변환의 결과를 다음 층에서 재사용",
    stages: ["국소 특징", "부분 조합", "상위 표현", "출력"],
    tradeoff: "표현은 효율적일 수 있지만 optimization path가 길어짐",
  },
] as const;

export default function DepthCompositionViz() {
  return (
    <VizFrame
      eyebrow="Representation depth"
      title="깊이의 이점은 뉴런 개수 비교가 아니라 중간 표현을 재사용하는 함수 합성에 있습니다"
      description="같은 parameter 수에서 항상 깊은 모델이 이긴다는 뜻은 아닙니다. 어떤 함수 구조를 표현하고 실제로 학습할 수 있는지 함께 봐야 합니다."
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        {paths.map((path) => (
          <section key={path.title} className="min-w-0">
            <p className="text-sm font-bold text-foreground">{path.title}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {path.premise}
            </p>
            <div className="mt-5 grid gap-4">
              {path.stages.map((stage, index) => (
                <div
                  key={stage}
                  className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3"
                >
                  <span className="font-mono text-xs font-bold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="border-b border-border/80 pb-2 text-xs font-semibold text-foreground">
                    {stage}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 border-l border-border pl-3 text-xs leading-5 text-foreground/75">
              {path.tradeoff}
            </p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
