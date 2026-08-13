const stages = [
  ["sample ID", "split manifest에서 선택", "user_42 / row_17"],
  ["Dataset", "ID → input·target·metadata", "x, y, source"],
  ["Sampler", "순서·rank shard", "rank 1: 17, 8, 31"],
  ["collate_fn", "stack·pad·mask", "B×T×D"],
  ["device", "async copy·compute", "batch receipt"],
];

export default function DatasetViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300">Input lineage</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">Sample ID가 batch tensor가 될 때마다 책임지는 모듈이 바뀝니다</h3>
      </figcaption>
      <div className="px-4 py-5 sm:px-6">
        <ol className="border-y border-border">
          {stages.map(([title, action, artifact], index) => (
            <li key={title} className={`grid gap-1 py-3 text-sm sm:grid-cols-[2rem_7rem_minmax(0,1fr)_minmax(0,.8fr)] sm:gap-4 ${index ? "border-t border-border" : ""}`}>
              <span className="font-mono text-xs text-teal-700 dark:text-teal-300">0{index + 1}</span>
              <span className="font-semibold">{title}</span>
              <span className="text-muted-foreground">{action}</span>
              <span className="break-words font-mono text-xs sm:text-sm">{artifact}</span>
            </li>
          ))}
        </ol>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[['대기', 't_wait'], ['계산', 't_compute'], ['처리량', 'samples/s · valid tokens/s']].map(([label, value]) => (
            <div key={label} className="border-l border-teal-500 pl-3 text-sm">
              <p className="font-semibold">{label}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
