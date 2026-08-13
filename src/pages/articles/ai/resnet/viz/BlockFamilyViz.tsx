import VizFrame from "@/components/viz/VizFrame";

const blocks = [
  ["BasicBlock", "3×3 → 3×3", "expansion 1"],
  ["Bottleneck", "1×1 → 3×3 → 1×1", "expansion 4"],
  ["Projection", "1×1 shortcut", "shape transition"],
  ["Pre-activation", "Norm → ReLU → Conv", "clean identity path"],
] as const;

export default function BlockFamilyViz() {
  return (
    <VizFrame
      eyebrow="Block families"
      title="Block 이름보다 width·stride·activation 위치를 함께 읽습니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {blocks.map(([name, path, note]) => (
          <div key={name} className="min-w-0 border-l border-border/80 pl-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-3 break-words font-mono text-xs text-primary">
              {path}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {note}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
