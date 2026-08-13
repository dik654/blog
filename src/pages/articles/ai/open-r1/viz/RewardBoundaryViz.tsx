import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["Math equivalence", "final answer", "parser·ambiguous notation"],
  ["Code tests", "observable behavior", "weak tests·timeout·sandbox"],
  ["Format", "machine-readable structure", "empty/verbose compliant output"],
  ["Judge model", "soft rubric", "bias·drift·prompt sensitivity"],
] as const;

export default function RewardBoundaryViz() {
  return (
    <VizFrame
      eyebrow="Reward boundary"
      title="Verifier가 확인한 outcome과 확인하지 못한 과정은 분리합니다"
    >
      <div className="divide-y divide-border/70">
        {rows.map(([name, sees, misses]) => (
          <div
            key={name}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[9rem_1fr_1.2fr] sm:gap-5"
          >
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="text-xs leading-5 text-primary">검증: {sees}</p>
            <p className="text-xs leading-5 text-muted-foreground">
              미검증: {misses}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
