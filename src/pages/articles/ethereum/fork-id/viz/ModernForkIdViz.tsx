const cases = [
  ["같은 hash", "원격 next가 0이거나 아직 로컬 head를 지나지 않았나?", "호환 가능"],
  ["원격이 과거", "원격 hash가 로컬 과거 이력이고 next가 바로 다음 fork인가?", "원격 동기화 중"],
  ["원격이 미래", "알려진 future fork를 적용해 원격 hash를 만들 수 있나?", "로컬 동기화 중"],
  ["설명 불가", "로컬 schedule의 어느 위치로도 원격 tuple을 설명할 수 없나?", "연결 거절"],
] as const;

export function ForkIdMatrixViz() {
  return (
    <figure className="not-prose my-8 border-y border-border py-5">
      <figcaption className="mb-4 text-sm font-semibold">
        Fork ID는 단순한 일치 검사가 아니라 현재 위치를 설명하는 네 갈래 판정입니다
      </figcaption>
      <div className="grid gap-px bg-border p-px sm:grid-cols-2">
        {cases.map(([title, question, result], index) => (
          <div key={title} className="min-w-0 bg-background p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="break-keep text-sm font-bold">{title}</p>
              <span className="font-mono text-[10px] font-bold text-primary">{index + 1}</span>
            </div>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">{question}</p>
            <p className="mt-3 border-l-2 border-primary/45 pl-3 text-xs font-bold text-foreground">{result}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function ForkHashTraceViz() {
  const items = [
    ["genesis", "G", "CRC32(genesis)"],
    ["fork 5 통과", "H₅", "CRC32(G ∥ BE₈(5))"],
    ["fork 10 예정", "next=10", "아직 hash에 넣지 않음"],
  ] as const;

  return (
    <figure className="not-prose my-8 border-y border-border py-5">
      <figcaption className="mb-4 text-sm font-semibold">head 9에서 만드는 Fork ID · RLP([H₅, 10])</figcaption>
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)] md:items-stretch">
        {items.map(([title, value, detail], index) => (
          <div key={title} className="contents">
            <div className={`min-w-0 border p-4 ${index < 2 ? "border-primary/45 bg-primary/[0.045]" : "border-border bg-background"}`}>
              <p className="text-[10px] font-black text-primary">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-2 break-keep text-sm font-bold">{title}</p>
              <p className="mt-2 font-mono text-xs font-semibold">{value}</p>
              <p className="mt-1 break-keep text-[11px] leading-5 text-muted-foreground">{detail}</p>
            </div>
            {index < items.length - 1 ? (
              <span className="hidden items-center justify-center text-muted-foreground md:flex" aria-hidden>→</span>
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-4 border-l border-border pl-4 text-xs leading-5 text-muted-foreground">
        같은 높이에 여러 규칙 변경이 있어도 fork 숫자는 한 번만 넣습니다. 숫자는 uint64 big-endian 8바이트로 바꾼 뒤 누산합니다.
      </p>
    </figure>
  );
}

export function ForkBoundaryViz() {
  const boundaries = [
    ["head 4", "G", "next 5", "fork 5 직전"],
    ["head 5", "H₅", "next 10", "fork 5 포함"],
    ["head 9", "H₅", "next 10", "다음 fork 대기"],
    ["head 10", "H₁₀", "next 0", "fork 10 포함"],
  ] as const;

  return (
    <figure className="not-prose my-8 border-y border-border py-5">
      <figcaption className="mb-4 text-sm font-semibold">경계 블록은 그 높이부터 FORK_HASH에 포함됩니다</figcaption>
      <div className="grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
        {boundaries.map(([head, hash, next, note]) => (
          <div key={head} className="min-w-0 bg-background p-4">
            <p className="font-mono text-xs font-bold text-primary">{head}</p>
            <p className="mt-2 font-mono text-sm font-bold">({hash}, {next})</p>
            <p className="mt-2 break-keep text-[11px] leading-5 text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
