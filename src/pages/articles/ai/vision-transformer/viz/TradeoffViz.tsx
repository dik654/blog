import VizFrame from "@/components/viz/VizFrame";

const metrics = [
  ["quality", "paired metric gain", "seed mean · uncertainty · slices"],
  ["input", "resolution · patch", "object detail · resize cost"],
  ["runtime", "target implementation", "p50/p95 · throughput · memory"],
  ["support", "deployment path", "precision · quantization · compiler"],
];

export default function TradeoffViz() {
  return (
    <VizFrame eyebrow="Selection ledger" title="Architecture 후보는 같은 evidence와 system constraint를 모두 통과해야 합니다" description="Model name보다 비교 조건과 reject criterion이 먼저 보이는 선택표입니다.">
      <div className="min-w-0 overflow-hidden border-y border-border">
        {metrics.map(([axis, measure, receipt]) => <div key={axis} className="grid min-w-0 gap-2 border-b border-border py-5 text-sm last:border-b-0 sm:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1.2fr)] sm:gap-6"><strong>{axis}</strong><span>{measure}</span><span className="text-muted-foreground">{receipt}</span></div>)}
      </div>
      <div className="mt-7 grid gap-5 text-sm sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center"><p><b>same recipe</b><br/><span className="text-muted-foreground">split · input · budget</span></p><span className="hidden text-muted-foreground sm:block">→</span><p><b>paired gain</b><br/><span className="text-muted-foreground">quality · uncertainty</span></p><span className="hidden text-muted-foreground sm:block">→</span><p><b>constraint</b><br/><span className="text-muted-foreground">SLO · memory · support</span></p></div>
    </VizFrame>
  );
}
