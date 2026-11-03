export interface CompatibilityExecutionMapData {
  title: string;
  answer: string;
  container: {
    label: string;
    layers: readonly string[];
    guarantee: string;
  };
  host: {
    label: string;
    layers: readonly string[];
  };
  branches: readonly [
    { label: string; path: readonly string[]; failure: string },
    { label: string; path: readonly string[]; failure: string },
  ];
  gate: {
    label: string;
    rollout: string;
    result: string;
  };
}

function DownConnector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-2 text-center text-[11px] font-semibold leading-4 text-muted-foreground" aria-hidden="true">
      <span>{label}</span>
      <span className="h-5 w-px bg-primary/45" />
      <svg viewBox="0 0 16 10" className="h-2.5 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M2 2l6 6 6-6" />
      </svg>
    </div>
  );
}

function LayerList({ layers }: { layers: readonly string[] }) {
  return (
    <ol className="mt-3 grid gap-2">
      {layers.map((layer, index) => (
        <li key={layer} className="flex min-w-0 items-center gap-2 text-sm leading-6 text-foreground">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/35 text-[11px] font-black tabular-nums text-primary">
            {index + 1}
          </span>
          <span className="min-w-0 break-words">{layer}</span>
        </li>
      ))}
    </ol>
  );
}

export default function CompatibilityExecutionMap({ data }: { data: CompatibilityExecutionMapData }) {
  return (
    <figure
      data-viz="compatibility-execution-map"
      className="not-prose my-8 min-w-0 overflow-hidden rounded-2xl border border-border bg-muted/10 p-4 sm:p-6"
    >
      <figcaption>
        <p className="text-xs font-bold text-primary">실행 경로 지도</p>
        <h3 data-toc-ignore className="mt-1 text-lg font-bold leading-7 text-foreground">
          {data.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{data.answer}</p>
      </figcaption>

      <div className="mx-auto mt-6 max-w-3xl">
        <section className="rounded-2xl border border-violet-500/35 bg-violet-500/5 p-4" aria-label={data.container.label}>
          <p className="text-xs font-bold text-violet-800 dark:text-violet-300">컨테이너 안</p>
          <h4 className="mt-1 font-bold text-foreground">{data.container.label}</h4>
          <LayerList layers={data.container.layers} />
          <p className="mt-3 border-t border-violet-500/20 pt-3 text-xs leading-5 text-muted-foreground">
            고정하는 것 · {data.container.guarantee}
          </p>
        </section>

        <DownConnector label="system call과 device API로 호스트에 내려감" />

        <section className="rounded-2xl border border-foreground/25 bg-background p-4" aria-label={data.host.label}>
          <p className="text-xs font-bold text-primary">컨테이너 밖의 공통 바닥</p>
          <h4 className="mt-1 font-bold text-foreground">{data.host.label}</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.host.layers.map((layer) => (
              <span key={layer} className="rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs font-semibold text-foreground">
                {layer}
              </span>
            ))}
          </div>
        </section>

        <DownConnector label="여기서 계산과 통신이 서로 다른 장치 경로로 갈라짐" />

        <div className="grid gap-3 sm:grid-cols-2">
          {data.branches.map((branch, branchIndex) => (
            <section key={branch.label} className="min-w-0 rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/50 text-xs font-black text-primary">
                  {branchIndex + 1}
                </span>
                <h4 className="min-w-0 text-sm font-bold leading-5 text-foreground">{branch.label}</h4>
              </div>
              <LayerList layers={branch.path} />
              <div className="my-3 flex items-center" aria-hidden="true">
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span className="h-px min-w-0 flex-1 bg-primary/45" />
                <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="1.25">
                  <path d="M2 2l8 4-8 4z" />
                </svg>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">어긋나면 · {branch.failure}</p>
            </section>
          ))}
        </div>

        <DownConnector label="두 경로의 영수증을 같은 node ID에 다시 묶음" />

        <section className="rounded-2xl border border-emerald-600/35 bg-emerald-500/5 p-4" aria-label={data.gate.label}>
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">클러스터 입장 게이트</p>
          <h4 className="mt-1 font-bold text-foreground">{data.gate.label}</h4>
          <p className="mt-3 text-sm leading-6 text-foreground">확대 순서 · {data.gate.rollout}</p>
          <p className="mt-2 border-l border-emerald-600/45 pl-3 text-sm font-semibold leading-6 text-foreground">
            {data.gate.result}
          </p>
        </section>
      </div>
    </figure>
  );
}
