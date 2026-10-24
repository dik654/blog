import VizFrame from "@/components/viz/VizFrame";

export default function EvaluationBoundaryViz() {
  return (
    <VizFrame eyebrow="cosine 1.0 뒤에 남는 질문" title="가까운 vector 하나로 동의어·과제 성능·공정성을 함께 판정할 수 없습니다" description="Rank-2 fixture에서 고양이와 강아지가 같은 방향이 됐어도 검증해야 할 주장은 서로 다릅니다.">
      <div data-viz-canvas className="grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Geometry", "cos=1.0", "좌표 안에서 가까운가"],
          ["Lexical relation", "label 필요", "동의어·반의어·연관어인가"],
          ["Task", "held-out metric", "검색·분류에 도움이 되는가"],
          ["Audit", "neighbor·subgroup", "편향·누출·희귀어 실패가 있는가"],
        ].map(([name,evidence,question]) => <div key={name} className="min-w-0 bg-background p-4"><p className="text-[10px] font-bold text-muted-foreground">{name}</p><p className="mt-3 font-mono text-sm font-bold text-primary">{evidence}</p><p className="mt-2 text-xs leading-5">{question}</p></div>)}
      </div>
    </VizFrame>
  );
}
