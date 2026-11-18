import SceneShell from "./ArchSceneShell";

/**
 * 본문 대응: #host-device-execution-trace — SAXPY 1,048,576개 원소, block당 256 threads, warp 32 lanes.
 * 1,048,576 ÷ 256 = 4,096 blocks, 256 ÷ 32 = 8 warps, block 0의 warp 0은 i = 0…31을 맡는다.
 * SM 개수와 block이 놓이는 SM은 글에 정해져 있지 않아 SM 네 칸은 그림용 가정이다.
 */
const ELEMENTS = 1048576;
const BLOCK_THREADS = 256;
const WARP = 32;
const BLOCKS = ELEMENTS / BLOCK_THREADS;
const WARPS_PER_BLOCK = BLOCK_THREADS / WARP;

const SCENES = [
  {
    label: "1. Grid를 256개씩 자릅니다",
    summary: `1,048,576 ÷ 256 = ${BLOCKS.toLocaleString("en-US")} blocks`,
    note: "Kernel launch가 만드는 grid와 block은 software가 정한 작업표입니다. 원소 하나를 thread 하나가 맡으므로 256개씩 묶은 block이 4,096개 생깁니다.",
  },
  {
    label: "2. Block이 SM 하나에 놓입니다",
    summary: "어느 SM·언제인지는 보장되지 않음",
    note: "Block 0은 실행되는 동안 한 SM에 머뭅니다. 배치는 hardware가 맡고, 어느 SM에 언제 놓일지는 보장되지 않습니다. 그림의 위치는 예시입니다.",
  },
  {
    label: "3. SM이 block을 warp로 묶습니다",
    summary: `256 ÷ 32 = ${WARPS_PER_BLOCK} warps`,
    note: "SM은 block의 thread 256개를 32-lane warp 8개로 묶습니다. Thread 하나가 CUDA core 하나를 계속 소유하는 것이 아니라, warp 단위로 instruction이 발행됩니다.",
  },
  {
    label: "4. Warp 0이 load를 발행합니다",
    summary: "lane 0…31 → x[0…31]·y[0…31]",
    note: "Block 0의 warp 0에서 lane 번호가 곧 원소 번호 i입니다. 32개 lane이 같은 load instruction으로 x와 y를 읽고, 결과가 올 때까지 이 warp는 기다립니다. 그동안 SM은 다른 resident warp를 실행할 수 있습니다.",
  },
  {
    label: "5. 계산하고 32개 결과를 저장합니다",
    summary: "y[i] = a × x[i] + y[i], i = 0…31",
    note: "값이 도착하면 같은 instruction으로 32개 lane이 곱하고 더한 뒤 y에 저장합니다. 이 글의 모든 절은 이 32개 결과가 저장되기까지의 길을 다룹니다.",
  },
] as const;

const STAGES = ["load x[i] · y[i]", "a × x[i] + y[i]", "store y[i]"] as const;

function Cell({ on, strong, label }: { on: boolean; strong?: boolean; label: string }) {
  return (
    <div
      className={`flex h-8 min-w-0 items-center justify-center rounded-md border px-1 text-center font-mono text-[11px] leading-4 ${
        strong ? "border-primary bg-primary/15 font-bold text-primary" : on ? "border-border bg-background" : "border-border/50 text-muted-foreground/70"
      }`}
    >
      {label}
    </div>
  );
}

export default function SaxpyTraceViz() {
  return (
    <SceneShell
      eyebrow="SAXPY 한 번의 길"
      title="원소 100만 개가 block과 warp를 거쳐 32개 lane에 닿습니다"
      description="SAXPY는 y[i] = a × x[i] + y[i]를 원소마다 계산하는 kernel입니다. 위에서 아래로 grid → SM → block 0 → warp 0으로 좁혀 갑니다. SM 칸 수와 block 위치는 그림용 가정입니다."
      ariaLabel="SAXPY grid가 block, SM, warp, lane으로 내려가는 다섯 단계"
      scenes={SCENES}
      render={(active) => {
        const gridBlocks = ["0", "1", "2", "3", "…", `${BLOCKS - 1}`];
        return (
          <div className="grid min-w-0 gap-4 md:grid-cols-2 md:gap-6">
            <div className="min-w-0 space-y-4">
            <div className="min-w-0">
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Grid · thread 1,048,576개 · block 번호</p>
              <div className="grid grid-cols-6 gap-1.5">
                {gridBlocks.map((name, index) => (
                  <Cell key={name} label={name} on={active === 0} strong={index === 0 && active >= 1} />
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">SM (네 칸만 그림 · 가정)</p>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((sm) => {
                  const holds = sm === 2 && active >= 1;
                  return (
                    <div
                      key={sm}
                      className={`flex h-12 min-w-0 flex-col items-center justify-center rounded-md border text-center text-[11px] leading-4 ${
                        holds ? "border-primary bg-primary/10" : active === 1 ? "border-dashed border-border" : "border-border/50"
                      }`}
                    >
                      <span className="font-semibold">SM</span>
                      <span className={holds ? "font-mono font-bold text-primary" : "text-muted-foreground/70"}>
                        {holds ? "block 0" : active === 1 ? "?" : "·"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            </div>
            <div className="min-w-0 space-y-4">
            <div className="min-w-0">
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Block 0 · warp 8개 × lane 32개</p>
              <div className={`space-y-0.5 ${active >= 2 ? "" : "opacity-35"}`}>
                {Array.from({ length: WARPS_PER_BLOCK }, (_, warp) => {
                  const hot = warp === 0 && active >= 3;
                  return (
                    <div key={warp} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-2">
                      <span className={`font-mono text-[11px] ${hot ? "font-bold text-primary" : "text-muted-foreground"}`}>
                        warp {warp}
                      </span>
                      <div className="grid min-w-0 grid-cols-[repeat(32,minmax(0,1fr))] gap-px">
                        {Array.from({ length: WARP }, (_, lane) => (
                          <span
                            key={lane}
                            className={`block h-2.5 rounded-[2px] ${hot ? "bg-[#4f46e5]" : active >= 2 ? "bg-[#a1a1aa]" : "bg-[#d4d4d8]"}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
                <p className="pl-[4rem] font-mono text-[11px] text-muted-foreground">
                  {active >= 3 ? "warp 0 = thread 0…31 = 원소 i 0…31" : "thread 0…255"}
                </p>
              </div>
            </div>

            <div className="min-w-0">
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Warp 0이 발행하는 instruction 순서</p>
              <div className="grid grid-cols-3 gap-1.5">
                {STAGES.map((name, index) => {
                  const done = active === 4;
                  const now = active === 3 && index === 0;
                  return (
                    <div
                      key={name}
                      className={`flex h-10 min-w-0 items-center justify-center rounded-md border px-1 text-center font-mono text-[11px] leading-4 ${
                        now || done ? "border-primary bg-primary/10 font-bold text-primary" : "border-border/50 text-muted-foreground/70"
                      }`}
                    >
                      {name}
                    </div>
                  );
                })}
              </div>
            </div>
            </div>
          </div>
        );
      }}
    />
  );
}
