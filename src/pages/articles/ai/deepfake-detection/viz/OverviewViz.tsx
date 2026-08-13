import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["Source boundary", "source clip · identity · session", "split intersection = empty"],
  ["Observation", "decode · face track · coverage", "failure remains visible"],
  ["Signal", "spatial · temporal · frequency", "same preprocessing budget"],
  ["Deployment shift", "generator · codec · capture", "worst-slice + calibration"],
];

export default function OverviewViz() {
  return <VizFrame eyebrow="Detection contract" title="분류기보다 먼저 evidence가 이동하는 경계를 고정합니다" description="한 행이 깨지면 아래 단계의 높은 점수를 진위 판별 능력으로 해석하기 어렵습니다.">
    <div className="border-y border-border">
      {rows.map(([stage, artifact, test]) => <div key={stage} className="grid min-w-0 gap-2 border-b border-border py-5 text-sm last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-6"><strong>{stage}</strong><span className="text-muted-foreground">{artifact}</span><span className="text-rose-800 dark:text-rose-200">{test}</span></div>)}
    </div>
    <p className="mt-6 border-l border-rose-500 pl-4 text-sm leading-6 text-muted-foreground">최종 score는 검토 우선순위를 정하는 신호입니다. 진위를 독립적으로 증명하는 certificate로 사용하지 않습니다.</p>
  </VizFrame>;
}
