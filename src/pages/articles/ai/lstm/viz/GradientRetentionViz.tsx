import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["f = 1.00", "1.000", "direct path 유지", 100],
  ["f = 0.99", "0.366", "느린 감쇠", 37],
  ["f = 0.95", "0.006", "100 step에서 거의 소실", 1],
  ["f = 0.90", "0.00003", "빠른 감쇠", 0.4],
] as const;

export default function GradientRetentionViz() {
  return (
    <VizFrame
      eyebrow="Direct-path retention after 100 steps"
      title="1보다 조금 작은 forget gate도 긴 horizon에서는 크게 누적됩니다"
      description="Constant f를 가정한 f¹⁰⁰ 값입니다. 전체 derivative에는 gate network를 통과하는 추가 경로도 있으므로 direct term과 전체 gradient를 구분합니다."
    >
      <div className="space-y-3">
        {rows.map(([gate, value, note, width]) => (
          <div key={gate} className="grid gap-2 rounded-lg border border-border/70 bg-background p-4 sm:grid-cols-[6rem_1fr_9rem] sm:items-center">
            <p className="font-mono text-sm font-bold">{gate}</p>
            <div className="min-w-0">
              <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full min-w-px bg-primary/65" style={{ width: `${width}%` }} /></div>
              <p className="mt-2 text-xs text-muted-foreground">{note}</p>
            </div>
            <p className="font-mono text-xs text-foreground/75 sm:text-right">retention {value}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
