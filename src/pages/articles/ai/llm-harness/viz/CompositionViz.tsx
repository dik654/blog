import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["Request", "user intent", "자연어"],
  ["Run contract", "objective · scope · acceptance", "명세"],
  ["Admission", "context · capability · budget", "허가"],
  ["Execution", "model ↔ tool ↔ observation", "변경"],
  ["Verification", "artifact · state · policy", "판정"],
  ["Exit / recover", "receipt · retry · rollback", "종료"],
] as const;

export default function CompositionViz() {
  return (
    <VizFrame
      eyebrow="Run lifecycle"
      title="자연어 요청은 admission·execution·verification을 거쳐야 완료된 run이 됩니다"
    >
      <div className="divide-y divide-border/70">
        {stages.map(([name, detail, output], index) => (
          <div
            key={name}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[3rem_8rem_1fr_5rem] sm:items-center sm:gap-5"
          >
            <span className="font-mono text-xs font-bold text-primary">
              0{index + 1}
            </span>
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="break-words font-mono text-xs leading-5 text-muted-foreground">
              {detail}
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
