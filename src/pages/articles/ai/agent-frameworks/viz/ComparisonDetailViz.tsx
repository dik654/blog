import VizFrame from "@/components/viz/VizFrame";

const decisions = [
  ["Direct SDK baseline", "단일 loop·typed tool·간단한 retry로 요구를 충족하는가?", "충족하면 복잡도를 추가하지 않음"],
  ["Framework candidate", "checkpoint·approval·branch·trace 중 실제 부족한 책임은?", "기능과 owner를 명시"],
  ["Paired prototype", "같은 task·model·dataset·budget에서 비교", "quality·latency·cost·recovery"],
  ["Adopt or rollback", "운영 이득이 upgrade·lock-in·debug 비용보다 큰가?", "version pin·escape hatch 유지"],
] as const;

export default function ComparisonDetailViz() {
  return (
    <VizFrame
      eyebrow="Requirement matrix"
      title="Direct SDK에서 시작해 부족한 책임이 확인될 때만 framework 후보를 비교합니다"
      description="브랜드 순위 대신 같은 workflow의 paired prototype으로 품질·운영 비용·복구 가능성을 함께 측정합니다."
    >
      <ol className="divide-y divide-border/70">
        {decisions.map(([stage, question, decision], index) => (
          <li
            key={stage}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[2rem_9rem_1fr_1fr] sm:items-baseline"
          >
            <span className="font-mono text-[11px] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h4 className="min-w-0 text-sm font-bold [overflow-wrap:anywhere]">{stage}</h4>
            <p className="min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {question}
            </p>
            <p className="min-w-0 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              {decision}
            </p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
