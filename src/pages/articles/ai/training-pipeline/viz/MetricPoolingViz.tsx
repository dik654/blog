import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #logging의 "Batch metric의 평균이 dataset metric과 같지는 않습니다".
 * batch 1: 64개 중 32개 맞음(0.5), batch 2: 5개 중 5개 맞음(1.0).
 * 단순 평균 (0.5+1.0)/2 = 0.75, 합산 (32+5)/(64+5) = 37/69 ≈ 0.536.
 * 칸 하나 = sample 하나.
 */
const BIG_N = 64;
const BIG_CORRECT = 32;
const SMALL_N = 5;
const SMALL_CORRECT = 5;
const NAIVE = (BIG_CORRECT / BIG_N + SMALL_CORRECT / SMALL_N) / 2;
const POOLED = (BIG_CORRECT + SMALL_CORRECT) / (BIG_N + SMALL_N);
const BIG_SHARE = BIG_N / (BIG_N + SMALL_N);
const SMALL_SHARE = SMALL_N / (BIG_N + SMALL_N);

const SCENES = [
  {
    label: "batch 두 개의 accuracy",
    summary: "0.5 · 1.0",
    note: "크기 64인 batch는 32개를 맞혀 accuracy 0.5, 마지막 크기 5인 batch는 5개를 모두 맞혀 1.0입니다. 칸 하나가 sample 하나입니다.",
  },
  {
    label: "batch accuracy를 단순 평균",
    summary: "(0.5 + 1.0) ÷ 2 = 0.75",
    note: "두 batch에 같은 weight ½이 실립니다. sample 5개짜리 batch가 64개짜리 batch와 같은 힘으로 평균을 끌어당깁니다.",
  },
  {
    label: "분자와 분모를 따로 누적",
    summary: "(32 + 5) ÷ (64 + 5) ≈ 0.536",
    note: "맞힌 수 32+5=37과 sample 수 64+5=69를 먼저 더하고 마지막에 한 번만 나눕니다. 이제 sample 하나하나가 같은 weight를 받습니다. Distributed run이라면 이 두 값을 먼저 all-reduce한 뒤 나눕니다.",
  },
] as const;

const W = 360;
const H = 138;
const CELL = 11;
const PITCH = 13;
const COLS = 16;
const BIG_X = 14;
const SMALL_X = 262;
const GRID_Y = 30;
const BIG_CELLS = Array.from({ length: BIG_N }, (_, index) => index);
const SMALL_CELLS = Array.from({ length: SMALL_N }, (_, index) => index);
const BLUE = "#2563eb";
const GRAY = "#94a3b8";

function Figure({ sceneIndex }: { sceneIndex: number }) {
  const pooled = sceneIndex === 2;
  const naive = sceneIndex === 1;
  const weights = pooled
    ? [`sample 비중 64/69 ≈ ${BIG_SHARE.toFixed(2)}`, `5/69 ≈ ${SMALL_SHARE.toFixed(2)}`]
    : naive
      ? ["batch weight ½", "weight ½"]
      : ["", ""];
  return (
    <div className="min-w-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={SCENES[sceneIndex].summary}>
        <text x={BIG_X} y={18} fontSize={13} fontWeight={700} fill="#64748b">batch 1 · 64개</text>
        <text x={SMALL_X} y={18} fontSize={13} fontWeight={700} fill="#64748b">batch 2 · 5개</text>
        {BIG_CELLS.map((index) => (
          <rect
            key={`big-${index}`}
            x={BIG_X + (index % COLS) * PITCH}
            y={GRID_Y + Math.floor(index / COLS) * PITCH}
            width={CELL}
            height={CELL}
            rx={2}
            fill={index < BIG_CORRECT ? BLUE : "none"}
            stroke={index < BIG_CORRECT ? BLUE : GRAY}
            strokeWidth={1}
          />
        ))}
        {SMALL_CELLS.map((index) => (
          <rect
            key={`small-${index}`}
            x={SMALL_X + index * PITCH}
            y={GRID_Y}
            width={CELL}
            height={CELL}
            rx={2}
            fill={index < SMALL_CORRECT ? BLUE : "none"}
            stroke={BLUE}
            strokeWidth={1}
          />
        ))}
        {pooled && (
          <rect x={BIG_X - 6} y={GRID_Y - 6} width={SMALL_X + SMALL_N * PITCH - BIG_X + 10} height={4 * PITCH + 10} rx={6} fill="none" stroke="#7c3aed" strokeWidth={1.25} strokeDasharray="4 3" />
        )}
        <text x={BIG_X} y={GRID_Y + 4 * PITCH + 22} fontSize={13} fill="#64748b">맞음 32 / 64 = 0.5</text>
        <text x={SMALL_X} y={GRID_Y + 4 * PITCH + 22} fontSize={13} fill="#64748b">5 / 5 = 1.0</text>
        <text x={BIG_X} y={GRID_Y + 4 * PITCH + 40} fontSize={12} fontWeight={700} fill={pooled ? "#7c3aed" : "#64748b"}>{weights[0]}</text>
        <text x={SMALL_X} y={GRID_Y + 4 * PITCH + 40} fontSize={12} fontWeight={700} fill={pooled ? "#7c3aed" : "#64748b"}>{weights[1]}</text>
      </svg>
      <div className="mt-3 rounded-lg border border-border px-3 py-3">
        <div className="relative h-12">
          <div className="absolute inset-x-0 top-[22px] h-px bg-[#94a3b8]" />
          <span className="absolute left-0 top-[28px] font-mono text-[10px] text-muted-foreground">0</span>
          <span className="absolute right-0 top-[28px] font-mono text-[10px] text-muted-foreground">1</span>
          <span
            className={`absolute top-[18px] h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-[#64748b] ${sceneIndex >= 1 ? "" : "invisible"}`}
            style={{ left: `${NAIVE * 100}%` }}
          />
          <span
            className={`absolute top-0 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] font-bold text-[#64748b] ${sceneIndex >= 1 ? "" : "invisible"}`}
            style={{ left: `${NAIVE * 100}%` }}
          >
            단순 평균 {NAIVE.toFixed(2)}
          </span>
          <span
            className={`absolute top-[18px] h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-[#7c3aed] ${pooled ? "" : "invisible"}`}
            style={{ left: `${POOLED * 100}%` }}
          />
          <span
            className={`absolute top-[30px] -translate-x-1/2 whitespace-nowrap font-mono text-[11px] font-bold text-[#7c3aed] ${pooled ? "" : "invisible"}`}
            style={{ left: `${POOLED * 100}%` }}
          >
            합산 {POOLED.toFixed(3)}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {pooled ? "전체 accuracy 37 / 69 ≈ 0.536 · 단순 평균 0.75와 다름" : naive ? "두 batch 값을 그대로 평균한 0.75" : "아직 두 batch를 합치지 않았습니다"}
        </p>
      </div>
    </div>
  );
}

export default function MetricPoolingViz() {
  return (
    <SceneShell
      eyebrow="Metric 집계"
      title="Batch마다 나눈 뒤 평균하면 작은 batch가 과하게 실립니다"
      description="본문의 예를 그대로 씁니다. 칸 하나가 sample 하나이고 채운 칸이 맞힌 sample입니다."
      ariaLabel="64개 batch와 5개 batch의 accuracy를 단순 평균한 값과 분자 분모를 합산한 값 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene, index) => <Figure key={scene.label} sceneIndex={index} />)}
        />
      )}
    />
  );
}
