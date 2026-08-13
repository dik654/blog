import VizFrame from "@/components/viz/VizFrame";

const nodes = [
  { label: "입력", value: "x = 2", gain: "" },
  { label: "안쪽 함수", value: "u = 3x + 1 = 7", gain: "local gain ×3" },
  { label: "바깥 함수", value: "y = u² = 49", gain: "local gain ×14" },
] as const;

export default function ChainRuleViz() {
  return (
    <VizFrame eyebrow="Composed sensitivity" title="값은 앞으로 흐르고, 변화율은 local gain을 곱해 연결됩니다" description="x=2에서 전체 gain은 3×14=42입니다.">
      <ol className="grid gap-6 md:grid-cols-3 md:gap-8">
        {nodes.map((node, index) => (
          <li key={node.label} className="relative min-w-0 border-t border-border/80 pt-4">
            <span className="font-mono text-[10px] font-bold text-primary">0{index + 1}</span>
            <p className="mt-2 text-xs font-bold text-muted-foreground">{node.label}</p>
            <p className="mt-2 break-words font-mono text-sm font-bold text-foreground">{node.value}</p>
            {node.gain && <p className="mt-3 text-xs leading-5 text-primary">{node.gain}</p>}
          </li>
        ))}
      </ol>
      <div className="mt-7 border-l border-primary/60 pl-4">
        <p className="text-xs text-muted-foreground">전체 경로의 derivative</p>
        <p className="mt-1 font-mono text-lg font-bold text-foreground">dy/dx = 14 × 3 = 42</p>
      </div>
    </VizFrame>
  );
}
