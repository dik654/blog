import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: stage 4개짜리 shared memory ring 을 producer 가 TMA 로 채우고
 * consumer 가 wgmma 로 비우며, full·empty mbarrier 의 phase 가 한 바퀴마다 뒤집히는 과정.
 * 각 장면은 ring 의 한 시점이다. stage 높이는 고정, control row 는 아래 고정 row.
 */
const SCENES = [
  "Producer 가 stage 4개에 TMA 를 냅니다",
  "full[0] 이 뒤집혀 consumer 가 읽습니다",
  "empty[0] 도착 뒤 stage 0 을 다시 채웁니다",
  "정상 상태: producer 가 3 stage 앞섭니다",
] as const;

const NOTES = [
  "Empty barrier 는 초기 상태라 producer 는 멈추지 않고 k=0..3 의 TMA 를 연달아 냅니다. Consumer 는 full[0] 의 phase 0 을 기다리며 아직 계산이 없습니다.",
  "k=0 의 32 KB 가 도착해 full[0] 이 phase 0 으로 뒤집히면 consumer 가 stage 0 에서 wgmma 를 냅니다. Producer 는 빈 stage 가 없어 empty[0] 에서 기다립니다.",
  "Consumer 가 stage 0 을 다 읽고 empty[0] 에 도착하면 producer 가 같은 자리에 k=4 를 넣습니다. Stage 0 의 phase 는 1 로 바뀌고 consumer 는 stage 1 로 넘어갑니다.",
  "이후 producer 는 consumer 보다 늘 3 stage 앞서 갑니다. Load 지연 L 이 3 tile 의 계산 안에 들어오면 consumer 는 full barrier 에서 멈추지 않습니다.",
] as const;

type StageState = "empty" | "loading" | "full" | "reading";

interface Stage {
  k: number | null;
  state: StageState;
  phase: 0 | 1;
}

const RING: readonly (readonly Stage[])[] = [
  [
    { k: 0, state: "loading", phase: 0 },
    { k: 1, state: "loading", phase: 0 },
    { k: 2, state: "loading", phase: 0 },
    { k: 3, state: "loading", phase: 0 },
  ],
  [
    { k: 0, state: "reading", phase: 0 },
    { k: 1, state: "full", phase: 0 },
    { k: 2, state: "loading", phase: 0 },
    { k: 3, state: "loading", phase: 0 },
  ],
  [
    { k: 4, state: "loading", phase: 1 },
    { k: 1, state: "reading", phase: 0 },
    { k: 2, state: "full", phase: 0 },
    { k: 3, state: "full", phase: 0 },
  ],
  [
    { k: 4, state: "full", phase: 1 },
    { k: 5, state: "full", phase: 1 },
    { k: 6, state: "loading", phase: 1 },
    { k: 3, state: "reading", phase: 0 },
  ],
];

/** 장면별 producer·consumer 위치와 상태 문구 */
const POINTERS = [
  { producer: 3, consumer: 0, producerNote: "TMA k=3 발행", consumerNote: "wait full[0]" },
  { producer: 0, consumer: 0, producerNote: "wait empty[0]", consumerNote: "wgmma k=0" },
  { producer: 0, consumer: 1, producerNote: "TMA k=4 발행", consumerNote: "wgmma k=1" },
  { producer: 2, consumer: 3, producerNote: "TMA k=6 발행", consumerNote: "wgmma k=3" },
] as const;

const VIEW_W = 520;
const VIEW_H = 250;
const STAGE_W = 96;
const STAGE_H = 64;
const GAP = 24;
const LEFT = (VIEW_W - (4 * STAGE_W + 3 * GAP)) / 2;
const TOP = 92;

const STATE_CLASS: Record<StageState, string> = {
  empty: "fill-muted/40 stroke-border",
  loading: "fill-primary/15 stroke-primary/60",
  full: "fill-primary/45 stroke-primary",
  reading: "fill-primary/75 stroke-primary",
};

const STATE_LABEL: Record<StageState, string> = {
  empty: "empty",
  loading: "loading",
  full: "full",
  reading: "reading",
};

