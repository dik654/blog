const mask = [1, 0, 1, 1, 0, 1, 0, 1];

function Row({ label, values, note, tone }: { label: string; values: readonly number[]; note: string; tone: "train" | "eval" }) {
  return (
    <div className="grid gap-3 py-5 sm:grid-cols-[6rem_minmax(0,1fr)_12rem] sm:items-center sm:gap-5">
      <div><p className="font-semibold">{label}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div>
      <div className="grid grid-cols-8 gap-1.5" aria-label={`${label} activation states`}>
        {values.map((value, index) => <span key={index} className={`h-8 border ${value ? tone === "train" ? "border-purple-400 bg-purple-500/15" : "border-emerald-400 bg-emerald-500/15" : "border-dashed border-border bg-muted/30"}`}><span className="sr-only">unit {index + 1}: {value ? "active" : "dropped"}</span></span>)}
      </div>
      <p className="text-sm text-muted-foreground">{tone === "train" ? "active × 1/q" : "전체 경로 · scale 없음"}</p>
    </div>
  );
}

export default function DropoutViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-purple-700 dark:text-purple-300">Train–eval state</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">Mask sampling과 inverted scaling은 train mode에만 존재합니다</h3>
      </figcaption>
      <div className="px-4 py-6 sm:px-6">
        <div className="divide-y divide-border border-y border-border">
          <Row label="train()" values={mask} note="Bernoulli mask" tone="train" />
          <Row label="eval()" values={mask.map(() => 1)} note="deterministic" tone="eval" />
        </div>
        <dl className="mt-6 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
          <div><dt className="font-semibold">Mean</dt><dd className="mt-1 text-muted-foreground">E[h̃]=h</dd></div>
          <div><dt className="font-semibold">Noise</dt><dd className="mt-1 text-muted-foreground">Var(h̃)=p/q·h²</dd></div>
          <div><dt className="font-semibold">Audit</dt><dd className="mt-1 text-muted-foreground">module mode·seed·drop unit</dd></div>
        </dl>
      </div>
    </figure>
  );
}
