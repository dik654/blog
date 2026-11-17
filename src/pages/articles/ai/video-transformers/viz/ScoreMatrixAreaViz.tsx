import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { attentionPairLedger } from "../calculations";

/**
 * 본문 대응: #attention-cost — C_joint=(TS)², C_div=TS²+ST², T=8, S=196.
 * Score matrix의 행=query, 열=key를 t0의 196개, t1의 196개 … 순서로 펼치면(그림을 위한 정렬, 가정)
 * 큰 칸 하나가 196×196 블록이고 8×8=64개 블록이 생긴다.
 * temporal stage = 64개 블록 각각의 대각선 196칸 → 64×196 = 196×8² = 12,544
 * spatial stage = 대각선 블록 8개 → 8×196² = 307,328 (전체의 1/8)
 */
const T = 8;
const S = 196;
const PAIRS = attentionPairLedger({ temporalPositions: T, spatialPositions: S });

const SCENES = [
  {
    label: "Joint: 표 전체",
    summary: "1,568² = 2,458,624",
    note: "Score matrix는 query token(행)과 key token(열)의 모든 조합을 칸으로 펼친 표입니다. 칸 하나가 attention pair 하나입니다. 행과 열을 t0의 공간 196개, t1의 196개 … 순서로 놓으면 큰 칸 하나가 196×196 블록이고, joint attention은 64개 블록을 모두 채웁니다.",
  },
  {
    label: "Temporal stage: 블록마다 대각선 한 줄",
    summary: "196 × 8² = 12,544",
    note: "Divided block은 먼저 같은 공간 위치의 시간 token끼리 비교합니다. 공간 번호가 같은 칸은 64개 블록마다 대각선 한 줄(196칸)에 놓이므로 64×196=12,544칸입니다. 선은 보이도록 굵게 그렸고 실제 폭은 블록의 1/196입니다.",
  },
  {
    label: "Spatial stage: 대각선 블록 8개",
    summary: "8 × 196² = 307,328",
    note: "다음으로 같은 시간의 공간 token끼리 비교합니다. 시간 번호가 같은 칸은 대각선의 196×196 블록 8개뿐이므로 64개 블록 중 8개, 전체 표의 1/8입니다.",
  },
  {
    label: "Divided 합계와 비어 있는 칸",
    summary: "307,328 + 12,544 = 319,872",
    note: "두 stage를 따로 세어 더하면 319,872 pair로 joint의 약 13.0%입니다. 대각선 블록 위의 선(8×196=1,568칸, 자기 자신과의 pair)은 두 stage에서 한 번씩 계산되므로 합에 두 번 들어갑니다. 시간도 공간도 다른 칸은 어느 stage에서도 직접 score를 계산하지 않습니다. 정보는 두 단계를 거쳐 전달될 수 있지만 한 번에 비교한 것은 아니며, 이 수는 실제 latency가 아닌 pair proxy입니다.",
  },
] as const;

const BLOCK = 25;
const ORIGIN_X = 40;
const ORIGIN_Y = 28;
const SIDE = BLOCK * T;
const W = ORIGIN_X + SIDE + 12;
const H = ORIGIN_Y + SIDE + 8;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRID = "#94a3b8";
const TEXT = "#64748b";

const BLOCK_INDEX = Array.from({ length: T }, (_, index) => index);

