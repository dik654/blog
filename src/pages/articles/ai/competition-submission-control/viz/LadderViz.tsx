import SceneShell from "./SceneShell";

/**
 * 본문 대응: #paper-submission-control — Ladder의 공개값 갱신 규칙.
 * 손실 = 1 − 정확도(본문 가정): A 0.74 → 0.26, B 0.76 → 0.24. 공개 간격 η = 0.01.
 * B: 0.24 < 0.26 − 0.01 = 0.25 → 0.24 공개. B 재전송: 0.24 < 0.24 − 0.01 = 0.23 아님 → 0.24 유지.
 */
const ETA = 0.01;

const SCENES = [
  { label: "A의 손실 0.26", summary: "공개값 0.26", loss: 0.26, prev: null, published: 0.26, note: "정확도 0.74를 손실로 바꾸면 1 − 0.74 = 0.26입니다. 이 값을 다음 비교의 직전 공개값으로 둡니다(가정)." },
  { label: "B의 손실 0.24", summary: "0.24 < 0.25 → 0.24 공개", loss: 0.24, prev: 0.26, published: 0.24, note: "문턱은 직전 공개값에서 η를 뺀 0.26 − 0.01 = 0.25입니다. B의 0.24가 문턱보다 작으므로 평가자는 새 값 0.24를 공개합니다." },
  { label: "같은 B를 다시", summary: "0.24 ≥ 0.23 → 0.24 유지", loss: 0.24, prev: 0.24, published: 0.24, note: "이번 문턱은 0.24 − 0.01 = 0.23입니다. 손실 0.24가 문턱보다 작지 않으므로 새 숫자를 내지 않고 이전 공개값 0.24를 다시 내놓습니다." },
] as const;

const W = 360;
const H = 150;
const LEFT = 24;
const RIGHT = W - 24;
const AXIS_Y = 86;
const MIN = 0.22;
const MAX = 0.27;
const x = (value: number) => LEFT + ((value - MIN) / (MAX - MIN)) * (RIGHT - LEFT);
const TICKS: readonly number[] = [0.22, 0.23, 0.24, 0.25, 0.26, 0.27];

export default function LadderViz() {
  return (
    <SceneShell
      eyebrow="공개값을 갱신하는 문턱"
      title="새 손실이 문턱 아래로 내려가야 공개 숫자가 바뀝니다"
      description="가로축은 손실(1 − 정확도, 작을수록 좋음)입니다. 문턱은 직전 공개값에서 공개 간격 η = 0.01을 뺀 자리입니다. 정확도를 점수로 본 것은 본문의 가정입니다."
      ariaLabel="Ladder 규칙에서 A, B, B 재전송의 손실과 문턱, 공개값 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const threshold = scene.prev === null ? null : Math.round((scene.prev - ETA) * 100) / 100;
        const updates = threshold !== null && scene.loss < threshold;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {TICKS.map((tick) => (
              <g key={tick}>
                <line x1={x(tick)} x2={x(tick)} y1={AXIS_Y - 4} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(tick)} y={AXIS_Y + 18} textAnchor="middle" fontSize={11} fill="#64748b">{tick.toFixed(2)}</text>
              </g>
            ))}
            <text x={LEFT} y={H - 8} fontSize={11} fill="#64748b">← 손실이 작음(좋음)</text>
            {threshold !== null && (
              <g>
                <rect x={LEFT} y={AXIS_Y - 40} width={x(threshold) - LEFT} height={40} fill="#16a34a" opacity={0.08} />
                <line x1={x(threshold)} x2={x(threshold)} y1={AXIS_Y - 46} y2={AXIS_Y} stroke="#16a34a" strokeWidth={1} strokeDasharray="3 3" />
                <text x={x(threshold) - 4} y={AXIS_Y - 50} textAnchor="end" fontSize={11} fill="#15803d">문턱 {threshold.toFixed(2)}</text>
                <text x={x(threshold) + 4} y={AXIS_Y - 50} fontSize={11} fill="#64748b">= {(threshold + ETA).toFixed(2)} − η</text>
              </g>
            )}
            <rect x={x(scene.published) - 4} y={AXIS_Y - 4} width={8} height={8} fill="#2563eb" />
            <text x={x(scene.published)} y={AXIS_Y + 34} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">공개 {scene.published.toFixed(2)}</text>
            <circle cx={x(scene.loss)} cy={AXIS_Y - 20} r={5} fill="none" stroke="#d97706" strokeWidth={1.25} />
            <text x={x(scene.loss)} y={AXIS_Y - 28} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">새 손실 {scene.loss.toFixed(2)}</text>
            <text x={RIGHT} y={18} textAnchor="end" fontSize={11} fontWeight={700} fill={threshold === null ? "#475569" : updates ? "#15803d" : "#475569"}>
              {threshold === null ? "직전 공개값으로 둠(가정)" : updates ? "문턱 아래 → 새 값 공개" : "문턱 아래 아님 → 이전 값 유지"}
            </text>
          </svg>
        );
      }}
    />
  );
}
