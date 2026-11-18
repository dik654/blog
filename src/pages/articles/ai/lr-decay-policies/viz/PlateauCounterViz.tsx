import SceneShell from "./SceneShell";

/**
 * 본문 대응: #metric-trigger — q=[m<b−δ], c=(1−q)(c+1), d=[c>p].
 * 값은 모두 가정: 시작 best b=0.90, δ=0.01, p=2, metric 0.850·0.845·0.860·0.848.
 * e1: 0.850<0.890 → 개선, c=0, b=0.850
 * e2: 0.845<0.840? 아니오 → c=1
 * e3: 0.860<0.840? 아니오 → c=2, 2>2 아님
 * e4: 0.848<0.840? 아니오 → c=3>2 → decay
 */
const DELTA = 0.01;
const PATIENCE = 2;
const START_BEST = 0.9;
const METRICS: readonly number[] = [0.85, 0.845, 0.86, 0.848];

interface Step {
  metric: number;
  bound: number;
  improved: boolean;
  count: number;
  bestAfter: number;
  decay: boolean;
}

const STEPS = METRICS.reduce<Step[]>((acc, metric) => {
  const prev = acc.length > 0 ? acc[acc.length - 1] : { bestAfter: START_BEST, count: 0 };
  const bound = prev.bestAfter - DELTA;
  const improved = metric < bound;
  const count = improved ? 0 : prev.count + 1;
  return [...acc, { metric, bound, improved, count, bestAfter: improved ? metric : prev.bestAfter, decay: count > PATIENCE }];
}, []);

const SCENES = [
  {
    label: "e1 · 의미 있는 개선",
    summary: "0.850 < 0.890 → bad-count 0",
    note: "경계는 best 0.90에서 δ=0.01을 뺀 0.89입니다. 0.850은 그보다 작으므로 개선으로 인정하고 best를 0.850으로 바꾸며 bad-count를 0으로 둡니다.",
  },
  {
    label: "e2 · 작은 개선은 세지 않음",
    summary: "0.845 ≥ 0.840 → bad-count 1",
    note: "0.845는 best 0.850보다 조금 낮지만 경계 0.840보다 작지 않습니다. δ보다 작은 차이는 noise로 보고 bad-count를 1 늘립니다.",
  },
  {
    label: "e3 · patience와 같음",
    summary: "bad-count 2 > 2 ? 아니요",
    note: "0.860도 경계를 넘지 못해 bad-count가 2가 됩니다. 식은 c>p일 때만 decay하므로 patience 2와 같은 지금은 아직 LR를 낮추지 않습니다.",
  },
  {
    label: "e4 · decay 발생",
    summary: "bad-count 3 > 2 → decay",
    note: "세 번째 미개선 평가에서 bad-count 3이 patience 2를 넘어 decay가 일어납니다. 그 뒤 cooldown과 min LR 처리는 이 식 밖의 별도 transition입니다.",
  },
] as const;

const W = 360;
const H = 196;
const LEFT = 48;
const RIGHT = 250;
const TOP = 20;
const BASE = 150;
const Y_MIN = 0.83;
const Y_MAX = 0.91;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GREEN = "#16a34a";
const TEXT = "#64748b";
const AXIS = "#94a3b8";

const x = (index: number) => LEFT + 24 + index * ((RIGHT - LEFT - 48) / (METRICS.length - 1));
const y = (value: number) => BASE - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * (BASE - TOP);

export default function PlateauCounterViz() {
  return (
    <SceneShell
      eyebrow="평가 event마다 판정"
      title="Bad-count가 patience를 넘는 순간에만 LR를 낮춥니다"
      description="점은 평가 event e마다 받은 validation metric입니다(작을수록 좋은 min-mode). 점선은 지금까지의 best b에서 δ를 뺀 경계 b−δ로, 개선으로 인정받으려면 metric이 이보다 작아야 합니다. 값은 모두 가정이며 δ=0.01, patience p=2, 시작 best 0.90으로 둡니다."
      ariaLabel="평가마다 metric과 개선 경계를 비교해 bad-count를 세고 patience를 넘으면 decay하는 과정"
      scenes={SCENES}
      render={(active) => {
        const shown = STEPS.slice(0, active + 1);
        const current = STEPS[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0.84, 0.86, 0.88, 0.9].map((value) => (
              <g key={value}>
                <line x1={LEFT} x2={RIGHT} y1={y(value)} y2={y(value)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={LEFT - 6} y={y(value) + 4} textAnchor="end" fontSize={11} fill={TEXT}>
                  {value.toFixed(2)}
                </text>
              </g>
            ))}
            <line x1={LEFT} x2={RIGHT} y1={BASE} y2={BASE} stroke={AXIS} strokeWidth={1} />
            {METRICS.map((_, index) => (
              <text key={index} x={x(index)} y={BASE + 17} textAnchor="middle" fontSize={11} fill={index === active ? BLUE : TEXT} fontWeight={index === active ? 700 : 400}>
                e{index + 1}
              </text>
            ))}
            {shown.map((step, index) => (
              <g key={index}>
                <line x1={x(index) - 14} x2={x(index) + 14} y1={y(step.bound)} y2={y(step.bound)} stroke={AMBER} strokeWidth={1.25} strokeDasharray="3 2" opacity={index === active ? 1 : 0.4} />
                <circle cx={x(index)} cy={y(step.metric)} r={4} fill={step.improved ? GREEN : RED} opacity={index === active ? 1 : 0.45} />
              </g>
            ))}
            <text x={x(active)} y={y(current.metric) + (current.metric < current.bound ? 18 : -9)} textAnchor="middle" fontSize={11} fontWeight={700} fill={current.improved ? GREEN : RED}>
              {current.metric.toFixed(3)}
            </text>
            <text x={LEFT} y={BASE + 36} fontSize={11} fill={AMBER}>
              점선 = 경계 b−δ ({current.bound.toFixed(3)})
            </text>

            <g>
              <text x={300} y={TOP + 8} textAnchor="middle" fontSize={11} fill={TEXT}>
                bad-count c
              </text>
              {[1, 2, 3].map((slot) => (
                <rect
                  key={slot}
                  x={282}
                  y={TOP + 16 + (3 - slot) * 26}
                  width={36}
                  height={22}
                  rx={4}
                  fill={current.count >= slot ? (slot > PATIENCE ? RED : AMBER) : "none"}
                  stroke={slot > PATIENCE ? RED : AXIS}
                  strokeWidth={1}
                  strokeDasharray={slot > PATIENCE ? "3 2" : undefined}
                />
              ))}
              <text x={300} y={TOP + 112} textAnchor="middle" fontSize={11} fontWeight={700} fill={current.decay ? RED : BLUE}>
                c = {current.count}
              </text>
              <text x={300} y={TOP + 128} textAnchor="middle" fontSize={11} fill={TEXT}>
                p = {PATIENCE}
              </text>
              <rect x={266} y={TOP + 140} width={68} height={24} rx={4} fill={current.decay ? RED : "none"} stroke={current.decay ? RED : AXIS} strokeWidth={1} />
              <text x={300} y={TOP + 156} textAnchor="middle" fontSize={11} fontWeight={700} fill={current.decay ? "#ffffff" : TEXT}>
                {current.decay ? "LR decay" : "유지"}
              </text>
            </g>
            <text x={LEFT} y={TOP - 6} fontSize={11} fill={BLUE}>
              이번 비교의 best b = {(active === 0 ? START_BEST : STEPS[active - 1].bestAfter).toFixed(3)}
            </text>
          </svg>
        );
      }}
    />
  );
}