function MatrixPicture({ active }: { active: number }) {
  const showTemporal = active === 1 || active === 3;
  const showSpatial = active === 2 || active === 3;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[320px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <text x={ORIGIN_X + SIDE / 2} y={10} textAnchor="middle" fontSize={10} fill={TEXT}>열 = key token</text>
      <text x={10} y={ORIGIN_Y + SIDE / 2} textAnchor="middle" fontSize={10} fill={TEXT} transform={`rotate(-90 10 ${ORIGIN_Y + SIDE / 2})`}>행 = query token</text>
      {BLOCK_INDEX.map((index) => (
        <g key={`label-${index}`}>
          <text x={ORIGIN_X + index * BLOCK + BLOCK / 2} y={ORIGIN_Y - 5} textAnchor="middle" fontSize={8} fill={TEXT}>t{index}</text>
          <text x={ORIGIN_X - 4} y={ORIGIN_Y + index * BLOCK + BLOCK / 2 + 3} textAnchor="end" fontSize={8} fill={TEXT}>t{index}</text>
        </g>
      ))}

      {BLOCK_INDEX.map((row) =>
        BLOCK_INDEX.map((column) => {
          const x = ORIGIN_X + column * BLOCK;
          const y = ORIGIN_Y + row * BLOCK;
          const jointFill = active === 0;
          const spatialFill = showSpatial && row === column;
          return (
            <g key={`${row}-${column}`}>
              <rect
                x={x}
                y={y}
                width={BLOCK}
                height={BLOCK}
                fill={jointFill || spatialFill ? BLUE : "none"}
                fillOpacity={jointFill ? 0.35 : 0.45}
                stroke={GRID}
                strokeWidth={0.75}
              />
              {showTemporal && <line x1={x} y1={y} x2={x + BLOCK} y2={y + BLOCK} stroke={AMBER} strokeWidth={1.25} />}
            </g>
          );
        }),
      )}
      <rect x={ORIGIN_X} y={ORIGIN_Y} width={SIDE} height={SIDE} fill="none" stroke={GRID} strokeWidth={1} />
    </svg>
  );
}

const ROWS = [
  { key: "joint", label: "Joint", value: PAIRS.jointPairs, color: BLUE, scenes: [0, 3] },
  { key: "temporal", label: "Temporal", value: PAIRS.temporalPairs, color: AMBER, scenes: [1, 3] },
  { key: "spatial", label: "Spatial", value: PAIRS.spatialPairs, color: BLUE, scenes: [2, 3] },
  { key: "divided", label: "Divided 합", value: PAIRS.dividedPairs, color: "#475569", scenes: [3] },
] as const;

function percent(value: number) {
  const share = (value / PAIRS.jointPairs) * 100;
  return share < 1 ? `${share.toFixed(2)}%` : `${share.toFixed(1)}%`;
}

function PairBars({ active }: { active: number }) {
  return (
    <div className="mt-4 space-y-2">
      {ROWS.map((row) => {
        const lit = (row.scenes as readonly number[]).includes(active);
        const width = Math.max((row.value / PAIRS.jointPairs) * 100, 0.6);
        return (
          <div key={row.key} className={`grid grid-cols-[5.5rem_minmax(0,1fr)_5rem] items-center gap-2 text-xs ${lit ? "" : "opacity-40"}`}>
            <span className={lit ? "font-bold" : "text-muted-foreground"}>{row.label}</span>
            <div className="h-3 min-w-0 rounded-sm bg-muted/40">
              <div className="h-full rounded-sm" style={{ width: `${width}%`, backgroundColor: row.color }} />
            </div>
            <span className="text-right font-mono">
              {row.value.toLocaleString("en-US")}
              <span className="block text-[10px] text-muted-foreground">{percent(row.value)}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function ScoreMatrixAreaViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const labels = SCENES.map((scene) => scene.label);

  return (
    <VizFrame
      documentFlow
      eyebrow="Score matrix 면적 · T=8, S=196"
      title="Joint는 표 전체, divided는 대각선 줄과 대각선 블록만 채웁니다"
      description="정사각형 한 장이 1,568×1,568 score matrix(행=query, 열=key)이고, 작은 칸 하나는 196×196 블록입니다. 행과 열을 시간 위치 순서로 펼친 것은 그림을 위한 정렬입니다(가정). 아래 막대는 joint를 100%로 둔 pair 수입니다."
      note="숫자는 본문의 pair proxy 공식을 그대로 계산한 값이며 실제 FLOPs·메모리·latency가 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Joint와 divided attention의 score matrix 면적 비교 네 단계"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <div className="mt-4 min-w-0">
          <MatrixPicture active={scenes.active} />
          <PairBars active={scenes.active} />
        </div>
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
