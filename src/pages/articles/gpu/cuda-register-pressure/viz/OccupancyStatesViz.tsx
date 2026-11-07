import SceneShell from "./SceneShell";

/**
 * 본문 대응: #residency — 하드웨어 최대 64 warps ⊃ theoretical 48 ⊃ active ⊃ eligible.
 * 64·48은 37 registers·128-thread 사례. active 32와 eligible 12는 그림을 위한 가정이다.
 */
const BLOCK_SLOTS = 16;
const BLOCK_WARPS = 4;
const THEORETICAL_BLOCKS = 12;
const ACTIVE_BY_BLOCK = [4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 1] as const;
const ELIGIBLE_BY_BLOCK = [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0] as const;
const ACTIVE_TOTAL = ACTIVE_BY_BLOCK.reduce<number>((sum, count) => sum + count, 0);
const ELIGIBLE_TOTAL = ELIGIBLE_BY_BLOCK.reduce<number>((sum, count) => sum + count, 0);

const SCENES = [
  { label: "하드웨어 최대치", summary: "64 warps = 분모", note: "이 대상이 동시에 둘 수 있는 warp는 최대 64개입니다. 네 칸짜리 묶음 하나가 128-thread block 하나의 자리이고, 16묶음이면 64칸입니다." },
  { label: "Theoretical occupancy", summary: "48/64 = 75%", note: "자원 한도로 계산한 최대 배치 비율입니다. 37 registers·128-thread 사례는 12 blocks, 48 warps를 놓습니다. 상한을 계산한 값이며 실행 중에 관측한 값이 아닙니다." },
  { label: "Active warp", summary: `${ACTIVE_TOTAL}/64 = ${(ACTIVE_TOTAL / 64) * 100}% (가정)`, note: `실행 중 실제로 남아 있는 warp입니다. 먼저 끝난 warp가 빠져 ${ACTIVE_TOTAL}개가 남았다고 놓습니다(가정). 이를 같은 64와 비교한 것이 achieved occupancy의 출발점입니다. 수집 구간과 cycle 분모는 profiler metric 정의를 따릅니다.` },
  { label: "Eligible warp", summary: `${ELIGIBLE_TOTAL}개만 명령 가능 (가정)`, note: `지금 명령을 낼 수 있는 warp입니다. 나머지 active warp는 다음 입력을 기다린다고 놓았습니다(가정). 배치된 warp가 많아도 이 수가 작으면 명령 발행이 빌 수 있습니다.` },
] as const;

function seatMark(scene: number, block: number, warp: number) {
  if (scene === 0 || block >= THEORETICAL_BLOCKS) return "empty";
  if (scene === 1) return "placed";
  const activeCount = (ACTIVE_BY_BLOCK as readonly number[])[block];
  if (warp >= activeCount) return "placed";
  if (scene === 2) return "active";
  return warp < (ELIGIBLE_BY_BLOCK as readonly number[])[block] ? "eligible" : "active";
}

const SEAT = {
  empty: { className: "border-border bg-background", glyph: "" },
  placed: { className: "border-primary/60 border-dashed", glyph: "○" },
  active: { className: "border-primary bg-primary/20", glyph: "●" },
  eligible: { className: "border-primary bg-primary/50 font-bold", glyph: "▶" },
} as const;

export default function OccupancyStatesViz() {
  return (
    <SceneShell
      eyebrow="네 가지 수"
      title="자리 수, 배치 수, 남은 수, 지금 명령을 낼 수 있는 수는 다릅니다"
      description="작은 칸 하나가 warp 하나입니다. 장면이 넘어갈수록 앞 장면의 칸 안에서 더 좁은 수를 고릅니다."
      note="64와 48은 본문의 CC 7.0 사례이고, active 32와 eligible 12는 그림을 위해 고른 값입니다(가정). 칸의 위치는 설명용이며 특정 profiler metric의 출력이 아닙니다."
      ariaLabel="하드웨어 최대, theoretical, active, eligible warp 수 비교"
      scenes={SCENES}
      render={(active) => (
        <div>
          <div className="grid grid-cols-8 gap-1.5 sm:gap-3">
            {Array.from({ length: BLOCK_SLOTS }, (_, block) => (
              <div key={block} className="grid grid-cols-2 gap-[2px]">
                {Array.from({ length: BLOCK_WARPS }, (_, warp) => {
                  const seat = SEAT[seatMark(active, block, warp)];
                  return (
                    <span key={warp} className={`flex h-4 items-center justify-center border text-[9px] leading-none sm:h-6 sm:text-[11px] ${seat.className}`}>
                      {seat.glyph}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">빈칸 = 쓰지 않은 자리 · ○ 배치 자리(끝난 warp 포함) · ● active · ▶ eligible</p>
        </div>
      )}
    />
  );
}
