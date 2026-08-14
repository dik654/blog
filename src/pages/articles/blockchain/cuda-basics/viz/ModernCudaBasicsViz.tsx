const flow = [
  ["Host", "입력 준비 · device memory 할당"],
  ["Transfer", "필요한 bytes를 host → device로 복사"],
  ["Kernel", "Grid의 threads가 각 data index를 계산"],
  ["Result", "완료를 기다리고 필요한 출력만 회수"],
] as const;

export function CudaExecutionPathViz() {
  return (
    <figure data-viz="cuda-execution-path" className="not-prose my-9 overflow-hidden rounded-xl border border-border bg-card">
      <figcaption className="border-b border-border px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold text-primary">CPU 요청 → GPU 계산 → 결과</p>
        <p className="mt-1 text-base font-bold">Kernel 한 줄보다 앞뒤 memory 이동까지가 실행 경로다</p>
      </figcaption>
      <div data-viz-canvas className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        {flow.map(([title, body], index) => (
          <section key={title} className="relative min-w-0 rounded-lg border border-border bg-background p-4">
            <p className="text-[11px] font-bold text-primary">0{index + 1}</p>
            <p className="mt-2 text-sm font-bold">{title}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
            {index < flow.length - 1 ? <span aria-hidden className="absolute -right-3 top-1/2 hidden -translate-y-1/2 bg-card px-1 text-muted-foreground lg:block">→</span> : null}
          </section>
        ))}
      </div>
    </figure>
  );
}

const blocks = [
  ["Block 0", ["t0 → x[0]", "t1 → x[1]", "t2 → x[2]", "t3 → x[3]"]],
  ["Block 1", ["t0 → x[4]", "t1 → x[5]", "t2 → x[6]", "t3 → x[7]"]],
  ["Block 2", ["t0 → x[8]", "t1 → x[9]", "t2 → guard", "t3 → guard"]],
] as const;

export function CudaIndexMappingViz() {
  return (
    <figure data-viz="cuda-index-mapping" className="not-prose my-9 rounded-xl border border-border bg-card p-5 sm:p-6">
      <figcaption>
        <p className="text-xs font-semibold text-primary">N=10 · blockDim=4 · gridDim=3</p>
        <p className="mt-1 text-base font-bold">마지막 block의 남는 thread는 boundary check에서 멈춘다</p>
      </figcaption>
      <div data-viz-canvas className="mt-5 grid gap-4 md:grid-cols-3">
        {blocks.map(([block, threads]) => (
          <section key={block} className="min-w-0 rounded-lg border border-border bg-background p-4">
            <p className="text-sm font-bold">{block}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {threads.map((thread) => (
                <span key={thread} className="min-w-0 rounded-md border border-border bg-muted/25 px-2 py-2 text-center font-mono text-[11px] leading-4">{thread}</span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </figure>
  );
}

const memoryRows = [
  ["Register", "thread", "중간 scalar·index", "spill과 사용량"],
  ["Shared memory", "block", "재사용 tile·교환", "capacity·barrier·bank"],
  ["L1 / L2 cache", "SM / device", "global access cache", "access pattern 의존"],
  ["Global memory", "device", "큰 input·output", "traffic·coalescing"],
] as const;

export function CudaMemoryPathViz() {
  return (
    <figure data-viz="cuda-memory-path" className="not-prose my-9 overflow-hidden rounded-xl border border-border bg-card">
      <figcaption className="border-b border-border px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold text-primary">Scope와 traffic을 함께 보기</p>
        <p className="mt-1 text-base font-bold">가까운 memory를 쓴다는 말은 자동으로 빠르다는 뜻이 아니다</p>
      </figcaption>
      <div data-viz-canvas className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
        {memoryRows.map(([space, scope, role, cost]) => (
          <section key={space} className="min-w-0 rounded-lg border border-border bg-background p-4">
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold">{space}</p>
              <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">{scope}</span>
            </div>
            <dl className="mt-3 grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-2 text-xs leading-5">
              <dt className="text-muted-foreground">주요 역할</dt><dd className="min-w-0 break-words">{role}</dd>
              <dt className="text-muted-foreground">비용</dt><dd className="min-w-0 break-words">{cost}</dd>
            </dl>
          </section>
        ))}
      </div>
    </figure>
  );
}
