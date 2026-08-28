import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 Viz 에 한 mechanism: GPU block pool 위에서 admission → decode 성장 → memory pressure →
 * recompute 또는 swap preemption → 재개 조건이 어떻게 이어지는지.
 * viewBox 는 고정, stage 높이는 모든 장면에서 같다. gradient·glow·shadow·굵은 선 없음.
 */
const SCENES = ["요청 도착", "Admission 판정", "Decode 성장", "Memory pressure", "Recompute 선택", "Swap 선택"] as const;

const NOTES = [
  "GPU pool 40 block 가운데 A와 B가 26개를 쓰고 있습니다. 오른쪽 끝 3 block은 watermark 예약분이라 새 요청이 쓸 수 없습니다.",
  "C의 prefill에 9 block이 필요합니다. free 14에서 9를 빼면 5가 남고 watermark 3 이상이므로 OK로 받아들입니다.",
  "세 요청이 decode를 진행하며 16 token마다 block을 하나씩 더 가져갑니다. 실행 중 요청의 성장에는 watermark 조건이 없어 free가 1까지 내려갑니다.",
  "다음 step에 세 요청이 각각 block 하나를 요구하는데 free는 1개뿐입니다. 가장 늦게 들어온 C가 victim이고 그 block 10개를 전부 내보냅니다.",
  "Recompute는 C의 block을 pool에 즉시 돌려주고 C를 WAITING 앞에 둡니다. 재개 때 prompt와 생성분을 한 번의 prefill로 다시 계산합니다.",
  "Swap은 C의 block 10개를 CPU swap으로 복사해 둡니다. free − 10 ≥ 3이 되는 step에 다시 GPU로 복사하는 swap-in으로 재개합니다.",
] as const;

type Owner = "A" | "B" | "C" | null;

interface RequestRow {
  id: "A" | "B" | "C";
  state: string;
  blocks: number;
  victim?: boolean;
}

interface Scene {
  gpu: readonly [number, number, number];
  cpuC: number;
  rows: readonly RequestRow[];
  decision: string;
}

const POOL = 40;
const WATERMARK = 3;

const SCENE_DATA: readonly Scene[] = [
  { gpu: [14, 12, 0], cpuC: 0, rows: [{ id: "A", state: "RUNNING", blocks: 14 }, { id: "B", state: "RUNNING", blocks: 12 }, { id: "C", state: "WAITING · need 9", blocks: 0 }], decision: "free 14 · watermark 3" },
  { gpu: [14, 12, 9], cpuC: 0, rows: [{ id: "A", state: "RUNNING", blocks: 14 }, { id: "B", state: "RUNNING", blocks: 12 }, { id: "C", state: "RUNNING", blocks: 9 }], decision: "14 − 9 = 5 ≥ 3 → OK" },
  { gpu: [16, 13, 10], cpuC: 0, rows: [{ id: "A", state: "RUNNING", blocks: 16 }, { id: "B", state: "RUNNING", blocks: 13 }, { id: "C", state: "RUNNING", blocks: 10 }], decision: "decode +1 block each · free 1" },
  { gpu: [16, 13, 10], cpuC: 0, rows: [{ id: "A", state: "RUNNING · need 1", blocks: 16 }, { id: "B", state: "RUNNING · need 1", blocks: 13 }, { id: "C", state: "RUNNING · need 1", blocks: 10, victim: true }], decision: "need 3 > free 1 → victim C" },
  { gpu: [17, 14, 0], cpuC: 0, rows: [{ id: "A", state: "RUNNING", blocks: 17 }, { id: "B", state: "RUNNING", blocks: 14 }, { id: "C", state: "PREEMPTED → WAITING · computed 0", blocks: 0 }], decision: "C 10 block 반환 · free 9" },
  { gpu: [17, 14, 0], cpuC: 10, rows: [{ id: "A", state: "RUNNING", blocks: 17 }, { id: "B", state: "RUNNING", blocks: 14 }, { id: "C", state: "SWAPPED · CPU 10 block", blocks: 0 }], decision: "swap-in when free − 10 ≥ 3" },
];

function ownerCells(scene: Scene): Owner[] {
  const cells: Owner[] = [];
  const [a, b, c] = scene.gpu;
  for (let i = 0; i < a; i += 1) cells.push("A");
  for (let i = 0; i < b; i += 1) cells.push("B");
  for (let i = 0; i < c; i += 1) cells.push("C");
  while (cells.length < POOL) cells.push(null);
  return cells;
}

