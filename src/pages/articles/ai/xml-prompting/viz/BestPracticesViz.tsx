import VizFrame from "@/components/viz/VizFrame";

const loop = [
  ["Version", "prompt·schema·model·parser hash"],
  ["Slice", "짧은 입력·반복 문서·특수문자·공격 입력"],
  ["Measure", "quality·parse rate·latency·token·policy reject"],
  ["Compare", "paired baseline·regression threshold"],
  ["Ship", "canary·monitor·rollback"],
] as const;

export default function BestPracticesViz() {
  return (
    <VizFrame
      eyebrow="Production evaluation"
      title="XML template 변경은 versioned eval loop로 회귀를 확인합니다"
      description="전체 평균 하나보다 실패 조건을 분리한 slice와 동일 입력의 paired comparison이 원인을 찾기 쉽습니다."
    >
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {loop.map(([step, artifact], index) => (
          <li key={step} className="min-w-0 border-t border-border/80 pt-4">
            <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
            <h4 className="mt-2 text-sm font-bold">{step}</h4>
            <p className="mt-2 min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {artifact}
            </p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
