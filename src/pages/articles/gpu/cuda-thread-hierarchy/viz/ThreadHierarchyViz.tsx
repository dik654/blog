const levels = [
  {
    label: "Grid",
    detail: "kernel launch 1회",
    note: "독립 block들을 device에 배치",
  },
  {
    label: "Block",
    detail: "예: 256 threads",
    note: "한 SM에 머물며 shared memory 공유",
  },
  {
    label: "Warp",
    detail: "32 lanes",
    note: "같은 instruction을 함께 발행",
  },
  {
    label: "Thread",
    detail: "한 logical worker",
    note: "index로 담당 data를 선택",
  },
] as const;

export default function ThreadHierarchyViz() {
  return (
    <figure
      className="not-prose my-8 rounded-xl border border-border bg-background p-4 sm:p-6"
      aria-labelledby="cuda-thread-hierarchy-viz-title"
    >
      <figcaption id="cuda-thread-hierarchy-viz-title" className="mb-5">
        <p className="text-sm font-bold text-foreground">
          Launch에서 실제 실행 단위까지
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          위 계층은 작업을 나누는 software contract이고, SM은 준비된 block과
          warp를 자원 한도 안에서 배치합니다.
        </p>
      </figcaption>
      <div className="grid gap-4 md:grid-cols-4">
        {levels.map((level, index) => (
          <div key={level.label} className="relative min-w-0">
            <div className="h-full rounded-lg border border-border/80 p-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs font-semibold text-primary">
                  0{index + 1}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {level.detail}
                </span>
              </div>
              <p className="mt-3 text-sm font-bold">{level.label}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {level.note}
              </p>
            </div>
            {index < levels.length - 1 ? (
              <span
                className="mt-2 block text-center text-xs text-muted-foreground md:hidden"
                aria-hidden="true"
              >
                ↓
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-primary/25 bg-primary/[0.04] p-4 text-xs leading-5 text-muted-foreground">
        <strong className="text-foreground">중요한 경계:</strong> block은 어느
        SM에서 실행될지 정하지 않으며, thread 하나가 CUDA core 하나에 영구히
        고정되는 것도 아닙니다.
      </div>
    </figure>
  );
}