function cellClass(owner: Owner): string {
  if (owner === "A") return "fill-primary";
  if (owner === "B") return "fill-primary/45";
  if (owner === "C") return "fill-amber-500/70";
  return "fill-muted";
}

const CELL = 14;
const GAP = 1;
const POOL_X = 20;

export default function ServingMemoryAdmissionAndPreemptionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const scene = SCENE_DATA[scenes.active];
  const cells = ownerCells(scene);
  const free = POOL - scene.gpu[0] - scene.gpu[1] - scene.gpu[2];
  return (
    <VizFrame
      eyebrow="Memory admission · preemption"
      title="새 요청은 watermark 위에서만 받고, pressure가 오면 마지막 요청의 block을 전부 내보냅니다"
      description="한 장면은 scheduler step 하나의 상태입니다. 위 줄은 GPU KV pool 40 block의 소유자, 가운데는 요청별 상태와 block 수, 아래는 CPU swap입니다."
      note="Block 수와 watermark 3은 설명용으로 줄인 값입니다. 실제 pool은 수만 block이고 watermark는 비율(예: 1%)로 정합니다. Victim 선택 규칙은 engine마다 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="KV memory admission과 preemption의 상태 전이"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scheduler step · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>
          <div className="mt-4 w-full overflow-x-auto">
            <svg viewBox="0 0 640 240" className="h-auto w-full min-w-[32rem]" role="img" aria-hidden="true">
              <text x={POOL_X} y={14} className="fill-muted-foreground text-[9px]">GPU KV pool · {POOL} block · free {free}</text>
              {cells.map((owner, index) => {
                const reserved = index >= POOL - WATERMARK;
                const x = POOL_X + index * (CELL + GAP);
                if (reserved && owner === null) {
                  return (
                    <rect key={index} x={x} y={20} width={CELL} height={20} className="fill-transparent stroke-muted-foreground/70" strokeWidth={1} strokeDasharray="2 2" />
                  );
                }
                return (
                  <rect key={index} x={x} y={20} width={CELL} height={20} className={`${cellClass(owner)} stroke-border`} strokeWidth={1} />
                );
              })}
              <text x={POOL_X + (POOL - WATERMARK) * (CELL + GAP)} y={52} className="fill-muted-foreground text-[8px]">watermark {WATERMARK}</text>

              {scene.rows.map((row, index) => {
                const y = 76 + index * 30;
                const width = row.blocks * (CELL + GAP);
                return (
                  <g key={row.id}>
                    <text x={POOL_X} y={y + 13} className="fill-foreground text-[11px] font-bold">{row.id}</text>
                    <text x={POOL_X + 20} y={y + 13} className="fill-muted-foreground text-[9px]">{row.state}</text>
                    <rect x={300} y={y} width={POOL * (CELL + GAP) * 0.5} height={18} className="fill-transparent stroke-border" strokeWidth={1} />
                    {row.blocks > 0 && (
                      <rect
                        x={300}
                        y={y}
                        width={width * 0.5}
                        height={18}
                        className={`${cellClass(row.id)} ${row.victim ? "stroke-amber-600" : "stroke-border"}`}
                        strokeWidth={row.victim ? 1.25 : 1}
                      />
                    )}
                    <text x={610} y={y + 13} className="fill-foreground text-[9px] font-bold">{row.blocks} blk</text>
                  </g>
                );
              })}

              <text x={POOL_X} y={180} className="fill-muted-foreground text-[9px]">CPU swap</text>
              {Array.from({ length: 20 }, (_, index) => (
                <rect
                  key={index}
                  x={POOL_X + 60 + index * (CELL + GAP)}
                  y={170}
                  width={CELL}
                  height={14}
                  className={`${index < scene.cpuC ? "fill-amber-500/70" : "fill-muted"} stroke-border`}
                  strokeWidth={1}
                />
              ))}

              <rect x={POOL_X} y={204} width={600} height={24} className="fill-transparent stroke-primary/60" strokeWidth={1} />
              <text x={POOL_X + 8} y={220} className="fill-foreground text-[10px] font-bold">{scene.decision}</text>
            </svg>
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
