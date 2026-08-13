import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["same product · crop A", "product-17", "train", "중복 금지"],
  ["same product · crop B", "product-17", "train", "같은 group"],
  ["new product · view A", "product-42", "validation", "배포 모사"],
];

export default function PipelineOverviewViz() {
  return (
    <VizFrame
      eyebrow="Data boundary"
      title="이미지 파일이 아니라 실제 대상의 identity로 split합니다"
      description="같은 원본에서 파생된 crop·frame·resize는 함께 움직이고, split manifest가 고정된 뒤에만 모델 실험을 시작합니다."
      note="Identity key → immutable split → input contract → baseline receipt 순서가 바뀌면 architecture 비교도 다시 시작합니다."
    >
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(15rem,.75fr)] lg:items-start">
        <div className="min-w-0">
          <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,.8fr)_minmax(0,.8fr)] gap-4 border-b border-border pb-3 text-xs font-semibold text-muted-foreground sm:grid">
            <span>sample</span><span>identity</span><span>split</span><span>판정</span>
          </div>
          <ol className="divide-y divide-border">
            {rows.map(([sample, identity, split, verdict]) => (
              <li key={sample} className="grid min-w-0 gap-2 py-4 text-sm sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,.8fr)_minmax(0,.8fr)] sm:gap-4">
                <span className="font-medium">{sample}</span>
                <span className="break-words font-mono text-xs text-muted-foreground sm:text-sm">{identity}</span>
                <span className={split === "validation" ? "text-sky-700 dark:text-sky-300" : "text-emerald-700 dark:text-emerald-300"}>{split}</span>
                <span className="text-muted-foreground">{verdict}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="min-w-0 border-l border-border pl-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-700 dark:text-sky-300">Baseline receipt</p>
          <dl className="mt-4 space-y-4 text-sm">
            {[
              ["data", "group split · class map"],
              ["input", "resize · crop · normalize"],
              ["model", "weight revision · head"],
              ["report", "accuracy · NLL · slice · p95"],
            ].map(([key, value]) => <div key={key}><dt className="font-semibold">{key}</dt><dd className="mt-1 break-words text-muted-foreground">{value}</dd></div>)}
          </dl>
        </div>
      </div>
    </VizFrame>
  );
}
