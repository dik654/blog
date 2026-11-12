import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cluster — histogram bin이 block 하나의 shared memory에는 크지만 cluster 합산에는 맞는 경우.
 * 그림의 수(가정): cluster 4 blocks, bin 16개, block 하나의 shared memory에 bin 4개.
 * rank r의 block이 bin 4r–4r+3을 맡고, rank 0의 값이 bin 9에 들어가면 rank 2의 shared memory를 원격으로 갱신한다.
 */
const RANKS = [0, 1, 2, 3] as const;
const BINS_PER_BLOCK = 4;
const TARGET_BIN = 9;
const TARGET_RANK = Math.floor(TARGET_BIN / BINS_PER_BLOCK);

const SCENES = [
  { label: "block 하나만으로는", summary: "bin 16개 > 칸 4개", mode: "single", note: "block의 shared memory는 그 block만 씁니다. bin 16개를 모두 담아야 하는데 이 block의 shared memory에는 4개만 들어간다고 가정하면 나머지 12개를 둘 곳이 없습니다." },
  { label: "cluster로 함께 배치", summary: "4 blocks · rank 0–3 · 같은 GPC", mode: "cluster", note: "네 block을 한 cluster로 묶으면 같은 GPC 안에서 함께 scheduling됩니다. 각 block의 shared memory를 합치면 16칸이 되어 rank마다 bin 4개씩 나눠 맡을 수 있습니다. 이 합쳐진 주소 공간이 DSM입니다." },
  { label: "다른 rank의 bin 갱신", summary: `rank 0 → rank ${TARGET_RANK}의 bin ${TARGET_BIN}`, mode: "remote", note: `rank 0이 처리한 값이 bin ${TARGET_BIN}에 속하면, bin ${TARGET_BIN}을 맡은 rank ${TARGET_RANK} block의 shared memory 주소를 rank로 찾아가 갱신합니다. 이런 remote DSM access와 cluster synchronization은 자기 shared memory 접근보다 비쌉니다.` },
  { label: "협력 범위의 끝", summary: "정해진 cluster · lifetime 안에서만", mode: "scope", note: "DSM은 chip 전체가 공유하는 cache가 아닙니다. 이 cluster 밖의 block은 rank 주소로 이 shared memory를 찾아오지 못하고, 정해진 cluster의 lifetime 안에서만 쓰는 범위입니다. cluster residency가 scheduling을 제한할 수도 있으므로 global-memory baseline과 함께 비교합니다." },
] as const;

export default function ClusterDsmViz() {
  return (
    <SceneShell
      eyebrow="Distributed shared memory"
      title="큰 histogram을 네 block의 shared memory에 나눠 담습니다"
      description="큰 칸 하나가 thread block 하나이고, 그 안의 작은 칸이 그 block의 shared memory에 둔 histogram bin입니다. rank는 cluster 안에서 block을 가리키는 번호, GPC는 GPU 안의 SM 묶음입니다. block 4개, bin 16개, block당 bin 4개는 그림을 위한 가정이며 실제 크기를 뜻하지 않습니다."
      ariaLabel="histogram bin 16개를 네 block의 shared memory에 rank별로 나누고 다른 rank의 bin을 원격으로 갱신하는 과정"
      scenes={SCENES}
      render={(active) => {
        const mode = SCENES[active].mode;
        const single = mode === "single";
        const remote = mode === "remote";
        const scope = mode === "scope";
        return (
          <div className="min-w-0">
            <div className={`rounded-lg border p-2 sm:p-3 ${single ? "border-dashed border-border/50" : "border-[#2563eb]"}`}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-1 text-xs">
                <span className={`font-semibold ${single ? "text-muted-foreground/60" : "text-[#2563eb]"}`}>{single ? "cluster 없음" : "thread block cluster (같은 GPC)"}</span>
                <span className={`font-mono ${single ? "text-muted-foreground/60" : "text-muted-foreground"}`}>{single ? "block 0만 사용" : "DSM = 4 blocks의 shared memory"}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {RANKS.map((rank) => {
                  const on = !single || rank === 0;
                  const isTarget = remote && rank === TARGET_RANK;
                  const isSource = remote && rank === 0;
                  return (
                    <div
                      key={rank}
                      className={`rounded-md border px-2 py-2 text-xs ${on ? "bg-background" : "bg-transparent"} ${isTarget ? "border-[#d97706]" : isSource ? "border-[#2563eb]" : on ? "border-border" : "border-dashed border-border/40"}`}
                    >
                      <span className={`block font-bold ${on ? "" : "text-muted-foreground/50"}`}>{single ? `block ${rank}` : `block · rank ${rank}`}</span>
                      <div className="mt-1 grid grid-cols-4 gap-1">
                        {Array.from({ length: BINS_PER_BLOCK }, (_, i) => {
                          const bin = rank * BINS_PER_BLOCK + i;
                          const label = single ? (rank === 0 ? `${i}` : "") : `${bin}`;
                          const hot = remote && bin === TARGET_BIN;
                          return (
                            <span
                              key={i}
                              className={`flex h-6 items-center justify-center rounded-sm border font-mono text-[11px] ${hot ? "border-[#d97706] bg-[#d97706] font-bold text-white" : on ? "border-border bg-muted/40" : "border-dashed border-border/40"}`}
                            >
                              {hot ? "+1" : label}
                            </span>
                          );
                        })}
                      </div>
                      <span className={`mt-1 block text-[11px] ${isTarget ? "font-semibold text-[#d97706]" : isSource ? "font-semibold text-[#2563eb]" : "text-muted-foreground"}`}>
                        {isTarget ? `bin ${TARGET_BIN} 원격 갱신` : isSource ? `값 → bin ${TARGET_BIN}` : on ? "shared memory" : "공유 안 됨"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={`mt-3 rounded-lg border px-3 py-2 text-xs leading-5 ${single ? "border-dashed border-[#dc2626]" : scope ? "border-dashed border-border" : "border-border"}`}>
              {single && <span className="text-[#dc2626]">bin 4–15 (12개): block 0의 shared memory에 들어가지 않음</span>}
              {mode === "cluster" && <span className="text-muted-foreground">bin 0–15가 rank별로 4개씩 나뉘어 모두 들어감</span>}
              {remote && <span className="text-muted-foreground">자기 bin(0–3)은 local shared 접근, 그 밖의 bin은 다른 rank로 가는 remote DSM 접근</span>}
              {scope && <span className="text-muted-foreground">다른 cluster의 block: 이 rank 주소로 접근 못 함 · 비교 기준: global memory로 같은 histogram을 만드는 baseline</span>}
            </div>
          </div>
        );
      }}
    />
  );
}
