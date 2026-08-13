import VizFrame from "@/components/viz/VizFrame";

const variants = [
  ["Direct", "Answer 한 번", "낮은 latency", "단순·검증 쉬운 task"],
  ["CoT", "Reasoning path 한 번", "추가 output token", "Multi-step task"],
  ["Self-consistency", "Path K개 + answer vote", "K배에 가까운 비용", "오프라인·고가치 task"],
] as const;

export function VariantsViz() {
  return (
    <VizFrame eyebrow="Method choice" title="추론 강도를 높일수록 비용과 검증 책임도 함께 늘어납니다" description="대표 eval slice에서 accuracy·latency·token·failure cost를 같은 조건으로 비교합니다.">
      <div className="grid gap-7 md:grid-cols-3">{variants.map(([name, path, cost, fit], index) => <section key={name} className="min-w-0 border-t border-border/80 pt-4"><div className="flex items-baseline justify-between"><h4 className="text-sm font-bold">{name}</h4><span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span></div><p className="mt-3 text-xs font-semibold text-primary">{path}</p><p className="mt-3 text-xs leading-5 text-muted-foreground">비용 · {cost}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">적합 · {fit}</p></section>)}</div>
    </VizFrame>
  );
}

const claims = [
  ["Fluent explanation", "사람이 읽기 자연스럽다", "Correctness 보장 아님"],
  ["Correct answer", "정답과 일치한다", "Causal trace 보장 아님"],
  ["External receipt", "계산·source·effect를 재검사 가능", "검증 범위를 명시"],
] as const;

export function TheoryViz() {
  return (
    <VizFrame eyebrow="Faithfulness boundary" title="Explanation·answer·external evidence는 서로 다른 claim입니다" description="한 층이 통과했다고 다른 층까지 자동으로 참이 되지 않습니다.">
      <div className="grid gap-7 md:grid-cols-3">{claims.map(([name, means, limit]) => <section key={name} className="min-w-0 border-t border-border/80 pt-4"><h4 className="text-sm font-bold">{name}</h4><p className="mt-3 text-xs leading-5 text-muted-foreground">{means}</p><p className="mt-3 text-xs font-semibold text-primary">{limit}</p></section>)}</div>
    </VizFrame>
  );
}
