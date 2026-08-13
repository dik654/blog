import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["front", "m₁=1", "encoder → h₁", "α₁"],
  ["side", "m₂=0", "결측 view", "0"],
  ["detail", "m₃=1", "encoder → h₃", "α₃"],
];

export default function LateFusionViz() {
  return (
    <VizFrame eyebrow="Masked aggregation" title="Encoder lane와 reducer 사이에서 결측 view를 제거합니다" description="Zero feature를 집계한 뒤 보정하는 방식이 아니라, normalization 분모에서부터 제외합니다.">
      <div className="min-w-0 border-y border-border">
        {rows.map(([view, mask, path, weight]) => (
          <div key={view} className="grid min-w-0 grid-cols-[4.5rem_4rem_minmax(0,1fr)_3rem] gap-3 border-b border-border py-4 text-sm last:border-b-0 sm:grid-cols-[7rem_5rem_minmax(0,1fr)_5rem] sm:gap-6">
            <strong>{view}</strong><code className="text-xs">{mask}</code><span className={mask === "m₂=0" ? "text-muted-foreground line-through" : "text-muted-foreground"}>{path}</span><span className="text-right font-mono text-emerald-800 dark:text-emerald-200">{weight}</span>
          </div>
        ))}
      </div>
      <div className="mt-7 border-l border-emerald-500 pl-4">
        <p className="text-sm font-semibold">h = α₁h₁ + α₃h₃</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Shared encoder와 symmetric reducer는 unordered set에 맞습니다. Camera별 독립 encoder나 slot concat은 고정된 view 의미가 있을 때 사용합니다.</p>
      </div>
    </VizFrame>
  );
}
