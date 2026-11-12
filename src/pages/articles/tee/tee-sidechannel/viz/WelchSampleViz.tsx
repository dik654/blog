import SceneShell from "./SceneShell";

/**
 * 본문 대응: #spectre-cache ExplainedFormula의 interpretation —
 * "평균 차이가 작아도 표본이 많고 분산이 작으면 재현 가능한 신호일 수 있습니다."
 * 평균 차이 2 cycle, 표준편차 20·10 cycle, 표본 수는 모두 가정이다. n0=n1=n, s0=s1=s.
 * 분모 = sqrt(s²/n + s²/n): n=100,s=20 → 2.83, t=0.71 / n=1600 → 0.71, t=2.83
 * n=10000 → 0.28, t=7.07 / s=10,n=1600 → 0.35, t=5.66
 */
const DIFF = 2;

const CASES: readonly { n: number; s: number }[] = [
  { n: 100, s: 20 },
  { n: 1600, s: 20 },
  { n: 10000, s: 20 },
  { n: 1600, s: 10 },
];

const se = (n: number, s: number) => Math.sqrt((s * s) / n + (s * s) / n);
const fmt = (value: number) => value.toFixed(2);

const SCENES = CASES.map((item, index) => {
  const noise = se(item.n, item.s);
  const t = DIFF / noise;
  const notes = [
    "두 분포는 거의 겹칩니다. 평균 차이 2가 분모 2.83보다 작아 t는 0.71이고, 띠 안에 0이 들어 있어 noise와 구별하기 어렵습니다.",
    "평균 차이는 그대로 2입니다. class마다 1,600번씩 재면 분모가 0.71로 줄어 t가 2.83이 됩니다. 원래 분포는 그대로 겹쳐 있습니다.",
    "10,000번씩 재면 분모가 0.28로 줄어 t는 7.07입니다. 같은 2 cycle 차이가 재현 가능한 신호로 드러날 수 있습니다.",
    "s=10이면 1,600번만으로 분모 0.35, t 5.66입니다. 임계값은 corpus에서 정하고 별도 holdout에서 확인합니다. 큰 |t|는 누출 후보이지 복구 증명이 아닙니다.",
  ];
  return {
    label: `n=${item.n.toLocaleString("en-US")} · s=${item.s}`,
    summary: `|t| = 2 ÷ ${fmt(noise)} = ${fmt(t)}`,
    note: notes[index],
    noise,
  };
});

const W = 360;
const H = 236;
const LEFT = 16;
const RIGHT = W - 16;
const SLATE = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";
const LINE = "#94a3b8";
const MUTED = "#64748b";

// 위 패널: 원래 timing 분포. 가로축 -60..62 cycle(class 0 평균을 0으로 둠).
const RAW_MIN = -60;
const RAW_MAX = 62;
const RAW_BASE = 96;
const RAW_PEAK = 58;
const rx = (value: number) => LEFT + ((value - RAW_MIN) / (RAW_MAX - RAW_MIN)) * (RIGHT - LEFT);

function curve(mean: number, s: number) {
  const points = Array.from({ length: 61 }, (_, index) => {
    const x = RAW_MIN + (index / 60) * (RAW_MAX - RAW_MIN);
    const height = Math.exp(-((x - mean) ** 2) / (2 * s * s)) * RAW_PEAK * (10 / s);
    return `${rx(x).toFixed(1)},${(RAW_BASE - Math.min(height, RAW_PEAK)).toFixed(1)}`;
  });
  return `M${points.join(" L")}`;
}

// 아래 패널: 평균 차이 축 -4..8 cycle.
const D_MIN = -4;
const D_MAX = 8;
const D_Y = 186;
const dx = (value: number) => LEFT + ((value - D_MIN) / (D_MAX - D_MIN)) * (RIGHT - LEFT);
const TICKS = [-4, -2, 0, 2, 4, 6, 8] as const;

export default function WelchSampleViz() {
  return (
    <SceneShell
      eyebrow="Welch t · 반복 측정"
      title="같은 2 cycle 차이도 몇 번 쟀는지에 따라 신호가 됩니다"
      description="n은 class마다 잰 횟수, s는 표준편차입니다. |t|는 평균 차이 2 cycle을 분모 √(s²/n + s²/n), 즉 평균 차이의 측정 noise로 나눈 값입니다. 위는 두 secret class의 timing 분포, 아래는 평균 차이(점)와 분모 폭(띠)입니다. 2 cycle과 n·s는 모두 가정입니다."
      ariaLabel="표본 수와 분산에 따라 Welch t의 분모가 줄어드는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const item = CASES[active];
        const noise = SCENES[active].noise;
        const lo = Math.max(D_MIN, DIFF - noise);
        const hi = Math.min(D_MAX, DIFF + noise);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT} y={14} fontSize={12} fill={MUTED}>timing 분포 (표준편차 {item.s} cycle)</text>
            <path d={curve(0, item.s)} fill="none" stroke={SLATE} strokeWidth={1.25} />
            <path d={curve(DIFF, item.s)} fill="none" stroke={BLUE} strokeWidth={1.25} strokeDasharray="4 3" />
            <line x1={LEFT} x2={RIGHT} y1={RAW_BASE} y2={RAW_BASE} stroke={LINE} strokeWidth={1} />
            <line x1={LEFT} x2={LEFT + 16} y1={112} y2={112} stroke={SLATE} strokeWidth={1.25} />
            <text x={LEFT + 20} y={116} fontSize={11} fill={MUTED}>class 0</text>
            <line x1={LEFT + 74} x2={LEFT + 90} y1={112} y2={112} stroke={BLUE} strokeWidth={1.25} strokeDasharray="4 3" />
            <text x={LEFT + 94} y={116} fontSize={11} fill={MUTED}>class 1 (평균 +2)</text>

            <text x={LEFT} y={144} fontSize={12} fill={MUTED}>평균 차이(class 1 − class 0)와 분모 폭 ±{fmt(noise)} (cycle)</text>
            <rect x={dx(lo)} y={D_Y - 9} width={dx(hi) - dx(lo)} height={18} rx={3} fill={AMBER} opacity={0.25} stroke={AMBER} strokeWidth={1} />
            <line x1={dx(0)} x2={dx(0)} y1={D_Y - 18} y2={D_Y + 14} stroke={SLATE} strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={dx(DIFF)} cy={D_Y} r={4} fill={BLUE} />
            <line x1={LEFT} x2={RIGHT} y1={D_Y + 14} y2={D_Y + 14} stroke={LINE} strokeWidth={1} />
            {TICKS.map((tick) => (
              <text key={tick} x={dx(tick)} y={D_Y + 28} textAnchor="middle" fontSize={11} fill={tick === 0 ? "#1e293b" : MUTED} fontWeight={tick === 0 ? 700 : 400}>{tick}</text>
            ))}
            <text x={RIGHT} y={160} textAnchor="end" fontSize={13} fontWeight={700} fill={BLUE}>|t| = {fmt(DIFF / noise)}</text>
          </svg>
        );
      }}
    />
  );
}
