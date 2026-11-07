import SceneShell from "./SceneShell";

/**
 * 본문 대응: #unit-circle 마지막 문단 — 각도 수직선과 원 위의 점.
 * −π/2 → (0,−1), π/2 → (0,1), 5π/2 → (0,1). 5π/2와 π/2의 차이는 2π(같은 점), 5π/2와 −π/2의 차이는 3π(다른 점).
 */
const TICKS = [
  { q: -1, text: "−π/2" },
  { q: 0, text: "0" },
  { q: 1, text: "π/2" },
  { q: 2, text: "π" },
  { q: 3, text: "3π/2" },
  { q: 4, text: "2π" },
  { q: 5, text: "5π/2" },
] as const;

const SCENES = [
  { label: "π/2", summary: "(0,1)", marks: [1], point: [0, 1], pair: null, note: "수직선 위 π/2는 양의 가로축에서 반시계로 1/4바퀴 돈 각도입니다. 원 위에서는 맨 위 점 (0,1)입니다." },
  { label: "5π/2", summary: "(0,1) · 차이 2π", marks: [1, 5], point: [0, 1], pair: "2π", note: "한 바퀴를 더 돌았습니다. 수직선에서는 다른 자리지만 원 위의 점은 같습니다. 방향이 같은 각도끼리는 2π의 정수배만큼 차이 납니다." },
  { label: "−π/2", summary: "(0,−1) · 5π/2와 차이 3π", marks: [-1, 5], point: [0, -1], pair: "3π", note: "음의 각도는 시계 방향입니다. 5π/2와의 차이가 3π로 2π의 정수배가 아니라서 원 위의 다른 점 (0,−1)입니다. 빈 점이 5π/2의 자리입니다." },
  { label: "점만 보면", summary: "몇 바퀴인지 알 수 없음", marks: [1, 5], point: [0, 1], pair: "?", note: "원 위의 (0,1)만 받으면 π/2에서 왔는지 5π/2에서 왔는지 복원할 수 없습니다. 누적 회전이 필요하면 따로 세어 두어야 합니다." },
] as const;

const LX = (q: number) => 34 + (q + 1) * 48;
const LY = 34;

export default function WindingLineViz() {
  return (
    <SceneShell
      eyebrow="각도와 현재 점"
      title="수직선의 다른 자리가 원에서는 같은 점이 됩니다"
      description="위 수직선은 지금까지 돈 각도이고, 아래 원은 길이 1인 원 위의 현재 위치입니다."
      ariaLabel="누적 각도 수직선과 단위원 위의 현재 점"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const marks: readonly number[] = scene.marks;
        const cx = 180;
        const cy = 140;
        const r = 62;
        const [left, right] = [Math.min(...marks), Math.max(...marks)];
        return (
          <svg viewBox="0 0 360 222" className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={14} x2={346} y1={LY} y2={LY} stroke="#94a3b8" strokeWidth={1} />
            {TICKS.map((tick) => {
              const on = marks.includes(tick.q);
              return (
                <g key={tick.q}>
                  <line x1={LX(tick.q)} x2={LX(tick.q)} y1={LY - 4} y2={LY + 4} stroke="#94a3b8" strokeWidth={1} />
                  {on && <circle cx={LX(tick.q)} cy={LY} r={5} fill="#2563eb" />}
                  <text x={LX(tick.q)} y={LY + 20} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 400} fill={on ? "#2563eb" : "#64748b"}>{tick.text}</text>
                </g>
              );
            })}
            {scene.pair && (
              <g>
                <path d={`M${LX(left)} ${LY - 8}V${LY - 18}H${LX(right)}V${LY - 8}`} fill="none" stroke="#d97706" strokeWidth={1} />
                <text x={(LX(left) + LX(right)) / 2} y={LY - 22} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">{scene.pair === "?" ? "어느 쪽인지 모름" : `차이 ${scene.pair}`}</text>
              </g>
            )}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.7} />
            <line x1={cx - r - 10} x2={cx + r + 10} y1={cy} y2={cy} stroke="#94a3b8" strokeWidth={1} />
            <line x1={cx} x2={cx} y1={cy - r - 8} y2={cy + r + 8} stroke="#94a3b8" strokeWidth={1} />
            {active === 2 && (
              <g>
                <circle cx={cx} cy={cy - r} r={4.5} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
                <text x={cx + 12} y={cy - r - 2} fontSize={12} fill="#64748b">5π/2의 자리 (0,1)</text>
              </g>
            )}
            <line x1={cx} x2={cx + scene.point[0] * r} y1={cy} y2={cy - scene.point[1] * r} stroke="#2563eb" strokeWidth={1.25} />
            <circle cx={cx + scene.point[0] * r} cy={cy - scene.point[1] * r} r={5} fill="#2563eb" />
            <text x={cx + 12} y={cy - scene.point[1] * r + (scene.point[1] > 0 ? -2 : 14)} fontSize={13} fontWeight={700} fill="#2563eb">({scene.point[0]},{scene.point[1] < 0 ? "−1" : "1"})</text>
          </svg>
        );
      }}
    />
  );
}
