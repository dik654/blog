const protocols = [
  {
    name: "PBFT",
    input: "Primary가 request batch 제안",
    evidence: "PREPARE · COMMIT certificate",
    change: "View-change가 prepared evidence 회수",
  },
  {
    name: "HotStuff",
    input: "Leader가 parent QC 위 block 제안",
    evidence: "Chained quorum certificate",
    change: "Pacemaker가 QC와 view를 인계",
  },
  {
    name: "Autobahn",
    input: "Replica별 lane에서 data 전파",
    evidence: "Lane tip · cut · consensus certificate",
    change: "Blip 뒤 backlog를 cut으로 회수",
  },
] as const;

export function BFTMechanismComparisonViz() {
  return (
    <figure
      data-viz="bft-mechanism-comparison"
      className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6"
    >
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">
          세 프로토콜을 같은 상태 전이로 비교
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          입력 전파 방식은 달라도 proposal을 certificate로 확인하고, leader가
          바뀔 때 안전한 evidence를 넘긴다는 뼈대는 같습니다.
        </p>
      </figcaption>
      <div data-viz-canvas className="grid min-w-0 gap-4 lg:grid-cols-3">
        {protocols.map((protocol) => (
          <div
            key={protocol.name}
            className="min-w-0 rounded-lg border border-border bg-background p-4"
          >
            <p className="text-xs font-semibold tracking-[0.1em] text-primary">
              {protocol.name}
            </p>
            <ol className="mt-4 space-y-3 text-xs leading-5">
              <li className="border-l border-border pl-3">
                <span className="font-semibold text-foreground">입력</span>
                <p className="break-keep text-muted-foreground">
                  {protocol.input}
                </p>
              </li>
              <li className="border-l border-border pl-3">
                <span className="font-semibold text-foreground">
                  안전 evidence
                </span>
                <p className="break-keep text-muted-foreground">
                  {protocol.evidence}
                </p>
              </li>
              <li className="border-l border-border pl-3">
                <span className="font-semibold text-foreground">교체·회복</span>
                <p className="break-keep text-muted-foreground">
                  {protocol.change}
                </p>
              </li>
            </ol>
          </div>
        ))}
      </div>
    </figure>
  );
}

const axes = [
  [
    "Safety 전제",
    "n=3f+1 · authenticated",
    "n=3f+1 · authenticated",
    "n=3f+1 · authenticated",
  ],
  [
    "Data path",
    "Primary 중심 batch",
    "Leader 중심 proposal",
    "Replica별 parallel lane",
  ],
  [
    "Order path",
    "PRE-PREPARE/PREPARE/COMMIT",
    "Chained QC",
    "Cut을 정하는 BFT",
  ],
  [
    "불안정 구간",
    "View change evidence 이동",
    "Pacemaker·highest QC",
    "Lane은 계속 data를 축적",
  ],
] as const;

export function BFTAxisTableViz() {
  return (
    <figure
      data-viz="bft-axis-table"
      className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b border-border/70 p-4 sm:p-6">
        <p className="text-sm font-semibold text-foreground">
          논문 이름 대신 비교축을 먼저 고정
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Throughput 숫자는 workload와 배포 조건을 맞춘 뒤에만 비교할 수
          있습니다.
        </p>
      </figcaption>
      <div data-viz-canvas className="grid min-w-0 gap-3 p-4 sm:p-6 lg:grid-cols-2">
        {axes.map(([axis, pbft, hotstuff, autobahn], axisIndex) => (
          <section key={axis} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <span className="font-mono text-[11px] font-black text-primary">
                {String(axisIndex + 1).padStart(2, "0")}
              </span>
              <h4 className="text-sm font-bold text-foreground">{axis}</h4>
            </div>
            <dl className="mt-3 grid min-w-0 gap-3 text-xs leading-5">
              {[["PBFT", pbft], ["HotStuff", hotstuff], ["Autobahn", autobahn]].map(([name, value]) => (
                <div key={name} className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-3">
                  <dt className="font-bold text-primary">{name}</dt>
                  <dd className="min-w-0 break-words text-muted-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </figure>
  );
}
