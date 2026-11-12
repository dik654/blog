import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #why-scale — 같은 네 값(0.47, −1.3, 3.1, 12.0)을 FP8 비율 1, INT8 비율 1, INT8 비율 4.0÷127에 넣는다.
 * 가로축은 크기 0–13을 그대로(선형) 그려 칸 간격이 값을 따라 넓어지는지(FP8), 고정인지(INT8)를 눈으로 비교한다.
 * 숫자 검산: 4.0÷127 = 0.031496. 0.47÷s = 14.92 → 15 → 0.4724, 1.3÷s = 41.28 → 41 → 1.2913,
 * 3.1÷s = 98.43 → 98 → 3.0866, 12.0÷s = 381 → 127에서 멈춤 → 4.0.
 */
const W = 360;
const L = 18;
const R = W - 18;
const MAX = 13;
const px = (v: number) => L + (v / MAX) * (R - L);

/** E4M3 양수 칸 중 0–13: 정규 2^e(1+m/8), e = −6…3, 그리고 2^−6보다 작은 고정 간격 칸 m/8·2^−6. */
const FP8_TICKS: readonly number[] = [
  ...Array.from({ length: 7 }, (_, m) => ((m + 1) / 8) * 2 ** -6),
  ...Array.from({ length: 10 }, (_, i) => i - 6).flatMap((e) => Array.from({ length: 8 }, (_, m) => 2 ** e * (1 + m / 8))),
].filter((v) => v <= MAX);

const STEP = 4 / 127;
const INT1_TICKS: readonly number[] = Array.from({ length: MAX + 1 }, (_, i) => i);
const INT_FINE_TICKS: readonly number[] = Array.from({ length: 128 }, (_, i) => i * STEP);

interface Row {
  raw: string;
  mag: number;
  cell: string;
  back: string;
  backMag: number;
  err: string;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  ticks: readonly number[];
  wall: number | null;
  rows: readonly Row[];
}

const SCENES: readonly Scene[] = [
  {
    label: "FP8, 비율 1",
    summary: "칸 간격이 값을 따라 커짐",
    note: "0 가까이에는 칸이 촘촘하고 8과 13 사이는 1 간격입니다. 작은 값은 작은 간격, 큰 값은 큰 간격에 맞춰지므로 네 값 모두 상대 오차가 몇 % 안에 머뭅니다.",
    ticks: FP8_TICKS,
    wall: null,
    rows: [
      { raw: "0.47", mag: 0.47, cell: "0.46875", back: "0.46875", backMag: 0.46875, err: "0.3%" },
      { raw: "−1.3", mag: 1.3, cell: "−1.25", back: "−1.25", backMag: 1.25, err: "3.8%" },
      { raw: "3.1", mag: 3.1, cell: "3.0", back: "3.0", backMag: 3, err: "3.2%" },
      { raw: "12.0", mag: 12, cell: "12", back: "12", backMag: 12, err: "0%" },
    ],
  },
  {
    label: "INT8, 비율 1",
    summary: "칸 간격이 1로 고정",
    note: "정수 칸은 −127부터 127까지 1 간격이라 값의 크기와 상관없이 같은 간격을 씁니다. 0.47은 0으로, −1.3은 −1로 떨어져 작은 값일수록 상대 오차가 커집니다.",
    ticks: INT1_TICKS,
    wall: null,
    rows: [
      { raw: "0.47", mag: 0.47, cell: "0", back: "0", backMag: 0, err: "100%" },
      { raw: "−1.3", mag: 1.3, cell: "−1", back: "−1", backMag: 1, err: "23%" },
      { raw: "3.1", mag: 3.1, cell: "3", back: "3", backMag: 3, err: "3.2%" },
      { raw: "12.0", mag: 12, cell: "12", back: "12", backMag: 12, err: "0%" },
    ],
  },
  {
    label: "INT8, 비율 4.0 ÷ 127",
    summary: "간격 0.031, 4.0에서 벽",
    note: "비율을 4.0÷127로 잡으면 칸 간격이 0.031로 줄어 작은 세 값은 1% 안으로 맞습니다. 대신 칸 127개가 4.0에서 끝나므로 12.0은 127에 걸려 4.0으로 돌아옵니다. 정수에서는 비율이 칸 간격과 끝을 함께 정합니다.",
    ticks: INT_FINE_TICKS,
    wall: 4,
    rows: [
      { raw: "0.47", mag: 0.47, cell: "15", back: "0.472", backMag: 0.4724, err: "0.5%" },
      { raw: "−1.3", mag: 1.3, cell: "−41", back: "−1.291", backMag: 1.2913, err: "0.7%" },
      { raw: "3.1", mag: 3.1, cell: "98", back: "3.087", backMag: 3.0866, err: "0.4%" },
      { raw: "12.0", mag: 12, cell: "127", back: "4.0", backMag: 4, err: "67%" },
    ],
  },
];

const UP = 30;
const AXIS = 82;
const BLUE = "#2563eb";
const RED = "#dc2626";
const TICK = "#64748b";

