import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["Frame encoder", "crop의 local evidence", "identity · generator holdout"],
  ["Temporal reducer", "track score distribution", "short event · missing frame"],
  ["Frequency branch", "spectral residual", "codec · resize · re-encode"],
  ["Decision layer", "calibrated video score", "coverage · latency · abstention"],
];

export default function ModelsViz() {
  return <VizFrame eyebrow="Signal–evaluation ledger" title="Backbone 이름 대신 각 component가 읽는 신호와 깨지는 slice를 대응시킵니다">
    <div className="border-y border-border">
      {rows.map(([component, signal, evaluation]) => <div key={component} className="grid gap-2 border-b border-border py-5 text-sm last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-6"><strong>{component}</strong><span className="text-muted-foreground">{signal}</span><span className="text-emerald-800 dark:text-emerald-200">{evaluation}</span></div>)}
    </div>
  </VizFrame>;
}
