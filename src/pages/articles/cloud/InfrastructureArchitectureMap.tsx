export interface InfrastructureArchitectureMapData {
  title: string;
  answer: string;
  workload: {
    label: string;
    detail: string;
  };
  compute: {
    label: string;
    scaleUp: string;
    inventory: string;
  };
  fabrics: readonly {
    name: string;
    link: string;
    destination: string;
    boundary: string;
  }[];
  facility: {
    label: string;
    detail: string;
  };
  receipts: readonly string[];
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-2 text-[11px] font-semibold text-muted-foreground" aria-hidden="true">
      <span>{label}</span>
      <span className="h-5 w-px bg-primary/50" />
      <svg viewBox="0 0 16 10" className="h-2.5 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M2 2l6 6 6-6" />
      </svg>
    </div>
  );
}

export default function InfrastructureArchitectureMap({
  data,
}: {
  data: InfrastructureArchitectureMapData;
}) {
  return (
    <figure
      data-viz="infrastructure-architecture-map"
      className="not-prose my-8 min-w-0 overflow-hidden rounded-2xl border border-border bg-muted/10 p-4 sm:p-6"
    >
      <figcaption>
        <p className="text-xs font-bold text-primary">전체 아키텍처</p>
        <h3 data-toc-ignore className="mt-1 text-lg font-bold leading-7 text-foreground">
          {data.title}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{data.answer}</p>
      </figcaption>

      <div className="mx-auto mt-6 max-w-4xl">
        <div className="mx-auto max-w-xl rounded-full border border-primary/50 bg-background px-4 py-3 text-center">
          <p className="text-xs font-bold text-primary">{data.workload.label}</p>
          <p className="mt-1 text-sm leading-6 text-foreground">{data.workload.detail}</p>
        </div>

        <Connector label="완료 조건을 자원 요구로 변환" />

        <section className="rounded-2xl border border-foreground/25 bg-background p-4" aria-label={data.compute.label}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold text-primary">연산 영역</p>
              <h4 className="mt-1 font-bold text-foreground">{data.compute.label}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{data.compute.inventory}</p>
            </div>
            <div className="rounded-xl border border-violet-500/35 bg-violet-500/5 px-3 py-2 text-sm leading-6 text-foreground">
              <span className="font-semibold">노드 안쪽 scale-up</span>
              <br />
              {data.compute.scaleUp}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8" aria-label="16개 노드 가운데 반복 단위 표시">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="flex min-h-11 items-center justify-center rounded-lg border border-border bg-muted/25 text-xs font-bold tabular-nums text-muted-foreground"
              >
                {index < 3 ? `N${String(index + 1).padStart(2, "0")}` : index === 3 ? "…" : index === 7 ? "N16" : "·"}
              </div>
            ))}
          </div>
        </section>

        <Connector label="서로 다른 트래픽을 세 경로로 분리" />

        <p className="mb-3 text-center text-xs font-semibold text-muted-foreground">
          세 망은 앞뒤 순서가 아니라 동시에 존재하는 병렬 경로입니다
        </p>
        <div className="grid gap-3 xl:grid-cols-3">
          {data.fabrics.map((fabric, index) => (
            <section key={fabric.name} className="min-w-0 rounded-xl border border-border bg-background p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/50 text-xs font-black text-primary">
                  {index + 1}
                </span>
                <h4 className="min-w-0 break-keep text-sm font-bold leading-5 text-foreground">{fabric.name}</h4>
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-foreground">{fabric.link}</p>
              <div className="my-3 flex items-center" aria-hidden="true">
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span className="h-px min-w-0 flex-1 bg-primary/45" />
                <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="1.25">
                  <path d="M2 2l8 4-8 4z" />
                </svg>
              </div>
              <p className="text-sm font-semibold leading-6 text-primary">{fabric.destination}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{fabric.boundary}</p>
            </section>
          ))}
        </div>

        <Connector label="장비가 놓일 현장 조건과 결합" />

        <section className="rounded-xl border border-amber-500/35 bg-amber-500/5 p-4 text-center">
          <p className="text-xs font-bold text-amber-800 dark:text-amber-300">{data.facility.label}</p>
          <p className="mt-2 text-sm leading-6 text-foreground">{data.facility.detail}</p>
        </section>

        <Connector label="각 요구를 시험 결과로 닫음" />

        <section className="rounded-xl border border-emerald-600/35 bg-emerald-500/5 p-4">
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">납품 검수 영수증</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {data.receipts.map((receipt) => (
              <li key={receipt} className="min-w-0 border-l border-emerald-600/45 pl-3 text-sm leading-6 text-foreground">
                {receipt}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </figure>
  );
}
