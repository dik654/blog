export default function OneCycleViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fuchsia-700 dark:text-fuchsia-300">One-cycle trace</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">LR와 momentum이 반대 방향으로 움직이는 한 번의 run입니다</h3>
      </figcaption>
      <div className="px-4 py-6 sm:px-6">
        <div className="relative h-44 border-b border-l border-border" aria-label="OneCycle learning rate and momentum trajectories">
          <div className="absolute inset-y-0 left-[30%] border-l border-dashed border-border" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points="0,91 5,84 10,73 15,58 20,41 25,23 30,9 38,12 48,20 58,32 68,47 78,64 88,82 100,98" fill="none" className="stroke-fuchsia-600 dark:stroke-fuchsia-300" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
            <polyline points="0,16 10,23 20,36 30,52 42,44 56,33 70,24 85,17 100,12" fill="none" className="stroke-amber-600 dark:stroke-amber-300" strokeWidth="1.25" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="absolute left-[30%] top-1 -translate-x-1/2 text-xs font-semibold text-fuchsia-700 dark:text-fuchsia-300">max LR</span>
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>start</span><span>rise fraction p</span><span>total updates T</span></div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <span className="inline-flex items-center gap-2"><i className="h-px w-6 bg-fuchsia-600" />LR · rise then decay</span>
          <span className="inline-flex items-center gap-2"><i className="h-px w-6 border-t border-dashed border-amber-600" />momentum · inverse cycle</span>
        </div>
        <dl className="mt-5 grid gap-x-6 gap-y-4 border-t border-border pt-5 text-sm sm:grid-cols-3">
          <div><dt className="font-semibold">Find</dt><dd className="mt-1 text-muted-foreground">range test로 max 후보</dd></div>
          <div><dt className="font-semibold">Run</dt><dd className="mt-1 text-muted-foreground">update마다 한 번 호출</dd></div>
          <div><dt className="font-semibold">Verify</dt><dd className="mt-1 text-muted-foreground">발산·일반화·총 compute</dd></div>
        </dl>
      </div>
    </figure>
  );
}
