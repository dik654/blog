import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gradient-direction — 기울기 (4,3), 길이 5.
 * 단위 방향 u의 변화율 4u₁+3u₂는 기울기 끝에서 u의 선으로 내린 수선의 발까지 거리입니다.
 * (3/5,4/5) → 4.8, (4/5,3/5) → 5, (−4/5,−3/5) → −5, (3/5,−4/5) → 12/5−12/5 = 0(가정 방향).
 */
interface Scene {
  label: string;
  summary: string;
  ux: number;
  uy: number;
  rate: number;
  note: string;
  rateAt: readonly [number, number];
}

const SCENES: readonly Scene[] = [
  {
    label: "앞의 방향 (3/5, 4/5)",
    summary: "4×3/5 + 3×4/5 = 4.8",
    ux: 0.6,
    uy: 0.8,
    rate: 4.8,
    rateAt: [2.05, 4.45],
    note: "기울기 끝에서 방향선으로 수직선을 내립니다. 원점에서 그 발까지 거리가 곧 내적이고 변화율입니다. 방향이 기울기와 조금 어긋나 있어 4.8입니다.",
  },
  {
    label: "기울기와 나란한 (4/5, 3/5)",
    summary: "4×4/5 + 3×3/5 = 5",
    ux: 0.8,
    uy: 0.6,
    rate: 5,
    rateAt: [4.75, 2.2],
    note: "방향을 기울기에 맞추면 수직선의 발이 기울기 끝과 겹칩니다. 그래서 변화율이 기울기 길이 √(4²+3²) = 5가 됩니다.",
  },
  {
    label: "반대 방향 (−4/5, −3/5)",
    summary: "4×(−4/5) + 3×(−3/5) = −5",
    ux: -0.8,
    uy: -0.6,
    rate: -5,
    rateAt: [4.75, 2.2],
    note: "발은 같은 자리에 있지만 방향 u의 반대쪽입니다. 변화율은 −5이고 같은 길이의 방향 중 함숫값을 1차로 가장 빠르게 줄입니다.",
  },
  {
    label: "직각인 방향 (3/5, −4/5) (가정)",
    summary: "4×3/5 + 3×(−4/5) = 0",
    ux: 0.6,
    uy: -0.8,
    rate: 0,
    rateAt: [-1.7, 0.8],
    note: "본문에 없는 방향을 계산으로 하나 더해 보았습니다. 기울기와 직각이면 발이 원점에 놓여 1차 변화율이 0입니다. 어느 방향을 골라도 발은 반지름 5인 원을 벗어나지 않습니다.",
  },
];

const X0 = 160;
const Y0 = 150;
const UNIT = 24;
const sx = (x: number) => X0 + UNIT * x;
const sy = (y: number) => Y0 - UNIT * y;

function Arrow({ x, y, color }: { x: number; y: number; color: string }) {
  const len = Math.hypot(x, y);
  const dx = x / len;
  const dy = y / len;
  const size = 0.3;
  const left = [x - size * dx - 0.5 * size * dy, y - size * dy + 0.5 * size * dx];
  const right = [x - size * dx + 0.5 * size * dy, y - size * dy - 0.5 * size * dx];
  return (
    <g>
      <path d={`M${sx(0)} ${sy(0)}L${sx(x)} ${sy(y)}`} fill="none" stroke={color} strokeWidth="1.25" />
      <path d={`M${sx(left[0])} ${sy(left[1])}L${sx(x)} ${sy(y)}L${sx(right[0])} ${sy(right[1])}`} fill="none" stroke={color} strokeWidth="1.25" />
    </g>
  );
}

function Drawing({ scene }: { scene: Scene }) {
  const footX = scene.rate * scene.ux;
  const footY = scene.rate * scene.uy;
  const uLabelX = scene.ux - 0.7 * scene.uy;
  const uLabelY = scene.uy + 0.7 * scene.ux;
  return (
    <svg viewBox="0 0 320 300" className="mx-auto h-auto w-full max-w-[300px] sm:max-w-[380px]" role="img" aria-label={`방향 ${scene.label}, 변화율 ${scene.rate}`}>
      <path d={`M${sx(-5.8)} ${sy(0)}H${sx(5.8)}M${sx(0)} ${sy(-5.8)}V${sy(5.8)}`} fill="none" stroke="#94a3b8" strokeWidth="1" />
      <circle cx={X0} cy={Y0} r={UNIT * 5} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 4" />
      <text x={sx(-4.6)} y={sy(3.3)} textAnchor="middle" fontSize="11" fill="currentColor">반지름 5</text>
      <path d={`M${sx(-5.8 * scene.ux)} ${sy(-5.8 * scene.uy)}L${sx(5.8 * scene.ux)} ${sy(5.8 * scene.uy)}`} fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="4 3" />
      <path d={`M${sx(4)} ${sy(3)}L${sx(footX)} ${sy(footY)}`} fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 3" />
      <Arrow x={4} y={3} color="#2563eb" />
      <text x={sx(4.2)} y={sy(3.45)} textAnchor="middle" fontSize="12" fontWeight="700" fill="#2563eb">∇f=(4,3)</text>
      {scene.rate !== 0 ? <path d={`M${sx(0)} ${sy(0)}L${sx(footX)} ${sy(footY)}`} fill="none" stroke="#16a34a" strokeWidth="1.25" transform="translate(2 2)" /> : null}
      <circle cx={sx(footX)} cy={sy(footY)} r="3.5" fill="#16a34a" />
      <Arrow x={scene.ux} y={scene.uy} color="#d97706" />
      <text x={sx(uLabelX)} y={sy(uLabelY) + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#b45309">u</text>
      <text x={sx(scene.rateAt[0])} y={sy(scene.rateAt[1])} textAnchor="middle" fontSize="12" fontWeight="700" fill="#15803d">변화율 {String(scene.rate).replace("-", "−")}</text>
    </svg>
  );
}

function RateScale({ rate }: { rate: number }) {
  const pct = ((rate + 5) / 10) * 100;
  return (
    <div className="mx-auto mt-3 max-w-[380px] px-1.5">
      <div className="relative h-5 overflow-visible">
        <span className="absolute inset-x-0 top-1/2 border-t border-[#94a3b8]" />
        <span className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-[#94a3b8]" style={{ left: "50%" }} />
        <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#16a34a]" style={{ left: `${pct}%` }} />
      </div>
      <div className="flex justify-between font-mono text-xs text-muted-foreground">
        <span>−5 (하한)</span>
        <span>0</span>
        <span>+5 (상한)</span>
      </div>
    </div>
  );
}

export default function GradientProjectionViz() {
  return (
    <SceneShell
      eyebrow="내적의 그림"
      title="기울기 끝을 방향선으로 내린 거리가 그 방향의 변화율입니다"
      description="가정 f=x²+3y의 (2,−1)에서 기울기는 파란 화살표 (4,3)입니다. 주황 화살표 u는 같은 눈금에서 길이 1인 방향이고, 초록 점이 기울기 끝에서 u의 선으로 수직으로 내린 자리입니다."
      note="미분 가능한 점에서 보통의 유클리드 길이로 단위 방향을 비교한 국소 결과입니다. 유한한 한 걸음의 크기까지 정해 주지는 않습니다."
      ariaLabel="단위 방향별 변화율을 기울기 끝에서 방향선으로 내린 거리로 비교"
      scenes={SCENES}
      render={(index) => (
        <div className="min-w-0">
          <Drawing scene={SCENES[index]} />
          <RateScale rate={SCENES[index].rate} />
        </div>
      )}
    />
  );
}
