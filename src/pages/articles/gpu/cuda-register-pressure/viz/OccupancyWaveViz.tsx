import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: theoretical occupancy 는 자원 한도가 정한 slot 수이고,
 * achieved occupancy 는 실행 중 실제로 찬 slot 의 평균이다.
 * 장면 1 full wave → 장면 2 tail wave → 장면 3 block 안의 warp 불균형.
 * stage 높이는 세 장면의 최대 필요 크기로 고정한다.
 */
const SCENES = ["Full wave", "Tail wave", "Warp imbalance"] as const;

const NOTES = [
  "8개 SM 에 block slot 이 2개씩, 16개 block 이 모두 차 있습니다. 이 순간의 achieved 는 theoretical 과 같습니다.",
  "Grid 의 마지막 wave 에 block 3개만 남았습니다. 13개 slot 이 비어 있는 동안 achieved 는 theoretical 의 3/16 로 떨어집니다.",
  "Block 안의 warp 8개 중 5개가 먼저 끝나도 block slot 은 마지막 warp 가 끝날 때까지 반납되지 않아 active warp 가 resident warp 보다 적습니다.",
] as const;

const SM_COUNT = 8;
const SLOTS_PER_SM = 2;
const WARPS_PER_BLOCK = 8;

function slotFilled(scene: number, sm: number, slot: number) {
  if (scene === 0) return true;
  if (scene === 1) return sm * SLOTS_PER_SM + slot < 3;
  return true;
}

function warpActive(scene: number, sm: number, slot: number, warp: number) {
  if (scene !== 2) return slotFilled(scene, sm, slot);
  const finished = 3 + ((sm + slot) % 3);
  return warp >= finished;
}

export default function OccupancyWaveViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const active = scenes.active;
  let activeWarps = 0;
  for (let sm = 0; sm < SM_COUNT; sm += 1) {
    for (let slot = 0; slot < SLOTS_PER_SM; slot += 1) {
      for (let warp = 0; warp < WARPS_PER_BLOCK; warp += 1) {
        if (warpActive(active, sm, slot, warp)) activeWarps += 1;
      }
    }
  }
  const residentMax = SM_COUNT * SLOTS_PER_SM * WARPS_PER_BLOCK;
  const achievedPct = Math.round((activeWarps / residentMax) * 100);

  return (
    <VizFrame
      eyebrow="Theoretical vs achieved occupancy"
      title="자원 한도가 정한 slot 수와 실행 중 실제로 찬 slot 은 다르다"
      description="각 열이 SM 하나, 큰 칸이 block slot, 작은 칸이 그 block 의 warp 입니다. 세 장면은 같은 kernel 의 서로 다른 시각입니다."
      note="SM 8개와 block slot 2개는 그림을 위한 축소이며, 실제 slot 수는 register·shared memory·thread·block 한도의 최소값에서 나옵니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Theoretical occupancy 와 achieved occupancy 가 wave 와 warp 불균형으로 벌어지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[24rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[active]}</h4>
          <div className="mt-5 overflow-x-auto">
            <div className="grid min-w-[36rem] grid-cols-8 gap-2">
              {Array.from({ length: SM_COUNT }, (_, sm) => (
                <div key={sm} className="flex flex-col gap-2">
                  <span className="text-center font-mono text-[10px] font-bold text-muted-foreground">
                    SM{sm}
                  </span>
                  {Array.from({ length: SLOTS_PER_SM }, (_, slot) => {
                    const filled = slotFilled(active, sm, slot);
                    return (
                      <div
                        key={slot}
                        aria-label={`SM${sm} slot ${slot} ${filled ? "busy" : "idle"}`}
                        className={`grid grid-cols-2 gap-1 border p-1 ${
                          filled ? "border-primary/55 bg-primary/5" : "border-border bg-muted/30"
                        }`}
                      >
                        {Array.from({ length: WARPS_PER_BLOCK }, (_, warp) => {
                          const on = warpActive(active, sm, slot, warp);
                          return (
                            <span
                              key={warp}
                              className={`h-3 border ${
                                on ? "border-primary/60 bg-primary/40" : "border-border bg-background"
                              }`}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <dl className="mt-5 grid gap-2 text-xs sm:grid-cols-3">
            <div className="border border-border px-3 py-2">
              <dt className="font-bold text-muted-foreground">Theoretical</dt>
              <dd className="mt-1 font-mono text-sm font-black">
                {residentMax} warps · 100%
              </dd>
            </div>
            <div className="border border-border px-3 py-2">
              <dt className="font-bold text-muted-foreground">Active now</dt>
              <dd className="mt-1 font-mono text-sm font-black">
                {activeWarps} warps
              </dd>
            </div>
            <div className="border border-primary/55 bg-primary/5 px-3 py-2">
              <dt className="font-bold text-muted-foreground">Achieved(이 순간)</dt>
              <dd className="mt-1 font-mono text-sm font-black">{achievedPct}%</dd>
            </div>
          </dl>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
