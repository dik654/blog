import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["Symptom", "TTFT · TPOT · error · completion", "page / SLO"],
  ["Pressure", "waiting · queue time · KV usage", "scale / admission"],
  ["Cause", "prompt mix · cache hit · route · version", "diagnose"],
  ["Action", "route · scale · rollback", "verify again"],
] as const;

export default function SignalControlViz() {
  return (
    <VizFrame
      eyebrow="Closed-loop operations"
      title="증상, 압력, 원인, 조치를 한 request 흐름으로 연결합니다"
      description="GPU utilization 하나는 원인 후보일 뿐입니다. 사용자가 겪는 증상에서 출발해 압력과 원인을 좁힌 뒤, 변경 결과를 같은 SLI로 다시 검증합니다."
    >
      <div className="divide-y divide-border/70">
        {rows.map(([layer, signals, decision]) => (
          <div
            key={layer}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[7rem_1fr_8rem] sm:items-center sm:gap-5"
          >
            <p className="text-sm font-bold text-foreground">{layer}</p>
            <p className="break-words text-xs leading-5 text-muted-foreground">
              {signals}
            </p>
            <p className="text-xs font-semibold text-primary sm:text-right">
              {decision}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
