import VizFrame from "@/components/viz/VizFrame";

const cases = [
  ["Same shape", "H×W×C → H×W×C", "identity shortcut"],
  ["Downsample", "H×W → H/2×W/2", "stride on residual + shortcut"],
  ["Channel change", "Cᵢₙ → Cₒᵤₜ", "1×1 projection or defined padding"],
] as const;

export default function ShapeContractViz() {
  return (
    <VizFrame
      eyebrow="Addition contract"
      title="Element-wise addition 전에 두 branch의 tensor shape를 일치시킵니다"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {cases.map(([name, shape, action]) => (
          <div key={name} className="min-w-0 border-t border-border/80 pt-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-3 break-words font-mono text-xs text-primary">
              {shape}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {action}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
