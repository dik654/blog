const rows = [
  ["중소 규모 mixed table", "강한 기본 후보", "단순 baseline부터", "오류가 다를 때만"],
  ["고 cardinality category", "native category 비교", "embedding 재사용 후보", "OOF로 확인"],
  ["Image·text·sequence 결합", "별도 feature 필요", "end-to-end 강점", "비용 허용 시"],
  ["같은 schema의 unlabeled rows", "직접 이점 제한", "pretraining 후보", "scratch와 ablation"],
];

export default function WhenDLWinsViz() {
  return (
    <figure data-viz="tabular-model-evidence-matrix" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Evidence matrix</p>
        <p className="mt-2 text-lg font-semibold">Row 수가 아니라 representation 기회와 비용으로 후보를 정합니다</p>
      </figcaption>
      <div className="mt-6 min-w-0 overflow-x-auto rounded-lg border border-border/70">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[1.4fr_1fr_1.2fr_1fr] gap-4 bg-muted/35 px-4 py-3 text-xs font-semibold text-muted-foreground">
            <span>관찰된 조건</span><span>GBDT</span><span>Neural model</span><span>판정</span>
          </div>
          {rows.map(([condition, gbm, neural, verdict]) => (
            <div key={condition} className="grid grid-cols-[1.4fr_1fr_1.2fr_1fr] gap-4 border-t border-border/60 px-4 py-4 text-sm">
              <p className="font-semibold">{condition}</p>
              <p className="leading-6 text-muted-foreground">{gbm}</p>
              <p className="leading-6 text-muted-foreground">{neural}</p>
              <p className="leading-6 text-foreground/80">{verdict}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 border-t border-border/70 pt-4 text-sm leading-6 text-muted-foreground">고정할 것: entity·time split · feature artifact · tuning budget · hardware · metric · 최종 test 공개 시점</p>
    </figure>
  );
}
