import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["RGB", "3 × H × W", "camera A → reference grid", "image mean/std"],
  ["Depth", "1 × H × W", "camera B → reference grid", "metric range"],
  ["Validity", "2 × H × W", "warp·sensor availability", "0 or 1"],
];

export default function EarlyFusionViz() {
  return (
    <VizFrame eyebrow="Registered input fusion" title="같은 pixel 좌표에 대응하는 관측과 mask만 channel로 쌓습니다" description="Sensor별 단위와 normalization은 concat 뒤에도 사라지지 않는 데이터 계약입니다.">
      <div className="min-w-0 border-y border-border">
        <div className="hidden grid-cols-[6rem_7rem_minmax(0,1fr)_minmax(0,1fr)] gap-5 border-b border-border py-3 text-xs font-semibold text-muted-foreground md:grid">
          <span>입력</span><span>shape</span><span>정렬</span><span>scale</span>
        </div>
        {rows.map(([name, shape, alignment, scale]) => (
          <div key={name} className="grid min-w-0 gap-2 border-b border-border py-4 text-sm last:border-b-0 md:grid-cols-[6rem_7rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-5">
            <strong>{name}</strong><code className="text-xs text-cyan-800 dark:text-cyan-200">{shape}</code><span className="text-muted-foreground">{alignment}</span><span className="text-muted-foreground">{scale}</span>
          </div>
        ))}
      </div>
      <div className="mt-7 grid gap-4 border-t border-border pt-6 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
        <div><p className="text-xs font-semibold text-muted-foreground">결합 결과</p><p className="mt-2 font-mono text-sm">6 × H × W</p></div>
        <span className="hidden text-muted-foreground sm:block">→</span>
        <div><p className="text-xs font-semibold text-muted-foreground">첫 layer</p><p className="mt-2 text-sm">입력 channel 6에 맞춘 weight handoff</p></div>
      </div>
    </VizFrame>
  );
}
