const axes = [
  ["공통 model budget", "leaf·depth 범위", "round·early stopping", "row·column sampling"],
  ["Data contract", "같은 feature artifact", "같은 missing/category", "같은 group·time split"],
  ["Search budget", "같은 trial 또는 시간", "library별 parameter 번역", "최종 test 보존"],
  ["System budget", "같은 device·thread", "peak memory", "batch·row latency"],
];

export default function GBMComparisonViz() {
  return (
    <figure data-viz="gbm-comparison-contract" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Comparable experiment</p>
        <p className="mt-2 text-lg font-semibold">세 library에 같은 숫자가 아니라 같은 제약과 예산을 줍니다</p>
      </figcaption>
      <div className="mt-6 overflow-hidden rounded-lg border border-border/70">
        {axes.map(([axis, ...details], index) => (
          <div key={axis} className={`grid min-w-0 gap-3 px-4 py-4 md:grid-cols-[1fr_1fr_1fr_1fr] ${index ? "border-t border-border/60" : ""}`}>
            <p className="font-semibold text-foreground">{axis}</p>
            {details.map((detail) => <p key={detail} className="text-sm leading-5 text-muted-foreground">{detail}</p>)}
          </div>
        ))}
      </div>
      <div className="mt-6 grid min-w-0 gap-4 border-t border-border/70 pt-4 sm:grid-cols-3">
        {[
          ["XGBoost", "2차 objective · scalable split"],
          ["LightGBM", "GOSS/EFB · leaf-wise"],
          ["CatBoost", "ordered update · symmetric tree"],
        ].map(([name, design]) => <div key={name} className="min-w-0"><p className="font-semibold">{name}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{design}</p></div>)}
      </div>
    </figure>
  );
}
