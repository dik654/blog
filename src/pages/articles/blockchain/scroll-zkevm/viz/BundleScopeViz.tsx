import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bundle — batch는 여러 chunk와 하나의 DA blob을 묶고, bundle은 여러 batch proof를
 * 다시 집계한다. BundleInfo::from은 첫 batch의 parent 값과 마지막 batch의 결과 값을 가져온다.
 * batch 3개, batch당 chunk 2개는 설명용 가정이다.
 */
const BATCHES = [
  { name: "batch 1 (첫)", chunks: ["chunk proof", "chunk proof"], fields: ["parent_state_root", "parent_batch_hash"] },
  { name: "batch 2", chunks: ["chunk proof", "chunk proof"], fields: [] as string[] },
  { name: "batch 3 (마지막)", chunks: ["chunk proof", "chunk proof"], fields: ["state_root", "batch_hash", "withdrawal root", "message queue"] },
] as const;

const SCENES = [
  {
    label: "두 번 접는 계층",
    summary: "chunk → batch → bundle",
    note: "batch는 여러 chunk proof와 하나의 DA blob을 묶은 단위이고, bundle은 여러 batch proof를 다시 집계해 L1에서 한 번에 최종화할 범위를 만듭니다. 여러 batch의 proof verification 비용을 한 최종화 transaction에 나누어 담기 위한 층입니다.",
  },
  {
    label: "BundleInfo가 가져오는 값",
    summary: "첫 batch의 시작 + 마지막 batch의 끝",
    note: "BundleInfo::from은 첫 batch에서 parent 값을, 마지막 batch에서 결과 값을 가져오고 가운데 batch의 값은 직접 넣지 않습니다. bundle을 만들 때도 인접 batch의 state·batch hash·message queue 연속성은 다시 확인합니다.",
  },
] as const;

export default function BundleScopeViz() {
  return (
    <SceneShell
      eyebrow="bundle 범위"
      title="bundle은 첫 batch의 시작과 마지막 batch의 끝을 묶습니다"
      description="줄 하나가 batch 하나이고, 작은 칸은 그 batch에 묶인 chunk proof와 DA blob(L1에 올리는 transaction data 묶음)입니다. 맨 위 상자가 L1에서 한 번에 최종화하는 단위인 bundle입니다."
      note="batch 3개와 batch당 chunk 2개는 설명용 가정입니다(가정). 실제 개수는 이 그림이 나타내지 않습니다."
      ariaLabel="chunk에서 batch, batch에서 bundle로 집계하는 계층과 BundleInfo가 첫·마지막 batch에서 가져오는 필드"
      scenes={SCENES}
      render={(active) => {
        const picking = active === 1;
        return (
          <div className="min-w-0 space-y-1.5">
            <div className="rounded-lg border border-primary bg-background px-3 py-1.5">
              <p className="text-xs font-bold sm:text-sm">bundle proof · BundleInfo</p>
              <p className={`mt-1 font-mono text-[11px] leading-5 sm:text-xs ${picking ? "" : "text-muted-foreground"}`}>
                {picking
                  ? "첫 batch의 parent 값 + 마지막 batch의 결과 값"
                  : "↑ 아래 batch proof들을 다시 집계"}
              </p>
            </div>
            {BATCHES.map((batch, index) => {
              const contributes = picking && batch.fields.length > 0;
              return (
                <div key={batch.name} className="space-y-1">
                  {index > 0 ? (
                    <p className={`text-center font-mono text-[11px] ${picking ? "font-bold text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"}`}>
                      {picking ? `batch ${index} 끝 = batch ${index + 1} 시작 (다시 확인)` : "·"}
                    </p>
                  ) : null}
                  <div className={`min-w-0 rounded-lg border px-3 py-1.5 ${contributes ? "border-amber-600 bg-amber-500/10" : "border-border bg-background"}`}>
                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <p className="text-xs font-bold sm:text-sm">{batch.name}</p>
                      <div className="flex flex-wrap items-center gap-1">
                        {batch.chunks.map((chunk, chunkIndex) => (
                          <span key={`${batch.name}-${chunkIndex}`} className="rounded-md border border-border px-1.5 font-mono text-[10px] leading-5">
                            {chunk}
                          </span>
                        ))}
                        <span className="rounded-md border border-dashed border-border px-1.5 font-mono text-[10px] leading-5">DA blob</span>
                      </div>
                    </div>
                    <p className="mt-0.5 min-h-[2.5rem] break-words font-mono text-[11px] leading-5 sm:min-h-[1.25rem] sm:text-xs">
                      {picking
                        ? batch.fields.length > 0
                          ? `→ ${batch.fields.join(" · ")}`
                          : "직접 들어가는 값 없음"
                        : "batch proof 하나"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
