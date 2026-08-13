const lanes = [
  ["Train", "Random transform", "Parameter·seed 기록", "Optimization용 distribution"],
  ["Validation", "Deterministic preprocessing", "고정 dataset", "Model selection"],
  ["Robustness slice", "예상 shift를 고정 생성", "변환별 version", "Failure boundary"],
  ["TTA", "허용 view 여러 개", "Inverse transform 후 merge", "Latency 포함 평가"],
];

export default function PipelineViz() {
  return (
    <figure data-viz="augmentation-pipeline-lanes" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption className="mb-5 text-sm font-semibold">학습·선택·강건성·추론의 변환 lane을 섞지 않습니다</figcaption>
      <div className="space-y-4">
        {lanes.map(([lane, transform, artifact, purpose]) => (
          <div key={lane} className="grid min-w-0 gap-2 border-t border-emerald-500/40 pt-4 md:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <p className="font-semibold text-emerald-700 dark:text-emerald-300">{lane}</p>
            <p className="text-sm leading-6">{transform}</p>
            <p className="text-sm leading-6 text-muted-foreground">Artifact: {artifact}</p>
            <p className="text-sm leading-6 text-muted-foreground">판단: {purpose}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
