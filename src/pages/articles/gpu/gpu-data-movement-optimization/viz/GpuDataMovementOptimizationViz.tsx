import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: global → shared → register 세 층 사이를 tile 이 내려오고 되돌아 올라가며,
 * load·compute·store 가 서로 다른 tile 에 대해 같은 시간에 진행되는 overlap 이 생기는 과정.
 * 각 장면은 한 시점의 세 층 상태이고, 마지막 장면은 합과 max 의 시간 비교다.
 * stage 높이는 고정, control row 는 아래 고정 row.
 */
const SCENES = [
  "직렬: tile 0 의 load 동안 계산이 없습니다",
  "tile 0 계산 중에 tile 1 을 load 합니다",
  "load·compute·store 가 세 tile 에 동시에",
  "시간: 합 2.0 µs/tile 대 max 1.2 µs/tile",
] as const;

const NOTES = [
  "Tile 0 이 HBM 에서 shared memory 로 내려오는 1.2 µs 동안 register 는 비어 있고 tensor core 는 놉니다. 이 첫 load 는 어떤 pipeline 도 숨기지 못하는 T_fill 입니다.",
  "Tile 0 이 도착해 register 로 올라가 계산되는 0.8 µs 동안, 다음 stage 로 tile 1 의 load 를 미리 냅니다. 두 이동이 서로 다른 자원을 쓰므로 같은 시간에 진행됩니다.",
  "정상 상태입니다. Tile 2 가 내려오고, tile 1 이 계산되며, tile 0 의 결과가 register 에서 HBM 으로 올라갑니다. 세 층이 모두 바쁘고 tile 당 시간은 가장 긴 load 1.2 µs 에 수렴합니다.",
  "순서대로 하면 tile 당 1.2 + 0.8 = 2.0 µs 이고 겹치면 max(1.2, 0.8) = 1.2 µs 입니다. 100 tile 이면 200 µs 대 121 µs 이며, 남은 병목이 load 이므로 다음 손잡이는 byte 를 줄이는 것입니다.",
] as const;

type Lane = "global" | "shared" | "register";
type Motion = "load" | "compute" | "store" | "idle";

interface TileMark {
  lane: Lane;
  k: number;
  motion: Motion;
}

/** 장면별 세 층의 tile 배치 */
const MARKS: readonly (readonly TileMark[])[] = [
  [{ lane: "global", k: 0, motion: "load" }],
  [
    { lane: "global", k: 1, motion: "load" },
    { lane: "shared", k: 0, motion: "compute" },
    { lane: "register", k: 0, motion: "compute" },
  ],
  [
    { lane: "global", k: 2, motion: "load" },
    { lane: "shared", k: 1, motion: "compute" },
    { lane: "register", k: 1, motion: "compute" },
    { lane: "register", k: 0, motion: "store" },
  ],
  [],
];

const VIEW_W = 520;
const VIEW_H = 250;
const LANE_X = 120;
const LANE_W = VIEW_W - LANE_X - 16;
const LANE_H = 44;
const LANE_Y: Record<Lane, number> = { global: 24, shared: 100, register: 176 };
const LANE_LABEL: Record<Lane, string> = { global: "global (HBM)", shared: "shared memory", register: "register" };
const LANE_NOTE: Record<Lane, string> = { global: "3.35 TB/s", shared: "128 B/clk/SM", register: "명령마다" };

const MOTION_CLASS: Record<Motion, string> = {
  load: "fill-primary/20 stroke-primary/70",
  compute: "fill-primary/60 stroke-primary",
  store: "fill-muted stroke-foreground/60",
  idle: "fill-muted/40 stroke-border",
};

/** tile 번호에 따라 lane 안의 x 위치를 정한다. k 가 클수록 오른쪽. */
function tileX(k: number) {
  return LANE_X + 16 + k * 120;
}

function Lanes() {
  return (
    <g>
      {(Object.keys(LANE_Y) as Lane[]).map((lane) => (
        <g key={lane}>
          <rect x={LANE_X} y={LANE_Y[lane]} width={LANE_W} height={LANE_H} className="fill-muted/30 stroke-border" strokeWidth={1} />
          <text x={LANE_X - 8} y={LANE_Y[lane] + 18} textAnchor="end" className="fill-foreground font-mono text-[11px]">
            {LANE_LABEL[lane]}
          </text>
          <text x={LANE_X - 8} y={LANE_Y[lane] + 34} textAnchor="end" className="fill-muted-foreground font-mono text-[10px]">
            {LANE_NOTE[lane]}
          </text>
        </g>
      ))}
    </g>
  );
}

function Tile({ mark }: { mark: TileMark }) {
  const x = tileX(mark.k) + (mark.motion === "store" ? 0 : 0);
  const y = LANE_Y[mark.lane] + 8;
  const label = mark.motion === "load" ? "load" : mark.motion === "compute" ? (mark.lane === "register" ? "mma" : "read") : "store";
  return (
    <g>
      <rect x={x} y={y} width={88} height={LANE_H - 16} className={MOTION_CLASS[mark.motion]} strokeWidth={1} strokeDasharray={mark.motion === "load" ? "4 3" : undefined} />
      <text x={x + 44} y={y + 18} textAnchor="middle" className={mark.motion === "compute" ? "fill-background font-mono text-[11px]" : "fill-foreground font-mono text-[11px]"}>
        {`tile ${mark.k} · ${label}`}
      </text>
    </g>
  );
}

