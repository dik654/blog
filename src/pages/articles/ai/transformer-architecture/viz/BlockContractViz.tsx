import VizFrame from "@/components/viz/VizFrame";

const axes = [
  ["Token mixer", "Attention", "N positions interact"],
  ["Feature mixer", "FFN / gated MLP", "D features interact per token"],
  ["Transport", "Residual addition", "shape returns to D"],
  ["Scale", "LayerNorm / RMSNorm", "feature statistics managed"],
] as const;

export default function BlockContractViz() {
  return (
    <VizFrame
      eyebrow="Two mixers"
      title="Block 구성 요소는 서로 다른 tensor 축과 실패 모드를 담당합니다"
    >
      <div className="divide-y divide-border/70">
        {axes.map(([role, operator, contract]) => (
          <div
            key={role}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[8rem_11rem_1fr] sm:gap-5"
          >
            <p className="text-xs font-bold text-primary">{role}</p>
            <p className="text-sm font-bold text-foreground">{operator}</p>
            <p className="break-words font-mono text-xs leading-5 text-muted-foreground">
              {contract}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