export default function WarpSpecializationAndAsyncPipelinesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const active = scenes.active;
  const ring = RING[active];
  const pointer = POINTERS[active];

  return (
    <VizFrame
      eyebrow="Multi-stage shared memory pipeline"
      title="Stage ring 을 producer 가 앞서 채우고 consumer 가 뒤따라 비웁니다"
      description="네 칸은 shared memory 의 stage 4개입니다. 위 화살표가 producer 의 다음 발행 위치, 아래 화살표가 consumer 가 읽는 위치이며, 칸 아래 숫자는 그 stage 의 full barrier 가 기다리는 phase 입니다."
      note="Stage 4, tile 32 KB, k-tile 번호만 표시했습니다. 두 consumer warpgroup 을 하나로 합쳤고 empty barrier 의 phase 와 wgmma 의 commit·wait 묶음은 그리지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Shared memory stage ring 이 producer 에 의해 채워지고 consumer 에 의해 소비되는 과정"
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
              {/* producer 행 */}
              <text x={LEFT} y={22} className="fill-foreground font-mono text-[11px]">
                producer (warpgroup 0)
              </text>
              <text x={LEFT + 4 * STAGE_W + 3 * GAP} y={22} textAnchor="end" className="fill-muted-foreground font-mono text-[10px]">
                {pointer.producerNote}
              </text>
              {(() => {
                const cx = LEFT + pointer.producer * (STAGE_W + GAP) + STAGE_W / 2;
                return (
                  <g>
                    <line x1={cx} y1={34} x2={cx} y2={TOP - 12} className="stroke-primary" strokeWidth={1.25} />
                    <polygon points={`${cx - 5},${TOP - 14} ${cx + 5},${TOP - 14} ${cx},${TOP - 5}`} className="fill-primary" />
                  </g>
                );
              })()}

              {/* stage ring */}
              {ring.map((stage, index) => {
                const x = LEFT + index * (STAGE_W + GAP);
                return (
                  <g key={index}>
                    <rect x={x} y={TOP} width={STAGE_W} height={STAGE_H} className={STATE_CLASS[stage.state]} strokeWidth={1} strokeDasharray={stage.state === "loading" ? "4 3" : undefined} />
                    <text x={x + STAGE_W / 2} y={TOP + 26} textAnchor="middle" className={stage.state === "reading" ? "fill-background font-mono text-[12px]" : "fill-foreground font-mono text-[12px]"}>
                      {stage.k === null ? "—" : `k=${stage.k}`}
                    </text>
                    <text x={x + STAGE_W / 2} y={TOP + 46} textAnchor="middle" className={stage.state === "reading" ? "fill-background font-mono text-[10px]" : "fill-muted-foreground font-mono text-[10px]"}>
                      {STATE_LABEL[stage.state]}
                    </text>
                    <text x={x + STAGE_W / 2} y={TOP + STAGE_H + 16} textAnchor="middle" className="fill-muted-foreground font-mono text-[10px]">
                      {`stage ${index} · ph ${stage.phase}`}
                    </text>
                    {index < 3 ? (
                      <line x1={x + STAGE_W + 4} y1={TOP + STAGE_H / 2} x2={x + STAGE_W + GAP - 4} y2={TOP + STAGE_H / 2} className="stroke-border" strokeWidth={1} />
                    ) : null}
                  </g>
                );
              })}
              {/* ring 이 닫히는 되돌림 선 */}
              <path
                d={`M ${LEFT + 4 * STAGE_W + 3 * GAP} ${TOP + STAGE_H + 24} L ${LEFT + 4 * STAGE_W + 3 * GAP} ${TOP + STAGE_H + 34} L ${LEFT} ${TOP + STAGE_H + 34} L ${LEFT} ${TOP + STAGE_H + 24}`}
                className="fill-none stroke-border"
                strokeWidth={1}
              />

              {/* consumer 행 */}
              {(() => {
                const cx = LEFT + pointer.consumer * (STAGE_W + GAP) + STAGE_W / 2;
                const base = TOP + STAGE_H + 44;
                return (
                  <g>
                    <polygon points={`${cx - 5},${base + 9} ${cx + 5},${base + 9} ${cx},${base}`} className="fill-primary" />
                    <line x1={cx} y1={base + 9} x2={cx} y2={base + 30} className="stroke-primary" strokeWidth={1.25} />
                  </g>
                );
              })()}
              <text x={LEFT} y={VIEW_H - 10} className="fill-foreground font-mono text-[11px]">
                consumer (warpgroup 1·2)
              </text>
              <text x={LEFT + 4 * STAGE_W + 3 * GAP} y={VIEW_H - 10} textAnchor="end" className="fill-muted-foreground font-mono text-[10px]">
                {pointer.consumerNote}
              </text>
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
