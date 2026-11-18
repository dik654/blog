import SceneShell from "./SceneShell";

/**
 * 본문 대응: reconstruction-anomaly-detection #failure — 정상 100건·확인된 이상 20건 fixture에서
 * 점수 분포가 겹치면 τ를 어디에 두든 잘못된 경보와 놓침을 맞바꾼다. 점 배치는 설명용 가정(측정값 아님).
 * 정상 기본: τ=칸9 → 잘못된 경보 23 · 놓침 1, τ=칸12 → 4 · 6.
 * Decoder가 너무 강함(이상 3칸 왼쪽): τ=칸12 → 4 · 15. 정상 계절 패턴 누락(8건 이동): τ=칸12 → 12 · 6.
 */
const NORMAL_BASE: readonly number[] = [0, 1, 3, 6, 10, 14, 16, 15, 12, 9, 6, 4, 2, 1, 1, 0, 0, 0, 0, 0];
const NORMAL_SEASON: readonly number[] = [0, 1, 3, 6, 10, 14, 8, 15, 12, 9, 6, 4, 2, 1, 1, 0, 0, 0, 0, 0];
const SEASON_MOVED: readonly number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 2, 0, 0, 0, 0];
const ANOMALY_BASE: readonly number[] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 2, 1, 1, 1, 0];
const ANOMALY_STRONG: readonly number[] = [0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 2, 1, 1, 1, 0, 0, 0, 0];
const ZERO: readonly number[] = NORMAL_BASE.map(() => 0);
const BINS = NORMAL_BASE.length;

type Case = { normal: readonly number[]; moved: readonly number[]; anomaly: readonly number[]; tau: number };
const CASES: readonly Case[] = [
  { normal: NORMAL_BASE, moved: ZERO, anomaly: ANOMALY_BASE, tau: 9 },
  { normal: NORMAL_BASE, moved: ZERO, anomaly: ANOMALY_BASE, tau: 12 },
  { normal: NORMAL_BASE, moved: ZERO, anomaly: ANOMALY_STRONG, tau: 12 },
  { normal: NORMAL_SEASON, moved: SEASON_MOVED, anomaly: ANOMALY_BASE, tau: 12 },
];
const sumFrom = (values: readonly number[], start: number, end: number) =>
  values.slice(start, end).reduce<number>((sum, v) => sum + v, 0);
const falseAlarms = (c: Case) => sumFrom(c.normal, c.tau, BINS) + sumFrom(c.moved, c.tau, BINS);
const misses = (c: Case) => sumFrom(c.anomaly, 0, c.tau);
const summary = (c: Case) => `잘못된 경보 ${falseAlarms(c)} · 놓친 이상 ${misses(c)}`;

const SCENES = [
  {
    label: "τ를 낮게 두면",
    summary: summary(CASES[0]),
    note: `점수가 겹치는 구간이 있으면 τ를 낮출수록 이상은 거의 다 잡히지만 정상 ${falseAlarms(CASES[0])}건이 경보가 됩니다.`,
  },
  {
    label: "τ를 높게 두면",
    summary: summary(CASES[1]),
    note: `τ를 올리면 잘못된 경보는 ${falseAlarms(CASES[1])}건으로 줄지만 이상 ${misses(CASES[1])}건을 놓칩니다. 그래서 τ는 training loss가 아니라 검증 자료와 경보 비용·놓침 비용을 비교해 고르는 운영 값입니다.`,
  },
  {
    label: "Decoder가 너무 강하면",
    summary: summary(CASES[2]),
    note: `Decoder가 이상 sample까지 잘 복원하면 이상의 점수가 정상 쪽으로 내려옵니다. 같은 τ에서 놓친 이상이 ${misses(CASES[1])}건에서 ${misses(CASES[2])}건으로 늘어납니다.`,
  },
  {
    label: "정상 양상이 빠지면",
    summary: summary(CASES[3]),
    note: `학습에 없던 정상 계절 패턴(속 빈 점)이 큰 점수를 받아, 같은 τ에서 잘못된 경보가 ${falseAlarms(CASES[1])}건에서 ${falseAlarms(CASES[3])}건으로 늘어납니다. 이때는 τ를 옮기기보다 정상 coverage를 먼저 고칩니다.`,
  },
] as const;