/** 층 사이의 이동 화살표. down 이면 위 층에서 아래 층으로. */
function Flow({ k, from, to }: { k: number; from: Lane; to: Lane }) {
  const x = tileX(k) + 44;
  const down = LANE_Y[to] > LANE_Y[from];
  const y1 = down ? LANE_Y[from] + LANE_H : LANE_Y[from];
  const y2 = down ? LANE_Y[to] : LANE_Y[to] + LANE_H;
  const tip = down ? y2 - 2 : y2 + 2;
  const base = down ? tip - 8 : tip + 8;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={base} className="stroke-primary" strokeWidth={1.25} />
      <polygon points={`${x - 5},${base} ${x + 5},${base} ${x},${tip}`} className="fill-primary" />
    </g>
  );
}

/** 마지막 장면: 합과 max 의 시간 막대 */
function TimeBars() {
  const scale = 150; // 1 µs 당 px
  const x0 = LANE_X;
  return (
    <g>
      <text x={x0} y={40} className="fill-foreground font-mono text-[11px]">
        serial · tile 당 2.0 µs
      </text>
      <rect x={x0} y={50} width={1.2 * scale} height={22} className="fill-primary/20 stroke-primary/70" strokeWidth={1} />
      <rect x={x0 + 1.2 * scale} y={50} width={0.8 * scale} height={22} className="fill-primary/60 stroke-primary" strokeWidth={1} />
      <text x={x0 + 0.6 * scale} y={65} textAnchor="middle" className="fill-foreground font-mono text-[10px]">
        load 1.2
      </text>
      <text x={x0 + 1.6 * scale} y={65} textAnchor="middle" className="fill-background font-mono text-[10px]">
        compute 0.8
      </text>

      <text x={x0} y={120} className="fill-foreground font-mono text-[11px]">
        overlap · tile 당 max = 1.2 µs
      </text>
      <rect x={x0} y={130} width={1.2 * scale} height={22} className="fill-primary/20 stroke-primary/70" strokeWidth={1} />
      <rect x={x0} y={156} width={0.8 * scale} height={22} className="fill-primary/60 stroke-primary" strokeWidth={1} />
      <text x={x0 + 0.6 * scale} y={145} textAnchor="middle" className="fill-foreground font-mono text-[10px]">
        load 1.2
      </text>
      <text x={x0 + 0.4 * scale} y={171} textAnchor="middle" className="fill-background font-mono text-[10px]">
        compute 0.8
      </text>
      <line x1={x0 + 1.2 * scale} y1={44} x2={x0 + 1.2 * scale} y2={184} className="stroke-border" strokeWidth={1} strokeDasharray="3 3" />
      <text x={x0} y={215} className="fill-muted-foreground font-mono text-[10px]">
        100 tile: 200 µs → 1.2 + 100 × 1.2 ≈ 121 µs
      </text>
    </g>
  );
}

export default function GpuDataMovementOptimizationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const active = scenes.active;
  const marks = MARKS[active];

  return (
    <VizFrame
      eyebrow="Global → shared → register overlap"
      title="세 층이 서로 다른 tile 을 동시에 다루면 시간이 합에서 max 로 줄어듭니다"
      description="세 가로 띠는 global memory, shared memory, register 입니다. 점선 상자는 내려오는 중인 load, 진한 상자는 계산 중, 회색 상자는 되돌아 올라가는 store 이며 화살표가 이동 방향입니다."
      note="Tile 당 load 1.2 µs, compute 0.8 µs 를 가정한 산수이며 측정이 아닙니다. Shared memory 안의 stage 수와 barrier, register 안의 fragment 배치는 그리지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Global, shared, register 세 층 사이를 tile 이 흐르며 load·compute·store 가 겹치는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[26rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[active]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="h-auto w-full max-w-full" role="img" aria-label={SCENES[active]}>
              {active === 3 ? (
                <TimeBars />
              ) : (
                <g>
                  <Lanes />
                  {marks.map((mark) => (
                    <Tile key={`${mark.lane}-${mark.k}-${mark.motion}`} mark={mark} />
                  ))}
                  {marks
                    .filter((mark) => mark.motion === "load")
                    .map((mark) => (
                      <Flow key={`down-${mark.k}`} k={mark.k} from="global" to="shared" />
                    ))}
                  {marks
                    .filter((mark) => mark.motion === "compute" && mark.lane === "shared")
                    .map((mark) => (
                      <Flow key={`read-${mark.k}`} k={mark.k} from="shared" to="register" />
                    ))}
                  {marks
                    .filter((mark) => mark.motion === "store")
                    .map((mark) => (
                      <Flow key={`up-${mark.k}`} k={mark.k} from="register" to="global" />
                    ))}
                  <text x={LANE_X} y={VIEW_H - 8} className="fill-muted-foreground font-mono text-[10px]">
                    {["t = 0 ~ 1.2 µs", "t = 1.2 ~ 2.4 µs", "t = 2.4 ~ 3.6 µs"][active]}
                  </text>
                </g>
              )}
            </svg>
          </div>

          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
