import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 같은 KV pool 160칸(32 token block)에 같은 요청을 넣을 때, 언제 몇 칸을 떼어 두느냐에 따라
 * 동시에 들어가는 요청 수가 달라지는 것을 센다.
 * 요청: 프롬프트 200 + max_new_tokens 1,000, 실제로는 300 token에서 끝남 (가정).
 */
const POOL = 160;
const COLS = 16;
const RESERVE = 38; // ceil((200 + 1000) / 32)
const FINAL = 16; // ceil((200 + 300) / 32)
const COLORS = ["#2563eb", "#0d9488", "#d97706", "#7c3aed", "#db2777", "#0891b2", "#65a30d", "#ea580c", "#4f46e5", "#be123c", "#6b7280"];

const SCENES = ["끝까지 예약", "끝난 시점", "한 step씩 예약", "넘치면 내보냄"] as const;

interface Cell {
  owner: number | null;
  kind: "used" | "reserved" | "free" | "recompute";
}

function buildCells(scene: number): Cell[] {
  const cells: Cell[] = Array.from({ length: POOL }, () => ({ owner: null, kind: "free" }));
  if (scene <= 1) {
    for (let r = 0; r < 4; r += 1) {
      for (let i = 0; i < RESERVE; i += 1) {
        const used = scene === 0 ? i < 7 : i < FINAL;
        cells[r * RESERVE + i] = { owner: r, kind: used ? "used" : "reserved" };
      }
    }
    return cells;
  }
  if (scene === 2) {
    for (let r = 0; r < 10; r += 1) {
      for (let i = 0; i < FINAL; i += 1) cells[r * FINAL + i] = { owner: r, kind: "used" };
    }
    return cells;
  }
  for (let r = 0; r < 10; r += 1) {
    for (let i = 0; i < FINAL; i += 1) {
      cells[r * FINAL + i] = r === 9 ? { owner: 10, kind: "recompute" } : { owner: r, kind: "used" };
    }
  }
  return cells;
}

const STATS = [
  { admitted: "4개", used: "28칸", idle: "124칸" },
  { admitted: "4개", used: "64칸", idle: "88칸" },
  { admitted: "10개", used: "160칸", idle: "0칸" },
  { admitted: "9개, 대기 1", used: "144칸", idle: "0칸" },
] as const;

const NOTES = [
  "요청마다 ⌈(200+1,000)÷32⌉ = 38칸을 받을 때 떼어 둡니다. 4개면 152칸이고 남은 8칸으로는 다섯째 요청의 38칸을 채우지 못합니다. 지금 실제로 쓴 칸은 프롬프트 7칸씩입니다.",
  "모두 300 token에서 끝나면 요청 하나가 쓴 칸은 ⌈500÷32⌉ = 16칸입니다. 4개가 64칸만 쓰고, 예약했지만 끝까지 비어 있던 칸이 88칸입니다.",
  "다음 step에 필요한 칸만 받으면 끝난 시점의 16칸 기준으로 10개가 들어갑니다. 대신 누가 끝까지 갈지 모르는 채로 받았습니다.",
  "10개가 160칸을 다 채운 뒤 한 요청이 17번째 칸을 원하면 가장 늦게 시작한 요청을 내보냅니다. 빨간 점선 16칸이 반납되고, 내보낸 요청은 만든 token까지 프롬프트로 붙여 나중에 다시 계산합니다.",
] as const;

export default function ReservationPoolViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = scenes.active;
  const cells = buildCells(scene);
  const stat = STATS[scene];

  return (
    <VizFrame
      eyebrow="KV block reservation"
      title="언제 칸을 떼어 두느냐가 동시에 들어가는 요청 수를 정합니다"
      description="한 칸은 32 token block이고 pool은 160칸입니다. 진한 칸은 실제로 쓴 칸, 점선 칸은 예약만 한 칸입니다."
      note="요청 길이와 pool 크기는 설명용 가정입니다. 프롬프트 공유와 chunked prefill은 넣지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="KV block 예약 방식별 pool 사용"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <h4 className="text-base font-bold">{SCENES[scene]}</h4>

          <svg viewBox="0 0 480 200" className="mt-3 w-full sm:max-h-[14rem]" role="img" aria-label={`${stat.admitted} 요청, 실제 사용 ${stat.used}`}>
            {cells.map((cell, index) => {
              const col = index % COLS;
              const row = Math.floor(index / COLS);
              const x = col * 30 + 1;
              const y = row * 20 + 1;
              const color = cell.owner === null ? "#9ca3af" : COLORS[cell.owner];
              if (cell.kind === "free") {
                return <rect key={index} x={x} y={y} width={28} height={18} rx={2} fill="none" stroke="#9ca3af" strokeOpacity={0.5} strokeWidth={1} />;
              }
              if (cell.kind === "reserved") {
                return (
                  <rect key={index} x={x} y={y} width={28} height={18} rx={2} fill={color} fillOpacity={0.08} stroke={color} strokeWidth={1} strokeDasharray="3 2" />
                );
              }
              if (cell.kind === "recompute") {
                return (
                  <rect key={index} x={x} y={y} width={28} height={18} rx={2} fill="none" stroke="#be123c" strokeWidth={1.25} strokeDasharray="2 2" />
                );
              }
              return <rect key={index} x={x} y={y} width={28} height={18} rx={2} fill={color} fillOpacity={0.75} />;
            })}
          </svg>

          <dl className="mt-3 grid grid-cols-3 gap-x-4 gap-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">받은 요청</dt>
              <dd className="font-bold text-foreground">{stat.admitted}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">실제로 쓴 칸</dt>
              <dd className="font-bold text-foreground">{stat.used}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">예약만 한 칸</dt>
              <dd className="font-bold text-foreground">{stat.idle}</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[5.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
