import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: warp 32 lane 의 주소가 32-byte sector 로 묶여 memory transaction 이 되고,
 * 접근 pattern 에 따라 같은 128 B 의 useful byte 를 위해 옮기는 byte 가 달라지는 과정.
 * 장면 = 접근 pattern 하나. stage 높이는 고정, control row 는 아래 고정 row.
 */
const SCENES = ["연속 · 정렬", "연속 · 4 B 어긋남", "stride 2", "stride 8"] as const;

const SECTOR_BYTES = 32;
const SECTORS = 32; // 1024 B 범위를 sector 32개로 표시
const LANE_BYTES = 4;

type Scene = { stride: number; offset: number };

const STATES: readonly Scene[] = [
  { stride: 1, offset: 0 },
  { stride: 1, offset: 1 },
  { stride: 2, offset: 0 },
  { stride: 8, offset: 0 },
];

const NOTES = [
  "Lane 32개가 float 32개를 이어서 읽고 첫 주소가 128 B 경계에 맞습니다. 주소가 sector 4개에만 걸리므로 transaction 4개, 옮긴 128 B 가 전부 useful byte 입니다.",
  "같은 연속 접근인데 시작이 4 B 어긋났습니다. 마지막 lane 이 다섯 번째 sector 로 넘어가 transaction 5개, 옮긴 160 B 중 128 B 만 쓰여 효율 80% 입니다.",
  "Lane 이 float 하나씩 건너뛰며 읽습니다. 주소가 256 B 에 퍼져 sector 8개를 건드리고, 각 sector 의 절반만 쓰이므로 효율 50% 입니다.",
  "Lane 마다 32 B 씩 떨어진 주소를 읽습니다. Lane 하나가 sector 하나를 통째로 부르므로 transaction 32개, 1024 B 를 옮겨 128 B 만 쓰는 효율 12.5% 입니다. 이것이 uncoalesced access 입니다.",
] as const;

function laneAddresses(scene: Scene) {
  return Array.from({ length: 32 }, (_, lane) => (scene.offset + lane * scene.stride) * LANE_BYTES);
}

export default function GpuMemoryHierarchyAndRooflineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const state = STATES[scenes.active];
  const addresses = laneAddresses(state);
  const touched = new Set(addresses.map((address) => Math.floor(address / SECTOR_BYTES)));
  const moved = touched.size * SECTOR_BYTES;
  const useful = 32 * LANE_BYTES;
  const efficiency = Math.round((useful / moved) * 1000) / 10;

  return (
    <VizFrame
      eyebrow="Memory transaction · sector"
      title="Warp 의 32 주소는 32-byte sector 단위로만 옮겨집니다"
      description="위 줄은 lane 32개가 요청한 주소, 아래 줄은 1024 B 범위를 32-byte sector 로 나눈 것입니다. 색이 칠해진 sector 하나가 transaction 하나이고, useful byte 128 B 는 네 장면 모두 같습니다."
      note="Float(4 B) 읽기, L1 을 거치지 않는 32 B sector 기준의 단순화입니다. 128 B cache line 단위 allocation 과 L2 hit 은 생략했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Warp 의 접근 pattern 에 따라 32-byte sector transaction 수가 달라지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-5 border border-border p-3">
            <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
              <span>lane 0–31 의 요청 주소 (byte)</span>
              <span>
                stride {state.stride} float · offset {state.offset * LANE_BYTES} B
              </span>
            </div>
            <div className="mt-2 grid grid-cols-8 gap-1 sm:grid-cols-16">
              {addresses.map((address, lane) => (
                <div
                  key={lane}
                  className="flex h-7 items-center justify-center border border-primary/60 bg-primary/10 font-mono text-[10px]"
                  title={`lane ${lane}`}
                >
                  {address}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border border-border p-3">
            <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
              <span>sector 0–31 · 32 B 씩 · 1024 B 범위</span>
              <span>transaction {touched.size}개</span>
            </div>
            <div className="mt-2 grid min-h-[3.5rem] grid-cols-16 gap-1 sm:grid-cols-32">
              {Array.from({ length: SECTORS }).map((_, sector) => {
                const hit = touched.has(sector);
                const usefulInSector = addresses.filter((address) => Math.floor(address / SECTOR_BYTES) === sector).length * LANE_BYTES;
                return (
                  <div
                    key={sector}
                    title={`sector ${sector}: useful ${usefulInSector} B / ${SECTOR_BYTES} B`}
                    className={`relative h-6 border ${hit ? "border-amber-600 bg-amber-500/15" : "border-border bg-muted/30"}`}
                  >
                    {hit && (
                      <span
                        className="absolute inset-x-0 bottom-0 bg-amber-600/60"
                        style={{ height: `${(usefulInSector / SECTOR_BYTES) * 100}%` }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[11px]">
              <div className="border border-border px-2 py-1">
                <p className="text-muted-foreground">옮긴 byte</p>
                <p className="font-bold">{moved} B</p>
              </div>
              <div className="border border-border px-2 py-1">
                <p className="text-muted-foreground">useful byte</p>
                <p className="font-bold">{useful} B</p>
              </div>
              <div className="border border-primary/60 px-2 py-1">
                <p className="text-muted-foreground">효율 useful/옮긴</p>
                <p className="font-bold">{efficiency}%</p>
              </div>
            </div>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
