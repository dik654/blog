import SceneShell from "./SceneShell";

/**
 * 본문 대응: #eip4844 첫 문단 — Type-3 거래에는 versioned hash 목록, blob·KZG commitment·proof는 합의 계층 sidecar로 전파,
 * 합의 노드는 sidecar 전체를 받음, EVM contract는 blob byte를 읽지 않고 versioned hash와 sidecar commitment의 연결을 확인.
 */
const SCENES = [
  { label: "거래에 들어가는 것", summary: "blob 원문 대신 versioned hash 목록", note: "Type-3 거래(EIP-4844가 정한 blob 거래 형식)에는 blob 원문이 들어가지 않습니다. 각 blob을 가리키는 versioned hash 목록만 들어갑니다." },
  { label: "sidecar로 따로 가는 것", summary: "blob · commitment · proof", note: "Blob 원문, KZG commitment(blob을 짧은 값 하나로 묶은 약속값), proof는 합의 계층의 sidecar(거래와 따로 전파되는 묶음)로 함께 갑니다. 합의 노드는 sidecar 전체를 받습니다." },
  { label: "EVM이 확인하는 것", summary: "hash ↔ commitment 연결", note: "EVM contract는 blob byte를 직접 읽지 않습니다. 거래의 versioned hash와 sidecar의 commitment가 연결됐는지를 확인합니다." },
] as const;

function Item({ label, lit, muted = false, crossed = false }: { label: string; lit: boolean; muted?: boolean; crossed?: boolean }) {
  return (
    <span
      className={`rounded-md border px-2 py-1 text-center font-mono text-[11px] font-bold leading-4 sm:text-xs ${
        crossed
          ? "border-dashed border-[#dc2626] text-[#b91c1c] line-through dark:text-[#fca5a5]"
          : lit
            ? "border-[#2563eb] bg-[#2563eb]/15 text-[#1d4ed8] dark:text-[#93c5fd]"
            : muted
              ? "border-border/60 text-muted-foreground/60"
              : "border-border text-foreground"
      }`}
    >
      {label}
    </span>
  );
}

export default function BlobSidecarViz() {
  return (
    <SceneShell
      eyebrow="EIP-4844 운반 경로"
      title="거래에는 hash만, blob 원문은 sidecar로 따로 갑니다"
      description="위 줄은 실행 계층의 거래, 아래 줄은 합의 계층의 sidecar입니다. 파란 칸이 현재 장면에서 보는 항목입니다."
      ariaLabel="Type-3 거래와 sidecar가 나눠 운반하는 항목과 EVM이 확인하는 연결을 보여 주는 세 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <section className="grid grid-cols-1 items-center gap-2 rounded-lg border border-border bg-background p-3">
            <p className="text-[11px] font-bold">Type-3 거래 <span className="font-normal text-muted-foreground">· 실행 계층</span></p>
            <div className="flex flex-wrap gap-1.5">
              <Item label="versioned hash 목록" lit={active === 0 || active === 2} />
              <Item label="blob 원문" lit={false} crossed={active === 0} muted={active !== 0} />
            </div>
          </section>

          <div>
            <p className={`min-h-5 text-[11px] font-semibold ${active === 2 ? "text-[#2563eb]" : "text-transparent"}`}>↕ EVM: hash와 commitment가 연결됐는가</p>
          </div>

          <section className="grid grid-cols-1 items-center gap-2 rounded-lg border border-border bg-background p-3">
            <p className="text-[11px] font-bold">sidecar <span className="font-normal text-muted-foreground">· 합의 계층</span></p>
            <div className="flex flex-wrap gap-1.5">
              <Item label={active === 2 ? "blob 원문 · EVM이 읽지 않음" : "blob 원문"} lit={active === 1} muted={active !== 1} />
              <Item label="KZG commitment" lit={active >= 1} muted={active === 0} />
              <Item label="KZG proof" lit={active === 1} muted={active !== 1} />
            </div>
          </section>

        </div>
      )}
    />
  );
}
