const cells = Array.from({ length: 64 }, (_, index) => index);

export function ErasureGridViz() {
  return (
    <figure data-viz="da-erasure-grid" className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">4×4 원본을 8×8로 확장한 2D 예시</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">진한 16칸은 원본이며, 나머지는 행·열 Reed–Solomon parity입니다. 이 그림은 Celestia 계열 2D 구조를 설명하며 PeerDAS 구조가 아닙니다.</p>
      </figcaption>
      <div className="mx-auto grid w-full max-w-[360px] grid-cols-8 gap-1" aria-label="8행 8열 erasure-coded data square">
        {cells.map((index) => {
          const row = Math.floor(index / 8);
          const col = index % 8;
          const source = row < 4 && col < 4;
          return <div key={index} className={`aspect-square rounded-[4px] border border-border ${source ? "bg-primary/18" : "bg-muted/55"}`} title={source ? "source cell" : "parity cell"} />;
        })}
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-[3px] border border-border bg-primary/18" />source 16</span>
        <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-[3px] border border-border bg-muted/55" />parity 48</span>
        <span>복원 threshold: 4 cells / decodable row·column</span>
      </div>
    </figure>
  );
}

const systems = [
  { name: "EIP-4844", encoding: "DAS extension 없음", unit: "node가 blob sidecar 전체 수신", result: "temporary blob DA" },
  { name: "PeerDAS", encoding: "blob row별 1D extension", unit: "모든 row를 가로지르는 column", result: "column custody + sampling" },
  { name: "Celestia", encoding: "row·column 2D extension", unit: "extended data square의 share", result: "2D DAS + namespace layout" },
] as const;

export function DAArchitectureViz() {
  return (
    <figure data-viz="da-architecture-comparison" className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">세 구조는 같은 “blob sampling”이 아니다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">확장 방향과 표본 단위가 다르므로 하나의 2D 그림으로 합쳐 설명하면 안 됩니다.</p>
      </figcaption>
      <div className="grid gap-4 lg:grid-cols-3">
        {systems.map((system) => (
          <section key={system.name} className="min-w-0 rounded-lg border border-border bg-background p-4">
            <p className="text-sm font-semibold text-foreground">{system.name}</p>
            <dl className="mt-4 space-y-3 text-xs leading-5">
              <div><dt className="font-medium text-foreground">확장</dt><dd className="break-words text-muted-foreground">{system.encoding}</dd></div>
              <div><dt className="font-medium text-foreground">확인 단위</dt><dd className="break-words text-muted-foreground">{system.unit}</dd></div>
              <div><dt className="font-medium text-foreground">얻는 것</dt><dd className="break-words text-muted-foreground">{system.result}</dd></div>
            </dl>
          </section>
        ))}
      </div>
    </figure>
  );
}
