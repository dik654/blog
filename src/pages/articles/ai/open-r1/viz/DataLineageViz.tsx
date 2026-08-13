import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["Source", "license · problem ID"],
  ["Generate", "model · sampling · raw trace"],
  ["Parse", "answer · code · finish"],
  ["Verify", "verifier version · result"],
  ["Filter", "reason · dedup · decontam"],
  ["Release", "dataset revision · split"],
] as const;

export default function DataLineageViz() {
  return (
    <VizFrame
      eyebrow="Data lineage"
      title="정답 trace뿐 아니라 탈락 이유까지 다시 계산할 수 있게 남깁니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {stages.map(([title, body], index) => (
          <div
            key={title}
            className="min-w-0 border-b border-border/80 pb-4 lg:border-b-0 lg:border-l lg:pb-0 lg:pl-4"
          >
            <p className="font-mono text-xs text-primary">0{index + 1}</p>
            <p className="mt-2 text-sm font-bold text-foreground">{title}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