function Picture({ scene }: { scene: Scene }) {
  return (
    <svg viewBox={`0 0 ${W} 124`} className="h-auto max-h-[11rem] w-full" role="img" aria-label={`${scene.label}: 네 값이 가까운 칸으로 옮겨지는 모습`}>
      {scene.wall !== null ? <rect x={px(scene.wall)} y={14} width={R - px(scene.wall)} height={AXIS - 6} fill={RED} fillOpacity={0.06} /> : null}
      <line x1={L} x2={R} y1={AXIS} y2={AXIS} stroke="#94a3b8" strokeWidth={1} />
      {scene.ticks.map((v) => (
        <line key={v} x1={px(v)} x2={px(v)} y1={AXIS - 6} y2={AXIS + 6} stroke={TICK} strokeWidth={0.6} />
      ))}
      {scene.wall !== null ? (
        <g>
          <line x1={px(scene.wall)} x2={px(scene.wall)} y1={14} y2={AXIS + 10} stroke={RED} strokeWidth={1.25} />
          <text x={px(scene.wall) + 4} y={22} fontSize={10} fontWeight={700} fill={RED}>
            127 × s = 4.0
          </text>
        </g>
      ) : null}
      {[0, 2, 4, 6, 8, 10, 12].map((v) => (
        <text key={v} x={px(v)} y={AXIS + 20} textAnchor="middle" fontSize={10} className="fill-muted-foreground">
          {v}
        </text>
      ))}
      <text x={R} y={AXIS + 36} textAnchor="end" fontSize={11} className="fill-muted-foreground">
        값의 크기(부호 제외)
      </text>
      {scene.rows.map((row) => {
        const clipped = Math.abs(row.backMag - row.mag) > 1;
        const color = clipped ? RED : BLUE;
        return (
          <g key={row.raw}>
            <line x1={px(row.mag)} y1={UP + 4} x2={px(row.backMag)} y2={AXIS - 4} stroke={color} strokeWidth={1} strokeDasharray={clipped ? "3 2" : undefined} />
            <circle cx={px(row.mag)} cy={UP} r={4} fill="none" stroke={color} strokeWidth={1.25} />
            <circle cx={px(row.backMag)} cy={AXIS} r={3.5} fill={color} />
          </g>
        );
      })}
      <text x={px(0.47)} y={UP - 9} textAnchor="middle" fontSize={11} className="fill-foreground">
        0.47
      </text>
      <text x={px(1.3) + 4} y={UP - 9} textAnchor="start" fontSize={11} className="fill-foreground">
        −1.3
      </text>
      <text x={px(3.1)} y={UP - 9} textAnchor="middle" fontSize={11} className="fill-foreground">
        3.1
      </text>
      <text x={px(12)} y={UP - 9} textAnchor="middle" fontSize={11} className="fill-foreground">
        12.0
      </text>
    </svg>
  );
}

function Table({ scene }: { scene: Scene }) {
  return (
    <table className="w-full text-left font-mono text-[11px] sm:text-xs">
      <thead className="text-muted-foreground">
        <tr>
          <th className="py-1 pr-2 font-normal">원래</th>
          <th className="py-1 pr-2 font-normal">저장된 칸</th>
          <th className="py-1 pr-2 font-normal">읽은 값</th>
          <th className="py-1 font-normal">상대 오차</th>
        </tr>
      </thead>
      <tbody>
        {scene.rows.map((row) => {
          const clipped = Math.abs(row.backMag - row.mag) > 1;
          return (
            <tr key={row.raw} className="border-t border-border">
              <td className="py-1 pr-2 font-bold">{row.raw}</td>
              <td className="py-1 pr-2">{row.cell}</td>
              <td className="py-1 pr-2">{row.back}</td>
              <td className={`py-1 ${clipped || row.err === "100%" ? "font-bold text-[#dc2626]" : ""}`}>{row.err}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function IntVsFp8GridViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  const labels = SCENES.map((s) => s.label);
  return (
    <VizFrame
      eyebrow="FP8 vs INT8"
      title="FP8 칸은 값을 따라 넓어지고, INT8 칸은 비율이 간격을 정합니다"
      description="4절의 key 네 값을 비율 없이(1) 또는 비율을 주고 넣었을 때의 모습입니다. 가로축은 값의 크기를 0부터 13까지 균등하게 그렸고, 회색 눈금 하나하나가 그 형식이 담을 수 있는 수입니다. 빈 원은 원래 값, 찬 원은 저장 후 읽은 값입니다."
      note="−1.3은 크기 1.3 자리에 그리고 부호는 표에만 둡니다. FP8의 0 근처와 INT8 4.0÷127의 눈금은 너무 촘촘해 띠처럼 보입니다. 상대 오차는 |원래 − 읽은 값| ÷ |원래|를 반올림했습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="FP8과 INT8에 같은 네 값을 넣었을 때 칸 간격 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((s) => (
            <div key={s.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{s.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{s.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-3"
          scenes={SCENES.map((s) => (
            <div key={s.label} className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
              <Picture scene={s} />
              <Table scene={s} />
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((s) => (
            <p key={s.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {s.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((s) => s.note)} />
      </div>
    </VizFrame>
  );
}
