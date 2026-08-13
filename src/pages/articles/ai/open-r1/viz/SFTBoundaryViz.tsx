import VizFrame from "@/components/viz/VizFrame";

const columns = [
  ["Prompt tokens", "context로 사용", "loss mask = 0"],
  ["Reasoning tokens", "teacher trace를 모사", "loss mask = 1"],
  ["Final answer / EOS", "형식과 종료를 학습", "loss mask = 1"],
] as const;

export default function SFTBoundaryViz() {
  return (
    <VizFrame
      eyebrow="SFT boundary"
      title="SFT가 직접 감독하는 것은 token sequence입니다"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {columns.map(([title, role, mask]) => (
          <div key={title} className="min-w-0 border-l border-border/80 pl-4">
            <p className="text-sm font-bold text-foreground">{title}</p>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {role}
            </p>
            <p className="mt-2 font-mono text-xs text-primary">{mask}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
