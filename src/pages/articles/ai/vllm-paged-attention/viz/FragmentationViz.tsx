const CONTIGUOUS = ["A 예약 8K", "A 사용 2.1K", "빈 5.9K"];
const PAGED = ["16", "16", "16", "3", "+ 필요할 때 확장"];

export default function FragmentationViz() {
  return (
    <figure data-viz="paged-kv-fragmentation" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">VARIABLE-LENGTH KV STATE</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">최대 길이 예약을 request 길이에 맞춰 늘어나는 fixed-size block으로 바꿉니다</h3>
      </figcaption>
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-2">
        <article className="min-w-0 rounded-lg border bg-background p-5">
          <p className="text-sm font-bold">Contiguous max reservation</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_1.3fr]">
            {CONTIGUOUS.map((item, index) => <div key={item} className={`rounded-md border px-3 py-4 text-center text-xs font-semibold ${index === 2 ? "border-amber-500/40 bg-amber-500/[0.06] text-amber-800 dark:text-amber-200" : "bg-muted/20"}`}>{item}</div>)}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">끝날 길이를 몰라 큰 연속 영역을 먼저 잡으면 unused reservation이 남습니다.</p>
        </article>
        <article className="min-w-0 rounded-lg border border-primary/30 bg-primary/[0.03] p-5">
          <p className="text-sm font-bold">Paged growth · B=16</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {PAGED.map((item, index) => <div key={`${item}-${index}`} className={`rounded-md border px-3 py-4 text-center text-xs font-semibold ${index === 3 ? "border-primary/40 bg-primary/[0.07]" : "bg-background"}`}>{item}</div>)}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">현재 token에 필요한 block만 연결하고 마지막 block의 빈 slot만 내부 낭비로 남습니다.</p>
        </article>
      </div>
    </figure>
  );
}