const W = 340;
const H = 168;
const LEFT = 10;
const RIGHT = W - 10;
const BIN_W = (RIGHT - LEFT) / BINS;
const AXIS_Y = 104;
const STEP = 7;
const R = 3;

const NORMAL = "#64748b";
const ANOMALY = "#dc2626";
const TAU_COLOR = "#2563eb";
const AXIS = "#94a3b8";

/** 칸 하나에 두 줄로 점을 쌓는다. dir=-1이면 축 위, 1이면 축 아래. */
function stackDots(counts: readonly number[], offsets: readonly number[], dir: number) {
  return counts.flatMap((count, bin) =>
    Array.from({ length: count }, (_, k) => {
      const slot = offsets[bin] + k;
      const cx = LEFT + bin * BIN_W + BIN_W / 2 + (slot % 2 === 0 ? -3.8 : 3.8);
      const cy = AXIS_Y + dir * (6 + Math.floor(slot / 2) * STEP);
      return { key: `${bin}-${slot}`, cx, cy, bin };
    }),
  );
}

export default function ThresholdOverlapViz() {
  return (
    <SceneShell
      eyebrow="겹침과 판정값"
      title="점수가 겹치면 τ는 잘못된 경보와 놓침을 맞바꿉니다"
      description="점 하나가 검증 sample 하나입니다. 축 위 회색은 정상 100건, 축 아래 빨강은 원인이 확인된 이상 20건이며, 오른쪽일수록 복원 점수가 큽니다. τ 오른쪽 회색 점이 잘못된 경보, τ 왼쪽 빨간 점이 놓친 이상입니다. 점 배치는 절차를 보이려는 가정이며 측정 결과가 아닙니다."
      ariaLabel="정상과 이상 sample의 복원 점수 분포와 판정값 위치에 따른 잘못된 경보와 놓친 이상 수"
      scenes={SCENES}
      render={(active) => {
        const c = CASES[active];
        const tauX = LEFT + c.tau * BIN_W;
        const normalDots = stackDots(c.normal, ZERO, -1);
        const movedDots = stackDots(c.moved, c.normal, -1);
        const anomalyDots = stackDots(c.anomaly, ZERO, 1);
        return (
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <rect x={tauX} y={8} width={RIGHT - tauX} height={AXIS_Y + 36} fill="#2563eb" opacity={0.06} />
              {normalDots.map((d) => (
                <circle key={`n${d.key}`} cx={d.cx} cy={d.cy} r={R} fill={NORMAL} opacity={d.bin >= c.tau ? 1 : 0.55} />
              ))}
              {movedDots.map((d) => (
                <circle key={`m${d.key}`} cx={d.cx} cy={d.cy} r={R} fill="none" stroke={NORMAL} strokeWidth={1.25} />
              ))}
              {anomalyDots.map((d) => (
                <circle key={`a${d.key}`} cx={d.cx} cy={d.cy} r={R} fill={ANOMALY} opacity={d.bin < c.tau ? 1 : 0.55} />
              ))}
              <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke={AXIS} strokeWidth={1} />
              <line x1={tauX} x2={tauX} y1={8} y2={AXIS_Y + 44} stroke={TAU_COLOR} strokeWidth={1.25} />
              <text x={tauX + 5} y={20} fontSize={12} fontWeight={700} fill={TAU_COLOR}>τ · 오른쪽 = 경보</text>
              <text x={LEFT} y={H - 6} fontSize={11} fill={NORMAL}>복원 점수 낮음</text>
              <text x={RIGHT} y={H - 6} textAnchor="end" fontSize={11} fill={NORMAL}>높음 →</text>
            </svg>
        );
      }}
    />
  );
}
