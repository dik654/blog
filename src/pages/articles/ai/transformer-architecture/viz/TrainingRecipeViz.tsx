import VizFrame from "@/components/viz/VizFrame";

const controls = [
  ["Optimization", "optimizer · clipping · decay", "update stability"],
  ["Schedule", "warmup · peak LR · decay", "step-wise scale"],
  ["Numerics", "dtype · accumulation · loss scale", "finite arithmetic"],
  ["Distribution", "DP · TP · PP · EP", "tensor ownership"],
] as const;

export default function TrainingRecipeViz() {
  return (
    <VizFrame
      eyebrow="Reproduction contract"
      title="Architecture config만으로는 같은 training run을 재현할 수 없습니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {controls.map(([name, config, purpose]) => (
          <div key={name} className="min-w-0 border-l border-border/80 pl-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-3 break-words font-mono text-xs leading-5 text-primary">
              {config}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {purpose}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
