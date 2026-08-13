export default function CosineViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">Cosine progress</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">진행률 0→1이 peak LR를 minimum LR로 옮깁니다</h3>
      </figcaption>
      <div className="px-4 py-6 sm:px-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
          <div className="flex flex-col justify-between py-1 text-right text-xs text-muted-foreground"><span>ηmax</span><span>ηmin</span></div>
          <div>
            <div className="relative h-40 border-b border-l border-border" aria-label="cosine learning-rate trajectory">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <polyline points="0,5 5,6 10,8 15,11 20,15 25,20 30,26 35,33 40,40 45,48 50,56 55,64 60,71 65,78 70,84 75,89 80,93 85,96 90,98 95,99 100,100" fill="none" className="stroke-indigo-600 dark:stroke-indigo-300" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
              </svg>
              <span className="absolute left-0 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-indigo-600" />
              <span className="absolute bottom-0 right-0 h-2 w-2 translate-x-1/2 rounded-full bg-indigo-600" />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>t=0</span><span>progress t/T</span><span>t=T</span></div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-2">
          <div><p className="font-semibold">Single cosine</p><p className="mt-1 leading-6 text-muted-foreground">하나의 T에서 minimum까지 내려가고 끝납니다.</p></div>
          <div><p className="font-semibold">Warm restarts</p><p className="mt-1 leading-6 text-muted-foreground">Cycle 경계에서 LR만 다시 높이고 학습 state는 이어갑니다.</p></div>
        </div>
      </div>
    </figure>
  );
}
